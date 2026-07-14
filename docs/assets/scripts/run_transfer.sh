#!/usr/bin/env bash
#
# Transfer EDGAR filings listed in a CSV from the EDGAR_HTTPS Globus shared
# endpoint to a destination path on SRCC Sherlock.
#
# Usage: ./run_transfer.sh <filings_csv> <dest_path>
#   <filings_csv>  CSV with a "filename" column (e.g. choose_specific_filings_output.csv)
#   <dest_path>    destination directory on Sherlock (e.g. /scratch/users/[sunet])
#
# Run this yourself in an interactive terminal (the auth steps need a browser).
#
set -euo pipefail

# --- Arguments ---------------------------------------------------------------
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <filings_csv> <dest_path>" >&2
  echo "  e.g. $0 choose_specific_filings_output.csv /scratch/users/[sunet]" >&2
  exit 1
fi
CSV=$1
DST_PATH=$2
# Ensure a single trailing slash so it is treated as a base directory.
DST_PATH="${DST_PATH%/}/"

# --- Endpoints ---------------------------------------------------------------
SRC_EP=39d6a4bc-2eac-45af-8039-536b09c3c7c0        # EDGAR_HTTPS
SHERLOCK_EP=6881ae2e-db26-11e5-9772-22000b9da45e   # SRCC Sherlock (/home, /scratch, /groups)
OAK_EP=8b3a8b64-d4ab-4551-b37e-ca0092f769a7        # SRCC Oak (/oak)

# Pick the destination endpoint from the path. The Sherlock collection does not
# expose /oak (it is a separate collection), so /oak destinations must use the
# dedicated Oak endpoint.
case "$DST_PATH" in
  /oak/*) DST_EP=$OAK_EP;      DST_EP_NAME="SRCC Oak" ;;
  *)      DST_EP=$SHERLOCK_EP; DST_EP_NAME="SRCC Sherlock" ;;
esac
echo "Destination: $DST_EP_NAME  ($DST_PATH)"

BATCH=transfer_batch.txt

if [[ ! -f "$CSV" ]]; then
  echo "Error: CSV file not found: $CSV" >&2
  exit 1
fi

# --- 1. Load the Globus CLI --------------------------------------------------
module load system py-globus-cli

# --- 2. Build the transfer batch file from the CSV --------------------------
# The source endpoint root maps to /zfs/data/NODR/EDGAR_HTTPS/, so the source
# path for each file is exactly the CSV "filename" column (edgar/data/<cik>/...).
# We reuse the same relative path on the destination to preserve the layout.
# FPAT lets gawk parse CSV correctly even when company_name contains commas
# inside quotes. Each batch line is: "<source-rel-path> <dest-rel-path>".
gawk 'BEGIN{FPAT="([^,]*)|(\"[^\"]*\")"} NR>1 && NF>=5 {
        f=$5; gsub(/^"|"$/,"",f); if(f!="") print f" "f
     }' "$CSV" > "$BATCH"
echo "Wrote $(wc -l < "$BATCH") entries to $BATCH"

# --- 3. Authenticate (interactive; needs a browser) --------------------------
# Log in if there is no active login at all.
globus whoami >/dev/null 2>&1 || globus login
# Stanford SRCC collections may require a fresh session. This can re-prompt
# even when the session is still valid; that is expected.
globus session update stanford.edu

# --- 4. Submit the transfer --------------------------------------------------
# --sync-level exists makes the command safe to re-run: files already present
# at the destination are skipped. Globus runs the transfer asynchronously on
# the DTN, so this returns immediately with a task ID.
# Capture just the task ID (--jmespath 'task_id' -F unix prints the raw value).
TASK_ID=$(globus transfer "$SRC_EP:/" "$DST_EP:$DST_PATH" \
  --batch "$BATCH" \
  --label "EDGAR filings transfer" \
  --sync-level exists \
  --jmespath 'task_id' --format unix)

echo
echo "Transfer submitted."
echo "  Task ID:     $TASK_ID"
echo "  Web console: https://app.globus.org/activity/$TASK_ID"
echo "  CLI status:  globus task show $TASK_ID"
echo "  Wait/block:  globus task wait $TASK_ID"

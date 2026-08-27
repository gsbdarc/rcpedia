---
date:
  created: 2026-07-14
categories:
    - EDGAR
    - SEC Filings
    - Globus
    - data transfer
    - Redivis
authors:
    - mason
subtitle: Bulk Transferring SEC Filings from the Yens with Globus
---

# Bulk Transferring SEC Filings from the Yens with Globus

The Globus endpoint **EDGAR_HTTPS** provides public access to the collection of SEC filings mirrored on the Yen cluster. If you are a user on the Yens, you already have direct access to the mirror of filings as described in [this blog post](SECfilings.md){:target="_blank"} on the cluster itself. However, if you are not a Yens user or need to work with a large subset of filings on a different system (such as Sherlock), you can leverage the **EDGAR_HTTPS** Globus endpoint to pull filings to that system.

<!-- more -->

!!! note "Background: EDGAR Mirror on the Yens"
    The DARC team maintains a mirror of raw EDGAR text filings on the Yens that is updated weekly. See the [SEC Filings blog post](SECfilings.md) for a full overview of the EDGAR resources available at the GSB.

## Details on the EDGAR_HTTPS Globus Endpoint

[Globus](https://globus.stanford.edu/){:target="_blank"} is a research data management platform that makes it straightforward to transfer large amounts of data between storage systems. In [your Globus dashboard](https://app.globus.org/file-manager){:target="_blank"}, you can manage the set of Collections that you are a member of. There are many useful Globus Collections at Stanford University, including connections to a [variety of Cloud endpoints](https://globus.stanford.edu/cloud.html){:target="_blank"} and [Sherlock and Oak endpoints](https://www.sherlock.stanford.edu/docs/storage/data-transfer/#globus){:target="_blank"}. We maintain a [Yens Globus endpoint](/_user_guide/data_transfer/#globus){:target="_blank"} for general transfers from the Yens filesystem to other destinations.

The Globus endpoint **EDGAR_HTTPS** is special, because it allows public access to the complete set of [EDGAR filings mirrored on the Yens filesystem](SECfilings.md){:target="_blank"} normally reserved for Yen users only. In other words, this endpoint exposes the full EDGAR mirror at:

```title="Yens Path"
/zfs/data/NODR/EDGAR_HTTPS/
```

through the following Globus endpoint:

```title="Globus Endpoint ID"
39d6a4bc-2eac-45af-8039-536b09c3c7c0
```

[This page](https://app.globus.org/file-manager/collections/39d6a4bc-2eac-45af-8039-536b09c3c7c0/overview){:target="_blank"} shows the full details of the endpoint on Globus.

## Example Filing Transfer Workflow

Below is an example workflow that illustrates how to choose a subset of EDGAR filings via [Redivis](_user_guide/redivis/){:target="_blank"} and then transfer the filings to your [scratch space on Sherlock](https://www.sherlock.stanford.edu/docs/storage/filesystems/#scratch){:target="_blank"}.

### Step 1: Select Filings on Redivis

The template Redivis workflow at [this link](https://redivis.com/workflows/ta75-7vs7nca9z){:target="_blank"} queries the [EDGAR Filings dataset](https://redivis.com/datasets/dq12-4q4st0kjt){:target="_blank"} and outputs a table of the specific filings you want to transfer, which you can export as a CSV file. To use it:

1. Open the Workflow and click **Fork** to create your own editable copy.
2. Modify the Transform named **Choose Specific Filings** to filter for the company, form type, date range, or other criteria relevant to your project. You can either use the prebuilt click-and-select options or a direct SQL query. For example, to select all 10-K filings from a specific company:

    ```sql title="Example SQL Filter"
    SELECT *
    FROM `edgar_filings`
    WHERE form_type = '10-K'
      AND cik = 1050122
    ORDER BY date_filed ASC
    ```

3. Run the Transform and in the resulting output table named **Choose Specific Filings output**, click **Export table** and save the list of subset filings as a CSV file.

The `filename` column in the output CSV contains the relative path for each filing (e.g., `edgar/data/1050122/0001047469-03-017249.txt`) that maps directly to the source path on the Globus endpoint.

!!! tip
    Filter your results as narrowly as possible before exporting. EDGAR contains millions of filings and transferring more than you need wastes time and storage.

### Step 2: Run Transfer on Sherlock

With your CSV in hand, copy it to your home directory (or other space) on Sherlock along with [this example transfer script](../../assets/scripts/run_transfer.sh){:target="_blank"}. You can run this script on Sherlock like this:

```bash title="Usage"
./run_transfer.sh <filings_csv> <dest_path>
```

For example, to transfer your selected filings to your Sherlock scratch directory:

```bash title="Example"
./run_transfer.sh choose_specific_filings_output.csv /scratch/users/<sunetid>/edgar/
```

The script will:

1. Load the Globus CLI module on Sherlock (`module load system py-globus-cli`).
2. Parse the CSV to build a list of source/destination file pairs, centered around the `filename` column.
3. Prompt you to authenticate with Globus in a browser if needed.
4. Submit the transfer job asynchronously and return a **Task ID** you can use to monitor progress.

!!! note "Destination Options"
    The script automatically routes to the correct Sherlock Globus endpoint based on your destination path:
    
    | Destination | Endpoint |
    |---|---|
    | `/home/`, `/scratch/`, `/groups/` on Sherlock | SRCC Sherlock |
    | `/oak/` | SRCC Oak |

    Both the [SRCC Sherlock](https://app.globus.org/file-manager/collections/6881ae2e-db26-11e5-9772-22000b9da45e/overview){:target="_blank"} and [SRCC Oak](https://app.globus.org/file-manager/collections/8b3a8b64-d4ab-4551-b37e-ca0092f769a7/overview){:target="_blank"} endpoints are managed by SRCC.

### Step 3: Monitor Your Transfer

After running the above script, a Task ID and links you can use to check on the transfer will be printed in your terminal:

```title="Example Script Output"
Transfer submitted.
  Task ID:     <task-id>
  Web console: https://app.globus.org/activity/<task-id>
  CLI status:  globus task show <task-id>
  Wait/block:  globus task wait <task-id>
```

Globus runs the actual data movement asynchronously, so you can close your terminal after running the script — the transfer will continue in the background. You can monitor progress directly in the [Globus web app](https://app.globus.org/activity){:target="_blank"}.

!!! tip "Safe to Re-Run"
    The transfer script uses `--sync-level exists`, which means files already present at the destination are skipped. It is safe to re-run the script with the same CSV if a transfer is interrupted.

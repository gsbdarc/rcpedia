---
date:
  created: 2025-04-17
categories:
    - LLM
authors:
    - jeffotter 
    - nrapstin
---

# Running Ollama on Stanford Computing Clusters
 
This guide walks you through setting up Ollama across Stanford's GPU computing clusters — [Yen](/_getting_started/yen-servers){target="_blank"}, [Sherlock](/_user_guide/sherlock){target="_blank"}, and [Marlowe](https://docs.marlowe.stanford.edu/){target="_blank"} — to efficiently run large language models (LLMs).

<!-- more -->

[Ollama](https://ollama.com){target="_blank"} is an open‑source, cross‑platform framework for local LLM inference providing a unified REST API and model customization — enabling researcher to pull, run, and manage models like Llama 3, Mistral, and DeepSeek.

## Step 1: Request a GPU Node
=== "Yens"
    ``` title="Terminal Command to Request a GPU on the Yen cluster"
    srun -p gpu -G 1 -C "GPU_MODEL:A40" --ntasks=1 --time=2:00:00 --pty /bin/bash
    ```
=== "Sherlock"
    ``` title="Terminal Command to Request a GPU on Sherlock HPC"
    srun -p gpu --gres=gpu:1 --ntasks=1 --time=2:00:00 --constraint="GPU_MEM:80GB" --mem=50G -c 16 --pty /bin/bash
    ```
=== "Marlowe"
    ``` title="Terminal Command to Request a GPU on Marlowe HPC"
    srun -p preempt -A marlowe-<your-project> --gres=gpu:1 --ntasks=1 --time=2:00:00 --pty /bin/bash
    ```


This ensures you have a GPU node before continuing.



## Step 2: Clone Ollama Repository (All Clusters)
```bash title="Clone This Repo"
cd /<your-project-space>/
git clone https://github.com/gsbdarc/ollama.git
cd ollama
```
Replace `<your-project-space>` with your actual project directory.

## Step 3: Configure Environment

First, set `SCRATCH_BASE` environment variable:
=== "Yens"
    ``` title="Terminal Input"
    ml apptainer
    export SCRATCH_BASE=/scratch/shared/$USER
    ```
=== "Sherlock"
    ``` title="Terminal Input"
    export SCRATCH_BASE=$GROUP_SCRATCH/$USER
    ```
=== "Marlowe"    
    ``` title="Terminal Input"
    export SCRATCH_BASE=/scratch/<your-project>/$USER
    ```

!!! tip "The `SCRATCH_BASE` variable is system specific"
    We reference `SCRATCH_BASE` to store models and other potentially large files on each cluster's scratch file system.


## Step 4: Pull Ollama Container Image
Pull the Ollama image from DockerHub (takes a while):
``` title="Download Ollama Container Image"
apptainer pull ollama.sif docker://ollama/ollama
```

## Step 5: Define the Ollama Wrapper Function (All Clusters)
To simplify running the Ollama server and issuing client commands (e.g. `pull`, `list`) on an HPC cluster, define the following function. You must export `SCRATCH_BASE` environment variable before running the function. 

This function will pick an available random port and start Ollama server:
```bash title="Terminal Input"
ollama() {
  local LOWERPORT=32768 UPPERPORT=60999
  local S PORT_FILE PORT HOST

  # 1) Require SCRATCH_BASE
  if [ -z "$SCRATCH_BASE" ]; then
    echo "ERROR: please export SCRATCH_BASE" >&2
    return 1
  fi

  # 2) Prep a single scratch tree for keys + models + port.txt
  S="${SCRATCH_BASE}/ollama"
  mkdir -p "${S}"/{.ollama,models}
  PORT_FILE="${S}/port.txt"

  # 3) If no port yet, or user explicitly asked "serve", pick & record one
  if [ "$1" = "serve" ] || [ ! -f "$PORT_FILE" ]; then
    # pick a free port
    while :; do
      PORT=$(shuf -i "${LOWERPORT}-${UPPERPORT}" -n1)
      if ! ss -tuln | grep -q ":${PORT} "; then break; fi
    done
    echo "$PORT" > "$PORT_FILE"
    HOST="http://0.0.0.0:${PORT}"
    echo "Starting Ollama server on port: ${PORT}"
    shift  # drop "serve" so we can pass any extra args through

    apptainer run \
      --nv \
      --contain \
      --home "${S}:/root" \
      --env OLLAMA_MODELS="/root/models" \
      --env OLLAMA_HOST="${HOST}" \
      --env OLLAMA_PORT="${PORT}" \
      ollama.sif serve "$@"
    return
  fi

  # 4) Otherwise it's a client command: read the port and forward
  PORT=$(<"$PORT_FILE")
  HOST="http://0.0.0.0:${PORT}"
  echo "Forwarding 'ollama $*' to server at ${HOST}"

  apptainer run \
    --nv \
    --contain \
    --home "${S}:/root" \
    --env OLLAMA_MODELS="/root/models" \
    --env OLLAMA_HOST="${HOST}" \
    --env OLLAMA_PORT="${PORT}" \
    ollama.sif "$@"
}

```

## Step 6: Start the Ollama Server (All Clusters)
Launch Ollama server:
```bash title="Start Ollama Server on GPU node"
ollama serve &
```
You'll see output similar to:

```{.yaml .no-copy title="Terminal Output"}
Starting Ollama server on port: <port>
```

This port number is recorded in `${SCRATCH_BASE}/ollama/port.txt` file.

## Step 7: Pull a Model
Download a specific LLM model for inference. Example:
```bash title="Terminal Input"
ollama pull deepseek-r1:70b
```

## Step 8: Run Inference
Test inference directly:
```bash title="Terminal Input"
ollama run deepseek-r1:70b "Hello, Ollama!"
```

## Step 9: Check Server Status from a Different Node
From another login node, verify the server is running:
```bash title="Terminal Input From Login Node"
curl http://<hostname>:<port>
```
Replace `<hostname>` with your GPU node's hostname and `<port>` with your Ollama server's port number.

Expected output:
```{.yaml .no-copy title="Terminal Output"}
Ollama is running
```

## Step 10: Run a Python Script to Test Server
Use a provided test script (`test.py`) from a login node:
```bash title="Terminal Input From Login Node"
python3 test.py <hostname> --port <port>
```

🚀 You’re now set up and ready to explore powerful language models on Stanford's GPU cluster!

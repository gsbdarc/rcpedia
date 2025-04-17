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
 
This guide walks you through setting up Ollama across Stanford's GPU computing clusters—Yen, Sherlock, and Marlowe—to efficiently run large language models (LLMs).

<!-- more -->

## Step 1: Request a GPU Node
=== "Yens"
    ```
    srun -p gpu -G 1 -C "GPU_MODEL:A40" --ntasks=1 --time=2:00:00 --pty /bin/bash
    ```
=== "Sherlock"
    ```
    srun -p gpu --gres=gpu:1 --ntasks=1 --time=2:00:00 --constraint="GPU_MEM:80GB" --mem=50G -c 16 --pty /bin/bash
    ```
=== "Marlowe"
    ```
    srun -p preempt -A marlowe-<your-project> --gres=gpu:1 --ntasks=1 --time=2:00:00 --pty /bin/bash
    ```


This ensures you have a GPU node before continuing.



## Step 2: Clone Ollama Repository (All Clusters)
```bash
cd /<your-project-space>/
git clone https://github.com/gsbdarc/ollama.git
cd ollama
```
Replace `<your-project-space>` with your actual project directory.

## Step 3: Configure Environment

First, set `SCRATCH_BASE` environment variable:
=== "Yens"
    ```
    ml apptainer
    export SCRATCH_BASE=/scratch/shared/$USER
    ```
=== "Sherlock"
    ```
    export SCRATCH_BASE=$GROUP_SCRATCH/$USER
    ```
=== "Marlowe"    
    ```
    export SCRATCH_BASE=/scratch/<your-project>/$USER
    ```

!!! tip "`SCRATCH_BASE` is system specific"
    We reference `SCRATCH_BASE` to store models and other potentially large files.

On all clusters, run:
```
mkdir -p $SCRATCH_BASE/ollama/models
export APPTAINER_CACHEDIR=$SCRATCH_BASE/apptainer_cache
export APPTAINER_BIND="$SCRATCH_BASE/ollama:/root/ollama"
``` 


## Step 4: Pull Ollama Container Image
Pull the Ollama image from DockerHub (takes a while):
```
apptainer pull ollama.sif docker://ollama/ollama
```

## Step 5: Define the Ollama Helper Function (All Clusters)

This function will pick an available random port and start Ollama server:
```
ollama() {
  LOWERPORT=32768
  UPPERPORT=60999

  find_available_port() {
    while true; do
      local port=$(shuf -i ${LOWERPORT}-${UPPERPORT} -n 1)
      if ! ss -tuln | grep -q ":${port} "; then
        echo "$port"
        return
      fi
    done
  }

  OLLAMA_PORT=$(find_available_port)
  echo "Starting Ollama server on port: ${OLLAMA_PORT}"

  apptainer run \
    --nv \
    --no-home \
    --env OLLAMA_MODELS=/root/ollama/models \
    --env OLLAMA_HOST="http://0.0.0.0:${OLLAMA_PORT}" \
    --env OLLAMA_PORT="${OLLAMA_PORT}" \
    ollama.sif \
    "$@"
}
```

## Step 6: Start the Ollama Server (All Clusters)
Launch Ollama server:
```
ollama serve &
```
You'll see output similar to:
```
Starting Ollama server on port: <port>
```
Make a note of this port number.

## Step 7: Pull a Model
Download a specific LLM model for inference. Example:
```
ollama pull deepseek-r1:70b
```

## Step 8: Run Inference
Test inference directly:
```
ollama run deepseek-r1:70b "Hello, Ollama!"
```

## Step 9: Check Server Status from a Different Node
From another login node, verify the server is running:
```
curl http://<hostname>:<port>
```
Replace `<hostname>` with your GPU node's hostname and `<port>` with your Ollama server's port number.

Expected output:
```
Ollama is running
```

## Step 10: Run a Python Script to Test Server
Use a provided test script (`test.py`) from a login node:
```
python3 test.py <hostname> --port <port>
```

🚀 You’re now set up and ready to explore powerful language models on Stanford's GPU cluster!

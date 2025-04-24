---
date:
  created: 2025-04-24
categories:
    - LLM
authors:
    - jeffotter 
    - nrapstin
---

# Running Ollama on Stanford Computing Clusters
 
This guide walks you through setting up Ollama across Stanford's GPU computing clusters — [Yen](/_getting_started/yen-servers){target="_blank"}, [Sherlock](/_user_guide/sherlock){target="_blank"}, and [Marlowe](https://docs.marlowe.stanford.edu/){target="_blank"} — to efficiently run large language models (LLMs).

<!-- more -->

[Ollama](https://ollama.com){target="_blank"} is an open‑source, cross‑platform framework for local LLM inference providing a unified REST API and model customization — enabling researchers to pull, run, and manage models like Llama 3, Mistral, and DeepSeek.

## Quick Start
This section will take you step by step through the process of setting up Ollama on a GPU node. To run many of these steps in batch jobs, see the [Batch Jobs](#batch-jobs) section below.

### Step 1: Request a GPU Node
=== "Yens"
    ``` title="Terminal Command to Request a GPU on the Yen cluster"
    srun -p gpu -G 1 -C "GPU_MODEL:A40" --n=1 --t=2:00:00 --pty /bin/bash
    ```
=== "Sherlock"
    ``` title="Terminal Command to Request a GPU on Sherlock HPC"
    srun -p gpu -G=gpu:1 --n=1 --t=2:00:00 --m=50G -c 16 --pty /bin/bash
    ```
=== "Marlowe"
    ``` title="Terminal Command to Request a GPU on Marlowe HPC"
    srun -p preempt -A marlowe-<your-project> -G=gpu:1 --n=1 --t=2:00:00 --pty /bin/bash
    ```
    

This ensures you have a GPU node before continuing. 

!!! warning "Request a GPU with Enough RAM to Fit the Model"
    - The Yens have two types of GPUs - NVIDIA A30 with 24 GB of GPU RAM and A40 with 48GB of GPU RAM. 
    - Sherlock has a variety of GPU sizes on the `gpu` partition from 10GB to 80GB of GPU RAM depending on the GPU type. 
    - Marlowe only has NVIDIA H100 GPUs with 80G of GPU RAM each.

Below, pick a model from [Ollama](https://ollama.com/search){:target="_blank"} that fits in the GPU type the job is allocated or constraint your request with `--constaint` slurm flag to ensure your job requests enough RAM to fit the model into the GPU.


### Step 2: Clone Ollama Repository (All Clusters)
```bash title="Clone This Repo"
cd /<your-project-space>/
git clone https://github.com/gsbdarc/ollama.git
cd ollama
```
Replace `<your-project-space>` with your actual project directory.

### Step 3: Configure Environment

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


### Step 4: Pull Ollama Container Image
Pull the Ollama image from DockerHub (takes a while):
``` title="Download Ollama Container Image"
apptainer pull ollama.sif docker://ollama/ollama
```

### Step 5: Define the Ollama Wrapper Function (All Clusters)
To simplify running the Ollama server and issuing client commands (e.g. `pull`, `list`) on an HPC cluster, source a wrapper function defined in `ollama.sh`. You must export `SCRATCH_BASE` environment variable before running the function. 

This function will pick an available random port and start Ollama server:
```bash title="Terminal Input"
source ollama.sh
```

### Step 6: Start the Ollama Server (All Clusters)
Launch Ollama server:
```bash title="Start Ollama Server on GPU node"
ollama serve &
```
You'll see output similar to:

```{.yaml .no-copy title="Terminal Output"}
Starting Ollama server binding to 0.0.0.0:<port>
Advertising server to clients at http://<hostname>:<port>
```
The server GPU hostname is written to `${SCRATCH_BASE}/ollama/host.txt` file and the port number is written to `${SCRATCH_BASE}/ollama/port.txt` file.

### Step 7: Pull a Model
Download a specific LLM model for inference. Example:
```bash title="Terminal Input"
ollama pull deepseek-r1:7b
```

### Step 8: Run Inference
Test inference directly:
```bash title="Terminal Input"
ollama run deepseek-r1:7b "Hello, Ollama!"
```

### Step 9: Check Server Status from a Different Node
From another login node, verify the server is running:
```bash title="Terminal Input From Login Node"
curl http://<hostname>:<port>
```
Replace `<hostname>` with your GPU node's hostname and `<port>` with your Ollama server's port number.

Expected output:
```{.yaml .no-copy title="Terminal Output"}
Ollama is running
```

### Step 10: Run a Python Script to Test Server
Use a provided test script (`test.py`) from a login node:
```bash title="Terminal Input From Login Node"
python3 test.py --host <hostname> --port <port>
```
Again, replace `<hostname>` with your GPU node's hostname and `<port>` with your Ollama server's port number.


## Batch Jobs
For batch jobs, you can use Slurm scripts to automate the process of launching the Ollama server and running client jobs. This makes it a two step process: first, launch the server on a GPU node, and then run client jobs from other nodes.

### Step 1: Slurm Script to Launch Ollama on a GPU Node
Submit with `sbatch run_ollama_server.slurm`.
It will request a GPU node, export your scratch base, source the `ollama()` function, and start the server:

=== "Yens"
    ```bash title="run_ollama_server.slurm"
    #!/bin/bash
    #SBATCH -J ollama-server              # job name
    #SBATCH -p gpu                        # partition
    #SBATCH -C "GPU_MODEL:A40"            # constraint
    #SBATCH -G gpu:1                      # gres
    #SBATCH -n 1                          # ntasks
    #SBATCH -c 4                          # cpus-per-task
    #SBATCH -t 2:00:00                    # time
    #SBATCH -o ollama-server-%j.out       # output file
    
    ml apptainer
    export SCRATCH_BASE=/scratch/shared/$USER
    
    source ollama.sh
    
    # start the server
    ollama serve
    ```
=== "Sherlock"
    ```bash title="run_ollama_server.slurm"
    #!/bin/bash
    #SBATCH -J ollama-server
    #SBATCH -p gpu
    #SBATCH -G gpu:1
    #SBATCH -n 1
    #SBATCH -c 4
    #SBATCH -t 2:00:00
    #SBATCH -o ollama-server-%j.out

    export SCRATCH_BASE=$GROUP_SCRATCH/$USER

    source ollama.sh

    # start the server
    ollama serve
    ```
=== "Marlowe"
    ```bash title="run_ollama_server.slurm"
    #!/bin/bash
    #SBATCH -J ollama-server
    #SBATCH -A marlowe-<your-project>  # account
    #SBATCH -p preempt
    #SBATCH -G gpu:1
    #SBATCH -n 1
    #SBATCH -c 4
    #SBATCH -t 2:00:00
    #SBATCH -o ollama-server-%j.out
    
    export SCRATCH_BASE=/scratch/<your-project>/$USER
    source ollama.sh
    
    # start the server 
    ollama serve
    ```

Once submitted, the job’s log file (`ollama-server-<jobid>.out`) will contain the “Starting Ollama server…” message and port.

### Step 2: Slurm Script to Run Clients from Other Nodes
While the `run_ollama_server.slurm` job is running, we can now connect to the model API from other nodes.
Submit with `sbatch run_ollama_server.slurm`.

=== "Yens"
    ```bash title="run_ollama_client.slurm"
    #!/bin/bash
    #SBATCH -J ollama-client
    #SBATCH -p normal
    #SBATCH -x yen15
    #SBATCH -n 1
    #SBATCH -c 2
    #SBATCH -t 00:30:00
    #SBATCH -o ollama-client-%j.out
    
    ml apptainer
    export SCRATCH_BASE=/scratch/shared/$USER
    
    # get the server host and port from scratch
    GPU_HOST=$(<"${SCRATCH_BASE}/ollama/host.txt")
    PORT=$(<"${SCRATCH_BASE}/ollama/port.txt")
    
    source ollama.sh
    
    echo "Pulling model deepseek-r1:7b…"
    ollama pull deepseek-r1:7b
    
    echo "Starting python script..."
    python3 test.py --host $GPU_HOST --port $PORT
    ```
=== "Sherlock"
    ```bash title="run_ollama_client.slurm"
    #!/bin/bash
    #SBATCH -J ollama-client
    #SBATCH -p normal,gsb
    #SBATCH -n 1
    #SBATCH -c 2
    #SBATCH -t 00:30:00
    #SBATCH -o ollama-client-%j.out
    
    export SCRATCH_BASE=$GROUP_SCRATCH/$USER
    
    # get the server port from scratch
    PORT=$(<"${SCRATCH_BASE}/ollama/port.txt")
    GPU_HOST=$(<"${SCRATCH_BASE}/ollama/host.txt")
    
    source ollama.sh
    
    echo "Pulling model deepseek-r1:7b…"
    ollama pull deepseek-r1:7b
    
    echo "Starting python script..."
    python3 test.py --host $GPU_HOST --port $PORT
    ```
=== "Marlowe"
    ```bash title="run_ollama_client.slurm"
    #!/bin/bash
    #SBATCH -J ollama-client
    #SBATCH -A marlowe-<your-project>
    #SBATCH -p preempt
    #SBATCH -G gpu:1
    #SBATCH -n 1
    #SBATCH -c 2
    #SBATCH -t 00:30:00
    #SBATCH -o ollama-client-%j.out
    
    export SCRATCH_BASE=/scratch/<your-project>/$USER
    
    # get the server host and port from scratch
    GPU_HOST=$(<"${SCRATCH_BASE}/ollama/host.txt")
    PORT=$(<"${SCRATCH_BASE}/ollama/port.txt")
    
    source ollama.sh
    
    echo "Pulling model deepseek-r1:7b..."
    ollama pull deepseek-r1:7b
    
    echo "Starting python script..."
    python3 test.py --host $GPU_HOST --port $PORT
    ```
## Advanced Usage



🚀 You’re now set up and ready to explore powerful language models on Stanford's GPU clusters!

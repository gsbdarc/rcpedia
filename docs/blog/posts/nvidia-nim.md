---
date:
  created: 2026-04-20
categories:
    - LLM
authors:
    - nrapstin
---

# Self-Hosting LLMs with NVIDIA NIM on the Yens

NVIDIA NIM (NVIDIA Inference Microservices) lets you deploy optimized, production-ready large language models on your own infrastructure. Instead of sending data to a third-party API, you pull a pre-packaged container, start it on a GPU node, and query it through a standard OpenAI-compatible REST endpoint — all within Stanford's network.

This guide walks through deploying Google's [Gemma 4 31B IT](https://build.nvidia.com/google/gemma-4-31b-it){target="_blank"} model on a single H200 GPU on the Yen cluster using Singularity containers.

!!! warning "H200 GPUs Required"
    NIM containers require H200 GPUs and do not work on older GPU architectures such as the A30 or A40. On the Yen cluster, the only node with H200 GPUs is **`yen-gpu4`**. All examples in this guide use `yen-gpu4` as the target node.

<!-- more -->

## Why NIM?

If you've used [Ollama](/blog/2025/05/12/running-ollama-on-stanford-computing-clusters/){target="_blank"} to run models on Stanford clusters, NIM fills a similar niche but with a different approach. While Ollama provides a convenient wrapper around open-source models, NIM delivers NVIDIA's own optimized inference stack — the same engine that powers their cloud API — packaged as containers you can run locally.

Key advantages of NIM:

- **Optimized inference**: NIM containers use TensorRT-LLM under the hood, providing high-throughput, low-latency inference tuned for NVIDIA GPUs.

- **OpenAI-compatible API**: the running container exposes a `/v1/chat/completions` endpoint, so existing code that talks to OpenAI or other providers works with minimal changes.

- **Data stays local**: like Ollama, everything runs on the Yen cluster — no data leaves Stanford's infrastructure, making it suitable for sensitive or licensed datasets.

- **Reproducible deployments**: the container image pins a specific model version, runtime, and optimization profile. Anyone pulling the same image gets identical behavior.

!!! info "Marlowe Users"
    This guide is adapted from [Marlowe's NGC container example](https://docs.marlowe.stanford.edu/ngc_example.html){target="_blank"} for the Yen cluster environment. If you are running on Marlowe, refer to that documentation instead.

## Prerequisites

1. **Create an NVIDIA Developer account** — if you don't already have one, sign up at [developer.nvidia.com](https://developer.nvidia.com){target="_blank"}.

2. **Generate an NGC API key** — navigate to the [Gemma 4 31B IT model card](https://build.nvidia.com/google/gemma-4-31b-it){target="_blank"} on NVIDIA's Build portal and click **Get API Key** at the top of the Python code example. Save this key securely — you will need it to pull the container image and authenticate at runtime.

!!! note "Some models require accepting license terms"
    Gemma does not require accepting a license, but other NIM models (such as GPT OSS 120B) may require you to accept terms on the model card before you can generate a key and pull the container.

!!! danger "Do Not Hardcode API Keys"
    Never paste your NGC API key directly into scripts or commit it to version control. Store it in an environment variable or a `.env` file excluded from git.

## Step 1: Request a GPU Node

Gemma 4 31B IT fits comfortably on a single H200 GPU. Request an interactive allocation:

```bash title="Request an H200 GPU on the Yens"
salloc -p gpu -G 1 -C "GPU_MODEL:H200" -t 5:00:00
```

Once Slurm grants the allocation, connect to `yen-gpu4`:

```bash title="SSH into the GPU node"
ssh yen-gpu4
```

## Step 2: Set Up the Environment

On the GPU node, load the Singularity module and configure directories. NIM needs several writable paths for its cache, NGINX proxy, and generated configurations. We use `/scratch/shared/` since these files can be large:

```bash title="Load Singularity and create directories"
ml singularity

export BASE_DIR="/scratch/shared/$USER/nim"
export LOCAL_NIM_CACHE="$BASE_DIR/cache"
export LOCAL_NIM_WORK="$BASE_DIR/work"

mkdir -p "$LOCAL_NIM_CACHE"
mkdir -p "$LOCAL_NIM_WORK/nginx"
mkdir -p "$LOCAL_NIM_WORK/configs"
mkdir -p "$BASE_DIR/tmp"
mkdir -p "$BASE_DIR/singularity_cache"
mkdir -p "$BASE_DIR/singularity_config"
mkdir -p "$BASE_DIR/triton"

export SINGULARITY_TMPDIR="$BASE_DIR/tmp"
export SINGULARITY_CACHEDIR="$BASE_DIR/singularity_cache"
export SINGULARITY_CONFIGDIR="$BASE_DIR/singularity_config"
export TRITON_CACHE_DIR="$BASE_DIR/triton"

chmod -R 777 "$BASE_DIR"
cd "$BASE_DIR"
```

!!! tip "Why `/scratch/shared/`?"
    The NIM container image and model cache can be tens of gigabytes. The `/scratch/shared/` filesystem on the Yens is designed for this kind of temporary, large-file storage. Files on scratch are not backed up and may be purged periodically, so don't store anything you can't regenerate.

!!! warning "Singularity and Triton caches can fill your home directory"
    By default, Singularity writes cache and configuration files to `~/.singularity` and Triton caches compiled GPU kernels in `~/.triton`. Both can grow to several gigabytes and fill your home directory quota. The setup above redirects them to scratch by setting `SINGULARITY_CACHEDIR`, `SINGULARITY_CONFIGDIR`, and `TRITON_CACHE_DIR`. If you've already run NIM without these settings, you can safely clean up with:

        rm -rf ~/.singularity ~/.triton


## Step 3: Authenticate with NVIDIA's Container Registry

Set your NGC API key as an environment variable, then log into NVIDIA's container registry:

```bash title="Export your NGC API key"
export NGC_API_KEY="<your-ngc-api-key>"
```

```bash title="Log into the NVIDIA container registry"
singularity remote login -u '$oauthtoken' docker://nvcr.io
```

When prompted for a password, paste your NGC API key.

## Step 4: Pull the Container Image

Download the Gemma 4 31B IT NIM container. This is a large download and may take several minutes:

```bash title="Pull the NIM container image"
singularity pull "$BASE_DIR/gemma-4-31b-it.sif" docker://nvcr.io/nim/google/gemma-4-31b-it:latest
```

!!! note
    The `.sif` file is the Singularity container image. Once pulled, you can reuse it across multiple sessions without re-downloading — just make sure the file persists on scratch between jobs.


## Step 5: Check Available Profiles

NIM ships with multiple optimization profiles tuned for different GPU architectures and precision modes. Before launching, you can list the profiles available for your hardware:

```bash title="List available model profiles"
singularity run --nv --cleanenv \
    --writable-tmpfs \
    --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
    --bind "$LOCAL_NIM_WORK/nginx:/opt/nim/nginx" \
    --bind "$LOCAL_NIM_WORK/configs:/opt/nim/generated_configs" \
    --env NGC_API_KEY=$NGC_API_KEY \
    --env NIM_TENSOR_PARALLEL_SIZE=1 \
    --env TRITON_CACHE_DIR=$TRITON_CACHE_DIR \
    "$BASE_DIR/gemma-4-31b-it.sif" list-model-profiles
```

NIM automatically selects the best compatible profile for your GPU at launch. To force a specific profile, add the `NIM_MODEL_PROFILE` environment variable to the launch command in the next step:

```bash title="Example: select a specific profile"
--env NIM_MODEL_PROFILE="<profile-id-from-list>"
```

## Step 6: Launch the Model

Start the NIM container with GPU access. The `--nv` flag enables NVIDIA GPU passthrough, and the bind mounts give the container access to its required working directories:

```bash title="Run the NIM container"
singularity run --nv --cleanenv \
    --writable-tmpfs \
    --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
    --bind "$LOCAL_NIM_WORK/nginx:/opt/nim/nginx" \
    --bind "$LOCAL_NIM_WORK/configs:/opt/nim/generated_configs" \
    --env NGC_API_KEY=$NGC_API_KEY \
    --env NIM_TENSOR_PARALLEL_SIZE=1 \
    --env CUDA_VISIBLE_DEVICES=1 \
    --env TRITON_CACHE_DIR=$TRITON_CACHE_DIR \
    "$BASE_DIR/gemma-4-31b-it.sif"
```

!!! warning "Set `CUDA_VISIBLE_DEVICES` to match your allocated GPU"
    Some GPU nodes (e.g., `yen-gpu4`) have multiple GPUs. `CUDA_VISIBLE_DEVICES` tells NIM which GPU to use. Check which device was assigned to your allocation — for example, if Slurm gave you device `0`, set `--env CUDA_VISIBLE_DEVICES=0`. Using the wrong device ID will either fail or collide with another user's job.

The container will download model weights on first launch (cached for subsequent runs), compile optimized inference kernels, and start serving on port **8000**. This startup process can take several minutes — wait until you see log output indicating the server is ready.

!!! note "Port Access and Choosing a Different Port"
    NIM serves on port `8000` by default. This port is accessible to **any user on the Yen cluster** — there is no authentication on the endpoint, so anyone who knows the hostname and port can send requests to your running model.

    If port `8000` is already in use by another user on the same node, or if you want to avoid collisions, you can change the port by adding the `NIM_HTTP_API_PORT` environment variable to the launch command:

        --env NIM_HTTP_API_PORT=8001

    Remember to update the port in your `curl` and Python client calls accordingly.

### Environment Variables

The launch command above uses the following environment variables:

| Variable | Description |
|---|---|
| `NGC_API_KEY` | Your NVIDIA NGC API key. Required to download model weights on first launch. |
| `CUDA_VISIBLE_DEVICES` | Which GPU device to use. Nodes like `yen-gpu4` have two H200 GPUs (devices `0` and `1`) — set this to the device assigned to your Slurm allocation. Using the wrong device will either fail or collide with another user's job. |
| `NIM_TENSOR_PARALLEL_SIZE` | Number of GPUs to shard the model across. Set to `1` when running on a single GPU. Increase this if your Slurm allocation includes multiple GPUs and the model is too large to fit on one. |
| `TRITON_CACHE_DIR` | Where Triton stores compiled GPU kernels. We redirect this to scratch to avoid filling your home directory (see the [warning above](#step-2-set-up-the-environment)). |

You can also tune inference behavior with additional variables that are not included in the command above:

| Variable | Description |
|---|---|
| `NIM_MAX_MODEL_LEN` | Maximum sequence length (input + output tokens combined). Longer sequences use more GPU memory. Defaults vary by model — set this if you need longer contexts or want to limit memory usage (e.g., `16384`). |
| `NIM_GPU_MEMORY_UTILIZATION` | Fraction of GPU memory NIM is allowed to use, between `0` and `1`. A value like `0.85` leaves headroom for the operating system and other processes. Lower it if you see out-of-memory errors. |

For a full list of configuration options, see the [NVIDIA NIM configuration documentation](https://docs.nvidia.com/nim/large-language-models/latest/configuration.html){target="_blank"}.


## Step 7: Query the Model from a Login Node
Once the server is running, open a **second terminal** on any interactive Yen node and send a request using `curl`:

```bash title="Send a chat completion request"
curl -s -X POST http://yen-gpu4:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "google/gemma-4-31b-it",
    "messages": [
      {
        "role": "user",
        "content": "What are three advantages of running LLMs on local infrastructure?"
      }
    ],
    "max_tokens": 256,
    "temperature": 0.7
  }'
```

The response follows the OpenAI chat completions format, so you can also use the `openai` Python library by pointing it at `http://yen-gpu4:8000`:

```python title="Python client example"
from openai import OpenAI

client = OpenAI(
    base_url="http://yen-gpu4:8000/v1",
    api_key="not-used"  # NIM doesn't require a client-side key
)

response = client.chat.completions.create(
    model="google/gemma-4-31b-it",
    messages=[
        {"role": "user", "content": "Summarize the key ideas behind LoRA fine-tuning."}
    ],
    max_tokens=256
)

print(response.choices[0].message.content)
```


## Clean Up

When you're done, press `Ctrl+C` in the terminal running the NIM container to stop it, then release your GPU allocation:

```bash title="Release the Slurm allocation"
exit
```

The cached model weights and container image remain on scratch for future use. If you no longer need them:

```bash title="Remove NIM files from scratch"
rm -rf /scratch/shared/$USER/nim
```

## Summary

| Step | What happens |
|---|---|
| Request GPU | `salloc` reserves an H200 node |
| Set up environment | Create scratch directories for NIM cache and configs |
| Authenticate | Log into NVIDIA's container registry with your NGC key |
| Pull image | Download the NIM container (one-time) |
| Launch | Start the container — model weights are cached after first run |
| Query | Hit the OpenAI-compatible API on port 8000 |

## Running as a Batch Job

The interactive workflow above is useful for testing, but for longer-running inference you can submit a Slurm batch script instead. This starts the NIM server on a GPU node in the background so you can query it from any Yen login node.

Create a file called `run_nim_server.slurm`:

```bash title="run_nim_server.slurm"
#!/bin/bash
#SBATCH -J nim-server
#SBATCH -p gpu
#SBATCH -C "GPU_MODEL:H200"
#SBATCH -G 1
#SBATCH -n 1
#SBATCH -c 4
#SBATCH -t 5:00:00
#SBATCH -o nim-server-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=youremail@stanford.edu

ml singularity

export BASE_DIR="/scratch/shared/$USER/nim"
export LOCAL_NIM_CACHE="$BASE_DIR/cache"
export LOCAL_NIM_WORK="$BASE_DIR/work"
export NGC_API_KEY="<your-ngc-api-key>"

mkdir -p "$LOCAL_NIM_CACHE"
mkdir -p "$LOCAL_NIM_WORK/nginx"
mkdir -p "$LOCAL_NIM_WORK/configs"
mkdir -p "$BASE_DIR/tmp"
mkdir -p "$BASE_DIR/singularity_cache"
mkdir -p "$BASE_DIR/singularity_config"
mkdir -p "$BASE_DIR/triton"

export SINGULARITY_TMPDIR="$BASE_DIR/tmp"
export SINGULARITY_CACHEDIR="$BASE_DIR/singularity_cache"
export SINGULARITY_CONFIGDIR="$BASE_DIR/singularity_config"
export TRITON_CACHE_DIR="$BASE_DIR/triton"

chmod -R 777 "$BASE_DIR"

echo "Starting NIM server on $(hostname)"

singularity run --nv --cleanenv \
    --writable-tmpfs \
    --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
    --bind "$LOCAL_NIM_WORK/nginx:/opt/nim/nginx" \
    --bind "$LOCAL_NIM_WORK/configs:/opt/nim/generated_configs" \
    --env NGC_API_KEY=$NGC_API_KEY \
    --env NIM_TENSOR_PARALLEL_SIZE=1 \
    --env CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES \
    --env TRITON_CACHE_DIR=$TRITON_CACHE_DIR \
    "$BASE_DIR/gemma-4-31b-it.sif"
```

Slurm sets `CUDA_VISIBLE_DEVICES` automatically based on which GPU was allocated to the job. The `--cleanenv` flag strips host environment variables from the container, so we pass it through explicitly with `--env`.

Submit the job:

```bash title="Submit the batch job"
sbatch run_nim_server.slurm
```

Once the job is running, check the log file to find the GPU node hostname:

```bash title="Check the log for the hostname"
cat nim-server-<jobid>.out
```

Then query the model from any Yen login node:

```bash title="Query from a login node"
curl -s -X POST http://yen-gpu4:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "google/gemma-4-31b-it",
    "messages": [
      {"role": "user", "content": "What is NVIDIA NIM?"}
    ],
    "max_tokens": 256
  }'
```

To stop the server, cancel the Slurm job:

```bash title="Cancel the job"
scancel <jobid>
```

NIM gives you a fast, optimized path to self-hosting LLMs on Stanford's GPU infrastructure. Combined with Slurm for resource management and scratch storage for large files, it's a practical way to run inference workloads that need to stay on-premises.

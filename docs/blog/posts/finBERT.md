---
date:
  created: 2024-03-28
categories:
    - LLM
    - BERT 
    - GPU
    - Sentiment Analysis
authors:
    - nrapstin
---


# Fine-Tuning BERT for Sentiment Analysis on Financial News

In this example, we train a transformer model for sentiment analysis on financial news using Stanford GSB's Yens GPU partition. This task can provide insights into market movements based on news sentiment. 

<!-- more -->

!!! note
    This is a basic example. In a real-world scenario, you'd use a large dataset, fine-tune the model more thoroughly, and handle additional considerations.


### Model
For our sentiment analysis task, we are utilizing the BERT (Bidirectional Encoder Representations from Transformers) model. BERT's pre-trained models can be fine-tuned to create state-of-the-art models for a wide range of tasks, including sentiment analysis.

We'll use the [Transformers library](https://huggingface.co/docs/transformers/index){:target="_blank"}, which provides these pre-trained models and tokenizers, in conjunction with [PyTorch Lightning](https://pypi.org/project/pytorch-lightning){:target="_blank"}. PyTorch Lightning is a lightweight [PyTorch](https://pytorch.org){:target="_blank"} wrapper that helps researchers streamline their model training and evaluation.

### Data

We'll use the [Kaggle dataset](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news){:target="_blank"} of financial phrase bank ([Malo et al., 2014](https://arxiv.org/abs/1307.5336){:target="_blank"}). The collection of financial news headlines was annotated by 16 people with background knowledge on financial markets. We will use over two thousand sentences that had 100% agreement in annotations, each sentence labeled by 5-8 people. The data file, `Sentences_AllAgree.txt`, has the following format:

```{.yaml .no-copy title="Data Format"}
sentence@sentiment
```

where sentiment is either positive, neutral, or negative. Positive sentiment means that the news headline may positively influence the stock price; negative sentiment means that the headline may negatively influence the stock price; and neutral sentiment means that the headline is not relevant to the stock price.

For example, 

```{.yaml .no-copy title="Example Sentence with Sentiment"}
For the last quarter of 2010 , Componenta 's net sales doubled to EUR131m from EUR76m for the same period a year earlier , while it moved to a zero pre-tax profit from a pre-tax loss of EUR7m .@positive
``` 

### Training Script

The training script:

- Defines a custom dataset to handle financial news texts and their labels.
- Uses BERT from the `transformers` library for sentiment analysis.
- Trains the model using PyTorch Lightning's Trainer on [Yen's GPU](/_user_guide/best_practices_gpu){:target="_blank"}.


## Login to Yens

Enter your SUNet ID in place of `$USER` and Duo authenticate to login.

```title="Terminal Input"
ssh $USER@yen.stanford.edu
```

## Clone Example Repo
The data, Python training script, and example Slurm script are in [GitHub repo](https://github.com/gsbdarc/yens-gpu-demo){:target="_blank"} that you will need to copy to the Yens.  

On the Yens, navigate where you want to copy the repo to and run:

```title="Terminal Input"
git clone https://github.com/gsbdarc/yens-gpu-demo.git  
```

After the repo is downloaded, `cd` into the `yens-gpu-demo` directory:

```title="Terminal Input"
cd yens-gpu-demo
```

## Check Available GPU Resources

Before submitting the Slurm script, check how many GPU’s, CPU and CPU RAM are available with:

```title="Terminal Input"
squeue -p gpu 
```

to see all running and pending jobs currently in the `gpu` partition. 

The command:

```title="Terminal Input"
sinfo -p gpu
```

will print how many nodes are idle/allocated/mix (`mix` means some cores are idle and some -- allocated):

```{.yaml .no-copy title="Terminal Output Example"}
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 1-00:00:00      2    mix yen-gpu[2-3]
gpu          up 1-00:00:00      1   idle yen-gpu1
```

Lastly, check on `gpu` partition limits with:

```title="Terminal Input"
sacctmgr show qos gpu
```

that will list relevant columns such as `MaxTRESPU` for how many GPU's are allowed per user, `MaxJobsPU` which lists the number of jobs that can be running at once per user, and `MaxSubmitPU` which lists the number of jobs that can be pending/running for one user.


## Run Slurm Script 

Let's look at the Slurm script, `finBERT-train.slurm`.

```bash title="finBERT-train.slurm" linenums="1"
#!/bin/bash

# Example slurm script to train a PyTorch deep learning model on Yen GPU

#SBATCH -J finBERT-train                 # Job name
#SBATCH -p gpu                           # Partition (queue) to submit to
#SBATCH -c 10                            # Number of CPU cores
#SBATCH -N 1                             # Request one node
#SBATCH -t 1:00:00                       # Max job time: 1 day
#SBATCH -G 1                             # Max GPUs per user: 4
#SBATCH -o finBERT-train.out             # Output file
#SBATCH --mail-type=ALL                  # Email notifications
#SBATCH --mail-user=your_email@stanford.edu   # Your Email 

# Load PyTorch module
ml pytorch

# Execute the Python script with multiple workers (for data loading)
srun python finBERT-train.py ${SLURM_CPUS_PER_TASK}
```

This script is asking for one GPU on the `gpu` partition and 10 CPU cores for 1 day.

!!! tip
    Using the `ml pytorch` on the Yens provides a pre-built virtual environment equipped with PyTorch and Transformers, all optimized for GPU usage. This setup saves significant time compared to manually installing and configuring these libraries.

Edit the Slurm script to include your email address. 

When ready to submit, run with:

```bash title="Terminal Input"
sbatch finBERT-train.slurm
```

Check the queue for your username:

```bash title="Terminal Input"
squeue -u $USER
```

You can also filter the queue for `gpu` partition only with:

```title="Terminal Input"
squeue -p gpu
```

You should see your job in the queue running/pending on one of the GPU nodes:

```{.yaml .no-copy title="Terminal Output"}
 JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
225707       gpu finBERT-    user1  R       0:06      1 yen-gpu1
```

Once the job starts running, monitor the log file (`-f` flag will append to the screen as more output is added to the out file): 

```title="Terminal Input"
tail -f *out
```

## Check GPU Utilization

While the script is running, we can `ssh` to the node that the job is running on: 

```bash title="Terminal Input"
ssh yen-gpu1
```

You may be asked to enter your SUNet password.

After logging into the GPU node:
```title="Terminal Input on GPU Node"
watch nvidia-smi
```
The `watch` command refreshes `nvidia-smi` command every 2 seconds by default. 

Monitor the GPU utilization under `GPU-Util` column and ensure your python process is running. You can also
check GPU RAM that is being used and adjust your batch size in future training runs (you want to maximize GPU RAM utilized by making batches bigger):

```{.yaml .no-copy title="Output from nvidia-smi Command"}
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 530.30.02              Driver Version: 530.30.02    CUDA Version: 12.1     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                  Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf            Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA A30                      On | 00000000:17:00.0 Off |                    0 |
| N/A   45C    P0              157W / 165W|   4515MiB / 24576MiB |     45%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   1  NVIDIA A30                      On | 00000000:65:00.0 Off |                    0 |
| N/A   34C    P0               32W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   2  NVIDIA A30                      On | 00000000:CA:00.0 Off |                    0 |
| N/A   31C    P0               29W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   3  NVIDIA A30                      On | 00000000:E3:00.0 Off |                    0 |
| N/A   33C    P0               29W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A    170912      C   ...tware/free/pytorch/2.0.0/bin/python     4512MiB |
+---------------------------------------------------------------------------------------+
```

Once the script finishes, check the output file. The out file should tell you that the GPU was detected and used.

```{.yaml .no-copy title="finBERT-train.out"}
GPU available: True (cuda), used: True
```

We print the accuracy on the test set **before** training:

| Test metric | DataLoader 0         |
|-------------|----------------------|
| test_acc    | 0.18421052631578946  |

And **after** training for 3 epochs (which takes about 100 seconds): 

| Test metric | DataLoader 0         |
|-------------|----------------------|
| test_acc    | 0.9736842105263158   |

In this tutorial, we demonstrated how to fine-tune a BERT model for sentiment analysis on financial news using PyTorch Lightning and run the training on Stanford GSB's Yen GPU cluster.


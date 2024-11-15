# Yen Slurm
You may be used to using a job scheduler on [other Stanford compute resources](https://srcc.stanford.edu/systems){:target="_blank"} (e.g. Sherlock, etc.) or servers from other institutions. However, the Yen servers have traditionally run without a scheduler in order to make them more accessible and intuitive to our users. The ability to log onto a machine with considerably more resources than your laptop and immediately start running scripts as if it was still your laptop has been very popular with our users. This is the case on `yen1`, `yen2`, `yen3`, `yen4` and `yen5`.

!!! note
    Take a look [here](/_getting_started/yen-servers/){:target="_blank"} to see more details about the Yen hardware.

The downside of this system is that resources can be eaten up rather quickly by users and you may find a particular server to be "full". To combat this, we have implemented the Slurm scheduler on our `yen-slurm` servers. For users familiar with scheduler systems, this should be a seamless transition. For those unfamiliar, this page will help you learn how to get started.

## Schedule Jobs on the Yens
!!! tip
    [Watch](https://drive.google.com/file/d/1Zqn6PUoR4ZnH0An4fCAe7_MwKhHFwCFZ/view?usp=sharing){:target="_blank"} this Hub How-To presentation on using the Slurm scheduler to run parallel jobs on `yen-slurm`.

`yen-slurm` is a computing cluster offered by the Stanford Graduate School of Business. It is designed to give researchers the ability to run computations that require a large amount of resources without leaving the environment and filesystem of the interactive Yens.

<div class="row">
    <div class="col-lg-12">
      <H1> </H1>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
     <div class="fontAwesomeStyle"><i class="fas fa-tachometer-alt"></i> Current yen-slurm cluster configuration</div>
<iframe class="airtable-embed" src="https://airtable.com/embed/shr4Dm4JOF5IFg5I9?backgroundColor=purple" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
   </div>
    <div class="col col-md-2"></div>
  </div>

The `yen-slurm` cluster has 11 nodes (including 3 GPU nodes) with a total of 1568 available CPU cores, 10.25 TB of memory, and 12 NVIDIA GPU's.

## What Is A Scheduler?

The `yen-slurm` cluster can be accessed by the [Slurm Workload Manager](https://slurm.schedmd.com/){:target="_blank"}. Researchers can submit jobs to the cluster, asking for a certain amount of resources (CPU, Memory, and Time). Slurm will then manage the queue of jobs based on what resources are available. In general, those who request less resources will see their jobs start faster than jobs requesting more resources.

## Why Use A Scheduler?

A job scheduler has many advantages over the directly shared environment of the interactive Yens:

* Run jobs with a guaranteed amount of resources (CPU, Memory, Time)
* Setup multiple jobs to run automatically
* Run jobs that exceed the [community guidelines on the interactive nodes](/_policies/user_limits/){:target="_blank"}
* Gold standard for using high-performance computing resources around the world

## How Do I Use The Scheduler?

First, you should make sure your process can run on the interactive Yen command line. We've written a guide on migrating a process from [JupyterHub to `yen-slurm`](/_user_guide/best_practices_migrating_from_jupyter/){:target="_blank"}. [Virtual Environments](/_user_guide/best_practices_python_env/){:target="_blank"} will be your friend here.

Once your process is capable of running on the interactive Yen command line, you will need to create a Slurm script. This script has two major components:

* Metadata around your job, and the resources you are requesting
* The commands necessary to run your process

Here's an example of a submission Slurm script, `my_submission_script.slurm`:

```slurm title="Slurm script"
#!/bin/bash

#SBATCH -J yahtzee
#SBATCH -o rollcount.csv
#SBATCH -c 1
#SBATCH -t 10:00
#SBATCH --mem=100G

python3 yahtzee.py 100000
```

The important arguments here are that you request:

* `SBATCH -c` is the number of CPUs
* `SBATCH -t` is the amount of time for your job
* `SBATCH --mem` is the amount of total memory

Once your Slurm script is written, you can submit it to the server by running `sbatch my_submission_script.slurm`.

## How Do I View My Job Status?

You can look at the current job queue by running `squeue`:

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
              1043    normal    a_job    user1 PD       0:00      1 (Resources)
              1042    normal    job_2    user2  R    1:29:53      1 yen11
              1041    normal     bash    user3  R    3:17:08      1 yen11
```

Jobs with state (ST) R are running, and PD are pending. Your job will run based on this queue.

## Submit Your First Job To Run On Yen Slurm

Let's walk through the submission of a Python script to Yen Slurm.

### Running Python Script On The Command Line 
Let's start by running a simple Python script `flip-coin.py` on the command line. This script flips a coin 5 million times and prints the final distribution at the end.

```python title="flip-coin.py"
import time
from random import randint

num_flips = 5000000

start_time = time.time()

results = {'Heads': 0, 'Tails': 0} # counter for coin results
for i in range(num_flips):
    result = randint(1,2) # randomly choose the integer 1 or 2
    if result==1: # 1 represents heads
        results['Heads']+=1
    elif result==2: # 2 represents tails
        results['Tails']+=1

end_time = time.time()
elapsed_time = end_time - start_time

print(f"Elapsed time: {elapsed_time:.2f} seconds")

for face in results:
    print(f'{face} -- {results[face]} times')
```

We can call the function like this:
```bash title="Terminal Command"
python3 flip-coin.py
```

The output should look like:
```{.yaml .no-copy title="Terminal Output"}
Elapsed time: 2.53 seconds
Heads -- 2499005 times
Tails -- 2500995 times
```

### Submitting Script To The Scheduler
Next, we'll prepare a submit script called `flip-coin.slurm` and submit it to the scheduler. This will run `flip-coin.py` on Yen Slurm. Edit the Slurm script to include your email address.

```slurm title="flip-coin.slurm"
#!/bin/bash

# Example of running python script

#SBATCH -J flip-coin
#SBATCH -p normal,dev
#SBATCH -c 1                            # CPU cores (up to 256 on normal partition)
#SBATCH -t 5:00
#SBATCH -o flip-coin-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Run python script
python3 flip-coin.py
```

Then submit the script:

```bash title="Terminal Command"
sbatch flip-coin.slurm
```

You should see a similar output:

```{.yaml .no-copy title="Terminal Output"}
Submitted batch job 44097
```

Monitor your job:
```bash title="Terminal Command"
squeue
```

The script should take less than 1 minute to complete. Look at the Slurm emails after the job is finished. You can also review the output file `flip-coin-%j.out`.

### Using Virtual Environment In Slurm Scripts
We can also employ a virtual Python enviuronment using `venv` instead of the system's `python3` when running scripts via Slurm.

For example, let's say you've created a virtual Python environment using the process described on [this page](/_user_guide/best_practices_python_env/){:target="_blank"} that is located in your home directory at `/zfs/home/users/SUNetID/flip_coin_venv/`. You can modify your Slurm script to use this `venv` environment:

```slurm title="flip-coin_with-venv.slurm"
#!/bin/bash

# Example of running python script

#SBATCH -J flip-coin
#SBATCH -p normal,dev
#SBATCH -c 1                            # CPU cores (up to 256 on normal partition)
#SBATCH -t 5:00
#SBATCH -o flip-coin-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Activate venv 
source /zfs/home/users/SUNetID/flip_coin_venv/bin/activate

# Run python script
python flip-coin.py
``` 

In the above Slurm script, we first activate the `venv` environment and then execute the python script using `python` in the active environment. You can [create your own `venv` environment](/_user_guide/best_practices_python_env/){:target="_blank"} and then activate it within your Slurm script in the same manner.

## Best Practices

### Use All Of The Resources You Request

The Slurm scheduler keeps track of the resources you request, and the resources you use. Frequent under-utilization of CPU and Memory will affect your future job priority. You should be confident that your job will use all of the resources you request. It's recommended that you run your job on the interactive Yens, and [monitor resource usage](/_user_guide/best_practices_monitor_usage/){:target="_blank"} to make an educated guess on resource usage.

### Restructure Your Job Into Small Tasks

Small jobs start faster than big jobs. Small jobs likely finish faster too. If your job requires doing the same process many times (i.e. OCR'ing many PDFs), it will benefit you to setup your job as many small jobs. Check [this page on Slurm job arrays](/_user_guide/job_arrays/){:target="_blank"} to find an example of how to set this paradigm up.

## Tips And Tricks

### Current Partitions And Their Limits

Run `sinfo -o "%P %D %N"` in a terminal to see available partitions:

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ sinfo -o "%P %D %N"
PARTITION NODES NODELIST
normal* 8 yen[11-18]
dev 8 yen[11-18]
long 8 yen[11-18]
gpu 3 yen-gpu[1-3]
```

The first column PARTITION lists all available partitions. Partitions are the logical subdivision
of the `yen-slurm` cluster. The `*` denotes the default partition.

The four partitions have the following limits:

| Partition      | CPU Limit Per User | Memory Limit           | Max Memory Per CPU (default)  | Time Limit (default) |
| -------------- | :----------------: | :--------------------: | :----------------------------:| :-------------------:|
|  normal        |    256             | 1.5 TB                   |   24 GB (4 GB)                | 2 days  (2 hours)    |
|  dev           |    2               | 48 GB                  |   24 GB (4 GB)                | 2 hours (1 hour)     |
|  long          |    32              |  768 GB                |   24 GB (4 GB)                | 7 days (2 hours)     |
|  gpu           |    64              |  256 GB                |   24 GB (4 GB)                | 1 day (2 hours)      |


You can submit to the `dev` partition by specifying:

```slurm title="Slurm argument"
#SBATCH --partition=dev
```

Or with a shorthand:

```slurm title="Slurm argument"
#SBATCH -p dev
```

If you don’t specify the partition in the submission script, the job is queued in the `normal` partition. To request a particular partition, for example, `long`, specify `#SBATCH -p long` in the Slurm submission script. You can specify more than one partition if the job can be run on multiple partitions (i.e. `#SBATCH -p normal,dev`).

### How Do I Check How Busy Yen Slurm Is?

You can pass format options to the `sinfo` command as follows:

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ sinfo --format="%m | %C"
MEMORY | CPUS(A/I/O/T)
257366+ | 855/713/0/1568
```

where MEMORY outputs the minimum size of memory of the `yen-slurm` cluster node in megabytes (256 GB) and CPUS(A/I/O/T) prints the number of CPU's that are allocated / idle / other / total.
For example, if you see `855/713/0/1568` that means 855 CPU's are allocated, 713 are idle (free) out of 1,568 CPU's total.

You can also run `checkyens` and look at the last line for summary of all pending and running jobs on `yen-slurm`.

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ checkyens
Enter checkyens to get the current server resource loads. Updated every minute.
yen1 :  2 Users | CPU [#######             36%] | Memory [####                22%] | updated 2024-10-22-00:16:01 
yen2 :  3 Users | CPU [                     1%] | Memory [########            42%] | updated 2024-10-22-00:16:00 
yen3 :  6 Users | CPU [                     1%] | Memory [###                 15%] | updated 2024-10-22-00:16:00 
yen4 :  2 Users | CPU [                     0%] | Memory [###                 16%] | updated 2024-10-22-00:16:00 
yen5 :  0 Users | CPU [####                21%] | Memory [####                21%] | updated 2024-10-22-00:16:04 
yen-slurm : 386 jobs, 7 pending | 834 CPUs allocated (53%) | 5142G Memory Allocated (50%) | updated 2024-10-22-00:16:02
```

### When Will My Job Start?

You can ask the scheduler using `squeue --start`, and look at the `START_TIME` column.

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ squeue --start

JOBID PARTITION     NAME     USER ST          START_TIME  NODES SCHEDNODES           NODELIST(REASON)
112    normal yahtzeem  astorer PD 2020-03-05T14:17:40      1 yen11                (Resources)
113    normal yahtzeem  astorer PD 2020-03-05T14:27:00      1 yen11                (Priority)
114    normal yahtzeem  astorer PD 2020-03-05T14:37:00      1 yen11                (Priority)
115    normal yahtzeem  astorer PD 2020-03-05T14:47:00      1 yen11                (Priority)
116    normal yahtzeem  astorer PD 2020-03-05T14:57:00      1 yen11                (Priority)
117    normal yahtzeem  astorer PD 2020-03-05T15:07:00      1 yen11                (Priority)
```

!!! note
    The start times in the `squeue --start` output tend to be conservative and are based on the max duration of every job in the queue. Thus, it is likely that the job you just submitted will start sooner than the predicted time.

### How Do I Cancel My Job On Yen Slurm?

The `scancel JOBID` command will cancel your job.  You can find the unique numeric `JOBID` of your job with `squeue`. You can also cancel all of your running and pending jobs with `scancel -u USERNAME` where `USERNAME` is your username.

### How Do I Constrain My Job To Specific Nodes?

Certain nodes may have particular features that your job requires, such
as a GPU. These features can be viewed as follows:

```{.yaml .no-copy title="Terminal Output"}
USER@yen4:~$ sinfo -o "%10N  %5c  %5m  %64f  %10G"
NODELIST    CPUS   MEMOR  AVAIL_FEATURES                                                    GRES      
yen[11-18]  32+    10315  (null)                                                            (null)    
yen-gpu1    64     25736  GPU_BRAND:NVIDIA,GPU_UARCH:AMPERE,GPU_MODEL:A30,GPU_MEMORY:24GiB  gpu:4     
yen-gpu[2-  64     25736  GPU_BRAND:NVIDIA,GPU_UARCH:AMPERE,GPU_MODEL:A40,GPU_MEMORY:48GiB  gpu:4
```

For example, to ensure that your job will run on a node that has an NVIDIA Ampere A40 GPU, you can include the `-C`/`--constraint` option to the `sbatch` command or in an `sbatch` script. Here is a trivial example command that demonstrates this: 

```bash title="sbatch Command"
sbatch -C "GPU_MODEL:A30" -G 1 -p gpu --wrap "nvidia-smi"
```

At present, only GPU-specific features exist, but additional node features may be added over time.

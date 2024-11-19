# Yen Slurm


## Schedule Jobs on the Yens

You may be used to using a job scheduler on [other Stanford compute resources](https://srcc.stanford.edu/about/computing-support-research) (e.g. Sherlock, etc.) or servers from other institutions. However, the Yen servers have traditionally run without a scheduler in order to make them more accessible and intuitive to our users. The ability to log onto a machine with considerably more resources than your laptop and immediately start running scripts as if it was still your laptop has been very popular with our users. This is the case on `yen1`, `yen2`, `yen3`, `yen4` and `yen5`.

!!! tip
    Take a look [here](/_getting_started/yen-servers/) to see more details about the Yen hardware.

The downside of this system is that resources can be eaten up rather quickly by users and you may find a particular server to be "full". To combat this, we have implemented the SLURM scheduler on our `yen-slurm` servers. For users familiar with scheduler systems, this should be a seamless transition.


[Watch](https://drive.google.com/file/d/1Zqn6PUoR4ZnH0An4fCAe7_MwKhHFwCFZ/view?usp=sharing) a recent Hub How-To on using the scheduler to run parallel jobs on yen-slurm.

The `yen-slurm` is a computing cluster offered by the Stanford Graduate School of Business.  It is designed to give researchers the ability to run computations that require a large amount of resources without leaving the environment and filesystem of the interactive Yens.

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

The `yen-slurm` cluster has 9 nodes with 1248 total number of available CPU cores, 9 TB of memory, and 8 NVIDIA GPU's.

## What is a scheduler?

The `yen-slurm` cluster can be accessed by the [Slurm Workload Manager](https://slurm.schedmd.com/).  Researchers can submit jobs to the cluster, asking for a certain amount of resources (CPU, Memory, and Time).  Slurm will then manage the queue of jobs based on what resources are available. In general, those who request less resources will see their jobs start faster than jobs requesting more resources.

## Why use a scheduler?

A job scheduler has many advantages over the directly shared environment of the yens:

* Run jobs with a guaranteed amount of resources (CPU, Memory, Time)
* Setup multiple jobs to run automatically
* Run jobs that exceed the [community guidelines on the interactive nodes](/_policies/user_limits/)
* Gold standard for using high-performance computing resources around the world

## How do I use the scheduler?

First, you should make sure your process can run on the interactive Yen command line.  We've written a guide on migrating a process from [JupyterHub to yen-slurm](/_user_guide/best_practices_migrating_from_jupyter/).  [Virtual Environments](/_user_guide/best_practices_python_env/) will be your friend here.

Once your process is capable of running on the interactive Yen command line, you will need to create an slurm script.  This script has two major components:

* Metadata around your job, and the resources you are requesting
* The commands necessary to run your process

Here's an example of a submission slurm script, `my_submission_script.slurm`:

```bash linenums="1" hl_lines="5-7" title="my_submission_script.slurm"
#!/bin/bash

#SBATCH -J yahtzee
#SBATCH -o rollcount.csv
#SBATCH -c 1
#SBATCH -t 10:00
#SBATCH --mem=100G

python3 yahtzee.py 100000
```

The important arguments here are that you request:

- `SBATCH -c` is the number of CPUs
- `SBATCH -t` is the amount of time for your job
- `SBATCH --mem` is the amount of total memory


Once your slurm script is written, you can submit it to the server by running `sbatch my_submission_script.slurm`.

## OK - my job is submitted - now what?

You can look at the current job queue by running `squeue`:

```{ .yaml .no-copy }
USER@yen4:~$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
              1043    normal    a_job    user1 PD       0:00      1 (Resources)
              1042    normal    job_2    user2  R    1:29:53      1 yen11
              1041    normal     bash    user3  R    3:17:08      1 yen11
```

Jobs with state (ST) R are running, and PD are pending.  Your job will run based on this queue.

## Best Practices

### Use all of the resources you request

The Slurm scheduler keeps track of the resources you request, and the resources you use. Frequent under-utilization of CPU and Memory will affect your future job priority.  You should be confident that your job will use all of the resources you request.  It's recommended that you run your job on the interactive Yens, and [monitor resource usage](/_user_guide/best_practices_monitor_usage/) to make an educated guess on resource usage.

### Restructure your job into small tasks

Small jobs start faster than big jobs. Small jobs likely finish faster too.  If your job requires doing the same process many times (i.e. OCR'ing many PDFs), it will benefit you to setup your job as many small jobs.

## Tips and Tricks

### Current Partitions and their limits

Run `sinfo` command to see available partitions:

```title="Terminal Command"
sinfo
```

You should see the following output:

```{ .yaml .no-copy }
USER@yen4:~$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
normal*      up 2-00:00:00      7   idle yen[11-17]
dev          up    2:00:00      7   idle yen[11-17]
long         up 7-00:00:00      7   idle yen[11-17]
gpu          up 1-00:00:00      2   idle yen-gpu[1-2]
```

The first column PARTITION lists all available partitions. Partitions are the logical subdivision
of the `yen-slurm` cluster. The `*` denotes the default partition.

The four partitions have the following limits:

| Partition      | CPU Limit Per User | Memory Limit           | Max Memory Per CPU (default)  | Time Limit (default) |
| -------------- | :----------------: | :--------------------: | :----------------------------:| :-------------------:|
|  normal        |    256             | 3 TB                   |   24 GB (4 GB)                | 2 days  (2 hours)    |
|  dev           |    2               | 48 GB                  |   24 GB (4 GB)                | 2 hours (1 hour)     |
|  long          |    32              |  768 GB                |   24 GB (4 GB)                | 7 days (2 hours)     |
|  gpu           |    64              |  256 GB                |   24 GB (4 GB)                | 1 day (2 hours)      |


You can submit to the `dev` partition by specifying:

```bash title="submssion_script.slurm"
#SBATCH --partition=dev
```

Or with a shorthand:

```bash title="submssion_script.slurm"
#SBATCH -p dev
```

If you don’t specify the partition in the submission script, the job is queued in the `normal` partition. To request a particular partition, for example, `long`, specify `#SBATCH -p long` in the slurm submission script. You can specify more than one partition if the job can be run on multiple partitions (i.e. `#SBATCH -p normal,dev`).

### How do I check how busy the machines are?

You can pass format options to the `sinfo` command as follows:

```title="Terminal Command"
sinfo --format="%m | %C"
```
```{ .yaml .no-copy }
MEMORY | CPUS(A/I/O/T)
257366+ | 100/1148/0/1248
```

where `MEMORY` outputs the minimum size of memory of the `yen-slurm` cluster node in megabytes (256 GB) and
`CPUS(A/I/O/T)` prints the number of CPU's that are allocated / idle / other / total.
For example, if you see `100/1148/0/1248` that means 100 CPU's are allocated, 1,148 are idle (free) out of 1,248 CPU's total.

You can also run `checkyens` and look at the last line for summary of all pending and running jobs on yen-slurm.

```{ .yaml .no-copy }
USER@yen4:~$ checkyens
Enter checkyens to get the current server resource loads. Updated every minute.
yen1 :  5 Users | CPU [                     3%] | Memory [#                    8%] | updated 2023-01-13-09:44:01
yen2 :  2 Users | CPU [                     0%] | Memory [                     0%] | updated 2023-01-13-09:44:02
yen3 :  2 Users | CPU [                     0%] | Memory [##                  14%] | updated 2023-01-13-09:44:01
yen4 :  3 Users | CPU [#####               29%] | Memory [###                 15%] | updated 2023-01-13-09:44:01
yen5 :  1 Users | CPU [##                  10%] | Memory [######              31%] | updated 2023-01-13-09:44:01
yen-slurm : 12 jobs, 0 pending | 86 CPUs allocated (21%) | 300G Memory Allocated (5%) | updated 2023-01-13-09:44:02
```

### When will my job start?

You can ask the scheduler using `squeue --start`, and look at the `START_TIME` column.

```{ .yaml .no-copy }
USER@yen4:~$ squeue --start

JOBID PARTITION     NAME     USER ST          START_TIME  NODES SCHEDNODES           NODELIST(REASON)
112    normal yahtzeem  astorer PD 2020-03-05T14:17:40      1 yen11                (Resources)
113    normal yahtzeem  astorer PD 2020-03-05T14:27:00      1 yen11                (Priority)
114    normal yahtzeem  astorer PD 2020-03-05T14:37:00      1 yen11                (Priority)
115    normal yahtzeem  astorer PD 2020-03-05T14:47:00      1 yen11                (Priority)
116    normal yahtzeem  astorer PD 2020-03-05T14:57:00      1 yen11                (Priority)
117    normal yahtzeem  astorer PD 2020-03-05T15:07:00      1 yen11                (Priority)
```

### How do I cancel my job on Yen-Slurm?

The `scancel JOBID` command will cancel your job.  You can find the unique numeric `JOBID` of your job with `squeue`.
You can also cancel all of your running and pending jobs with `scancel -u USERNAME` where `USERNAME` is your username.

### Constraining my job to specific nodes using node features

Certain nodes may have particular features that your job requires, such
as a GPU.  These features can be viewed as follows:

```{ .yaml .no-copy }
USER@yen4:~$ sinfo -o "%10N  %5c  %5m  %64f  %10G"
NODELIST    CPUS   MEMOR  AVAIL_FEATURES                                                    GRES
yen[11-17]  32+    10315  (null)                                                            (null)
yen-gpu1    64     25736  GPU_BRAND:NVIDIA,GPU_UARCH:AMPERE,GPU_MODEL:A30,GPU_MEMORY:24GiB  gpu:4
yen-gpu2    64     25736  GPU_BRAND:NVIDIA,GPU_UARCH:AMPERE,GPU_MODEL:A40,GPU_MEMORY:48GiB  gpu:4
```

For example, to ensure that your job will run on a node that has an
NVIDIA Ampere A40 GPU, you can include the `-C`/`--constraint` option to
the `sbatch` command or in an `sbatch` script.  Here is a trivial
example command that demonstrates this: `sbatch -C "GPU_MODEL:A30" -G 1 -p gpu --wrap "nvidia-smi"`

At present, only GPU-specific features exist, but additional node features may be added over time.


## Submit Your First Job to Run on Yen-Slurm

We are going to copy scripts including example python scripts and Slurm submission scripts.
Make a directory inside your home directory called `intermediate_yens_2023`.
Then copy the scripts for this class from `scratch` to your `intermediate_yens_2023` working directory so you can modify and run them.

```title="Terminal Commands"
cd
mkdir intermediate_yens_2023
cd intermediate_yens_2023
cp /scratch/darc/intermediate-yens/* .
```

### Running Python Script on the Command Line 
Just as we ran <a href="/gettingStarted/9_run_jobs.html" target="_blank">R script</a> on the interactive yen nodes, we can simply run a Python script on the command line.  

Let's run a python version of the script, `investment-npv-serial.py`, which is a serial version of the script that does not use multiprocessing.

```bash linenums="1" title="investment-npv-serial.py"
# In the context of economics and finance, Net Present Value (NPV) is used to assess
# the profitability of investment projects or business decisions.
# This code performs a Monte Carlo simulation of Net Present Value (NPV) with 500,000 trials in serial,
# utilizing multiple CPU cores. It randomizes input parameters for each trial, calculates the NPV,
# and stores the results for analysis.
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

np.errstate(over='ignore')

# define a function for NPV calculation
def npv_calculation(cashflows, discount_rate):
    # calculate NPV using the formula
    npv = np.sum(cashflows / (1 + discount_rate) ** np.arange(len(cashflows)))
    return npv

# function for simulating a single trial
def simulate_trial(trial_num):
    # randomly generate input values for each trial
    cashflows = np.random.uniform(-100, 100, 10000)  # Random cash flow vector over 10,000 time periods
    discount_rate = np.random.uniform(0.05, 0.15)  # Random discount rate

    # ignore overflow warnings temporarily
    with np.errstate(over = 'ignore'):
        # calculate NPV for the trial
        npv = npv_calculation(cashflows, discount_rate)

    return npv

# number of trials
num_trials = 500000

start_time = time.time()

# Perform the Monte Carlo simulation in serial
results = np.empty(num_trials)

for i in range(num_trials):
    results[i] = simulate_trial(i)

results = pd.DataFrame( results, columns = ['NPV'])

end_time = time.time()
elapsed_time = end_time - start_time

print(f"Elapsed time: {elapsed_time:.2f} seconds")

print("Serial NPV Calculation:")
# Print summary statistics for NPV
print(results.describe())

# Plot a histogram of the results
plt.hist(results, bins=50, density=True, alpha=0.6, color='g')
plt.title('NPV distribution')
plt.xlabel('NPV Value')
plt.ylabel('Frequency')
plt.savefig('histogram.png')
```

We can call the function like this:
```title="Terminal Command"
python3 investment-npv-serial.py
```

The output should look like:
```{ .yaml .no-copy }
Elapsed time: 185.77 seconds
Serial NPV Calculation:
                 NPV
count  500000.000000
mean       -0.119349
std       144.435560
min      -723.741078
25%       -96.553456
50%         0.105534
75%        96.588246
max       721.687146
```

## Submit Serial Script to the Scheduler

We'll prepare a submit script called `investment-serial.slurm` and submit it to the scheduler. Edit the slurm script to include
your email address.

```bash linenums="1" title="investment-serial.slurm"
#!/bin/bash

# Example of running python script in a batch mode

#SBATCH -J npv-serial
#SBATCH -p normal,dev
#SBATCH -c 1                            # CPU cores (up to 256 on normal partition)
#SBATCH -t 1:00:00
#SBATCH -o npv-serial-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Run python script
python3 investment-npv-serial.py
```

Then submit the script:

```title="Terminal Command"
sbatch investment-serial.slurm
```

You should see a similar output:

```{ .yaml .no-copy }
Submitted batch job 44097
```

Monitor your job:
```title="Terminal Command"
squeue
```

The script should take less than 5 minutes to complete. Look at the slurm emails after the job is finished.
Look at the output file.

## Using `venv` Environment in Slurm Scripts
We can also use a `venv` environment python instead of a system `python3` when running scripts via Slurm.

We can modify the slurm script to use previously created `venv` environment as follows:

```bash linenums="1" title="modified.slurm"
#!/bin/bash

# Example of running python script in a batch mode

#SBATCH -J npv-serial
#SBATCH -p normal,dev
#SBATCH -c 1                            # CPU cores (up to 256 on normal partition)
#SBATCH -t 1:00:00
#SBATCH -o npv-serial-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Activate venv 
source /zfs/gsb/intermediate-yens/venv/bin/activate

# Run python script
python investment-npv-serial.py
``` 

In the above slurm script, we first activate `venv` environment and execute the python script using `python` in the active environment.

<!--
## R Script -- Reference

### Managing R Software Libraries and Versions
The R software is installed system-wide, allowing each user to maintain their own set of R packages within their home directory by default. Furthermore, each R version has its dedicated library, distinct from other versions.  
Every R version will also have its own library separate from other versions. For example, R 4.0 will have its user-installed 
packages side by side with R 4.2 library containing the user-installed packages specific to that version. 

When upgrading your
R version (e.g., to run code with a newly released R version), you must first install packages that are needed for your script to run for that specific R version. However, once the package is
installed, you can load it in your scripts without the need for repeated installations upon each login.

Moreover, if you require access to a newer software version that is not currently available on the system, please don't hesitate to [contact DARC](mailto:gsb_darcresearch@stanford.edu) to request its installation. 

### Installing R packages without a Graphical Interface

Load the R module with the version that you want (R 4.2 is the current default).

For example, let's use the newest R version available on the yens:

```bash
$ ml R
```

Start interactive R console by typing `R`.

You should see:

```R
R version 4.2.1 (2022-06-23) -- "Funny-Looking Kid"
Copyright (C) 2022 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.
Type 'license()' or 'licence()' for distribution details.

R is a collaborative project with many contributors.
Type 'contributors()' for more information and
'citation()' on how to cite R or R packages in publications.

Type 'demo()' for some demos, 'help()' for on-line help, or
'help.start()' for an HTML browser interface to help.
Type 'q()' to quit R.

>
```

Let's install two multiprocessing packages on the yens that we will use for the R example. 

```R
> install.packages('foreach')
```
If this is your first time installing R package for this R version on the Yens, you will be asked to create a personal library
(because users do not have write permissions to the system R library). Answer `yes` to both questions:

```R
Warning in install.packages("foreach") :
  'lib = "/software/free/R/R-4.2.1/lib/R/library"' is not writable
Would you like to use a personal library instead? (yes/No/cancel) yes

Would you like to create a personal library
‘~/R/x86_64-pc-linux-gnu-library/4.2’
to install packages into? (yes/No/cancel) yes
```
This creates a new personal R 4.2 library in your home directory. The library path is 
`~/R/x86_64-pc-linux-gnu-library/4.2` where all of the user packages will be installed. Once the library is created, next 
package will be installed there automatically.

Pick any mirror in the US. 

```R
Installing package into ‘/home/users/nrapstin/R/x86_64-pc-linux-gnu-library/4.2’
(as ‘lib’ is unspecified)
--- Please select a CRAN mirror for use in this session ---
Secure CRAN mirrors

 1: 0-Cloud [https]
 2: Australia (Canberra) [https]
...
74: USA (IA) [https]
75: USA (MI) [https]
76: USA (OH) [https]
77: USA (OR) [https]
78: USA (TN) [https]
79: USA (TX 1) [https]
80: Uruguay [https]
81: (other mirrors)

Selection: 77
```

If the package is successfully installed, you should see:

```R
* DONE (foreach)

The downloaded source packages are in
	‘/tmp/RtmpsYpzoP/downloaded_packages’
```

Then install `doParallel` package: 

```R
> install.packages("doParallel")
```

When the package is done installing, you will see:

```R
* DONE (doParallel)

The downloaded source packages are in
	‘/tmp/Rtmpwy8WeV/downloaded_packages’
```
-------------------------
### Running R Script Interactively

Now that we have loaded R module and installed R packages that we are going to use, we are ready to run our code. 
You can run R code line by line interactively by copying-and-pasting into the R console. 
For example,

```R
> print('Hello!')
[1] "Hello!"
```

The advantage of interactive console is that the results are printed to the screen immediately and if you are developing code
or debugging, it can be very powerful. But the disadvantage is that if you close the terminal window or lose connection,
the session is not saved and you will need to reload the R module and paste all of the commands again. 
So, use this method for when you need interactive development / debugging environment. Another disadvantage is that if you 
did not login with the graphical interface (X forwarding) you will not be able to plot anything in the interactive console.
So, if you need plots and graphs, either use `-Y` flag when connecting to the Yens or use RStudio on <a href="/gettingStarted/8_jupyterhub.html" target="_blank">JupyterHub</a>. 

We can then quit out of R without saving workspace image:

```R
> q()
Save workspace image? [y/n/c]: n
```
-------------------------
#### Running R Script on the Command Line
If you want to simply run the script, you can do so from the command line. 

We are going to run the same code that we ran on our local machine, `investment-npv-parallel.R`.

{% include warning.html content="Because this R code uses multiprocessing and the yens are a shared computing environment, we need to be careful about how R sees and utilizes the shared cores on the yens."%}


Let's update the script for the yens. Edit the script on JupyterHub in the Text Editor. 
Instead of using `detectCores()` function, we will hard code the number of cores for
the script to use in this line in the R script:

```R
ncore <- 1 
```

Thus, the `investment-npv-parallel.R` script on the yens should look like:
```R
# In the context of economics and finance, Net Present Value (NPV) is used to assess 
# the profitability of investment projects or business decisions.
# This code performs a Monte Carlo simulation of Net Present Value (NPV) with 500,000 trials in parallel,
# utilizing multiple CPU cores. It randomizes input parameters for each trial, calculates the NPV,
# and stores the results for analysis.

# load necessary libraries
library(foreach)
library(doParallel)

options(warn=-1)

# set the number of cores here
ncore <- 1

# register parallel backend to limit threads to the value specified in ncore variable
registerDoParallel(ncore)

# define function for NPV calculation
npv_calculation <- function(cashflows, discount_rate) {
  # inputs: cashflows (a vector of cash flows over time) and discount_rate (the discount rate).
  npv <- sum(cashflows / (1 + discount_rate)^(0:length(cashflows)))
  return(npv)
}

# number of trials
num_trials <- 500000

# measure the execution time of the Monte Carlo simulation
system.time({
  # use the foreach package to loop through the specified number of trials (num_trials) in parallel
  # within each parallel task, random values for input parameters (cash flows and discount rate) are generated for each trial
  # these random input values represent different possible scenarios
  results <- foreach(i = 1:num_trials, .combine = rbind) %dopar% {
    # randomly generate input values for each trial
    cashflows <- runif(10000, min = -100, max = 100)  # random cash flow vector over 10,000 time periods. 
    # these cash flows can represent costs (e.g., initial investment) and benefits (e.g., revenue or savings) associated with the project
    discount_rate <- runif(1, min = 0.05, max = 0.15)  # random discount rate at which future cash flows are discounted
    
    # calculate NPV for the trial
    npv <- npv_calculation(cashflows, discount_rate)
    
  }
})


cat("Parallel NPV Calculation (using", ncore, "cores):\n")
# print summary statistics for NPV and plot a histogram of the results
# positive NPV indicates that the project is expected to generate a profit (the benefits outweigh the costs), 
# making it an economically sound decision. If the NPV is negative, it suggests that the project may not be financially viable.
summary(results)
hist(results, main = 'NPV distribution')
```

After loading the R module, we can run this script with `Rscript` command on the command line:

```bash
$ Rscript investment-npv-parallel.R 
```

```bash
Loading required package: iterators
Loading required package: parallel
   user  system elapsed
274.631   0.433 275.130
Parallel NPV Calculation (using 1 cores):
       V1
 Min.   :-727.7947
 1st Qu.: -96.5315
 Median :  -0.0326
 Mean   :  -0.0505
 3rd Qu.:  96.3001
 Max.   : 700.4002
```
Again, running this script is active as long as the session is active (terminal stays open and you do not lose connection).
-->
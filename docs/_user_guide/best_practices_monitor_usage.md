# How Do I Check My Resource Usage on the Yens?
If you would like to check your resource usage on the Yens, there are a few tools available.

- **`htop`** allows you to get an overview of the activity on the whole system that you are logged into. Furthermore, you can inspect your own processes by typing `htop -u <SUNetID>`. A lot more information about how to decipher the information produced with this command can be found on the [Community Guidelines](/_policies/user_limits){target="_blank"}.
- **`topbyuser`** is another tool written by us that lists out the active users on the Yens you are logged into and the amount of resources they are currently using.

!!! important
    We have [Community Guidelines](/_policies/user_limits){target="_blank"} to illustrate responsible use of our shared resources that our users are expected to follow. These guidelines ensure that the Yens can remain accessible to everyone.

## Monitoring Usage

Certain parts of the GSB research computing infrastructure provide environments that are managed by a scheduler (like [Sherlock](/_user_guide/sherlock){target="_blank"} or [Yen Slurm](/_user_guide/slurm){target="_blank"}). In these cases, it is not necessary for individuals to monitor resource usage themselves.

However, when working on systems like the [interactive Yens](/_user_guide/yen){target="_blank"} where resources like **CPU**, **RAM**, and **disk space** are shared among many researchers, it is important that all users should be mindful of how their work impacts the larger community.

!!! tip
    When using interactive Yens, use the `htop` and `userload` commands to monitor CPU and RAM usage. Use the `gsbquota` command to monitor disk quota.

### CPU & RAM
Per our [Community Guidelines](/_policies/user_limits){target="_blank"}, CPU usage should always be limited to 48 CPU cores/threads per user at any one time on Yen[2-5] and up to 12 CPU cores on Yen1. Some software (R and RStudio, for example) defaults to claiming all available cores unless told otherwise.

These defaults should always be overwritten when running R code on the Yens. Similarly, when working with multiprocessing code in languages like Python, care must be taken to ensure your code does not grab everything it sees. Please refer to our [Python parallel processing guidelines](/_user_guide/best_practices_parallel_processing_python){target="_blank"} for information about how to limit resource consumption when using common packages.

One easy method of getting a quick snapshot of your CPU and memory usage is via the `htop` command line tool. Running `htop` shows usage graphs and a process list that is sortable by user, top CPU, top RAM, and other metrics. Please use this tool liberally to monitor your resource usage, especially if you are running multiprocessing code on shared systems for the first time.

The `htop` console looks like this:

![htop output for well-behaved code](/assets/images/proc_monitoring.png)

!!! warning
    Note that in certain cases greedy jobs may be terminated automatically to preserve the integrity of the system.

The `userload` command will list the total amount of resources (CPU & RAM) all your tasks are consuming on that particular Yen node.

### Disk
Unlike personal home directories which have a 50 GB quota, faculty project directories on [ZFS](/_user_guide/storage){target="_blank"} are much bigger (1T default). However, disk storage is a finite resource so to allow us to continue to provide large project spaces, please always be aware of your disk footprint. This includes compressing files when you are able, and removing intermediate and/or temp files whenever possible. See the [Storage Solution](/_user_guide/storage){target="_blank"} page for more information about file storage options.

Disk quotas on all Yens can be reviewed by using the `gsbquota` command. It produces output like this:

```bash title="Terminal Command"
gsbquota
```

```{.yaml .no-copy title="Terminal Output"}
currently using 39% (20G) of 50G available
```

You can also check the size of your project space by passing in a full path to your project space to `gsbquota` command:

```bash title="Terminal Command"
gsbquota /zfs/projects/students/<my-project-dir>/
```

```{.yaml .no-copy title="Terminal Output"}
/zfs/projects/students/<my-project-dir>/: currently using 39% (78G) of 200G available
```

## Example
We are going to continue using the same R example, `investment-npv-parallel.R`, and experiment running it on multiple cores and monitoring our resource consumption.

To monitor the resource usage while running a program, we will need three terminal windows that are all connected to the **same** yen server.

Check what yen you are connected to in the first terminal:

`$ hostname`

Then `ssh` to the same yen in the second and third terminal windows. So if I am on `yen3`, I would open two new terminals and `ssh` to the `yen3` in both so I can monitor my resources when I start running the R program on `yen3`.

`$ ssh yen3.stanford.edu`

Once you have three terminal windows connected to the same yen, run the `investment-npv-parallel.R` program after loading the R module in one of the terminals:

`$ ml R`
`$ Rscript investment-npv-parallel.R`

Once the program is running, monitor your usage with `userload` command in the second window:

`$ userload`

Run `htop -u $USER` in the third window, where `$USER` is your SUNet:

`$ htop -u $USER`

While the program is running you should see about 1 CPU core is being utilized in `userload` output and one R process is running in `htop` output because we specified 1 core in our R program.

`$ userload`
`nrapstin         | 0.99 Cores | 0.00% Mem on yen3.stanford.edu`

Let's modify the number of cores to 8:

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
ncore <- 8

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
cat("Parallel NPV Calculation (using", ncore, "cores):
")
# print summary statistics for NPV and plot a histogram of the results
# positive NPV indicates that the project is expected to generate a profit (the benefits outweigh the costs),
# making it an economically sound decision. If the NPV is negative, it suggests that the project may not be financially viable.
summary(results)
hist(results, main = 'NPV distribution')
```

Then rerun:

`$ Rscript investment-npv-parallel.R`

You should see:

`Loading required package: iterators`
`Loading required package: parallel`
`   user  system elapsed`
`297.135   1.781 123.176`
`Parallel NPV Calculation (using 8 cores):`
`       V1`
` Min.   :-709.5883`
` 1st Qu.: -96.3171`
` Median :   0.2777`
` Mean   :   0.1964`
` 3rd Qu.:  96.8101`
` Max.   : 754.5522`

While the program is running, you should see 8 R processes running in the `htop` output because we specified 8 cores in our R program and about 8 CPU cores being utilized in `userload` output. The program will run faster since we are using 8 cores instead of 1 but does not get you 8X speedup because of parallelization overhead.

![Resource monitoring during parallel run](/assets/images/monitor-2.png)

The last modification we are going to make is to pass the number of cores as a command line argument to our R script. Save the following to a new script called `investment-npv-parallel-args.R`.

```R
#!/usr/bin/env Rscript
############################################
# This script accepts a user-specified argument to set the number of cores to run on
# Run from the command line:
#
#      Rscript investment-npv-parallel-args.R 8
#
# this will execute on 8 cores
###########################################
# accept command line arguments and save them in a list called args
args = commandArgs(trailingOnly=TRUE)
library(foreach)
library(doParallel)

options(warn=-1)
# set the number of cores here from the command line. Avoid using detectCores() function.
ncore <- as.integer(args[1])

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
cat("Parallel NPV Calculation (using", ncore, "cores):
")
# print summary statistics for NPV and plot a histogram of the results
# positive NPV indicates that the project is expected to generate a profit (the benefits outweigh the costs),
# making it an economically sound decision. If the NPV is negative, it suggests that the project may not be financially viable.
summary(results)
hist(results, main = 'NPV distribution')
```

Now, we can run this script with a varying number of cores. We will still limit the number of cores to 48 on yen[2-5] and to 12 cores on yen1 per [Community Guidelines](/yen/community.html){target="_blank"}.

For example, to run with 12 cores:

`$ Rscript investment-npv-parallel-args.R 12`

You should see:

`Loading required package: iterators`
`Loading required package: parallel`
`   user  system elapsed`
`302.366   2.344 116.261`
`Parallel NPV Calculation (using 12 cores):`
`       V1`
` Min.   :-682.9972`
` 1st Qu.: -96.5376`
` Median :  -0.2428`
` Mean   :  -0.2369`
` 3rd Qu.:  96.1112`
` Max.   : 720.2979`

Monitor your CPU usage while the program is running in the other terminal window with `htop` and `userload`.

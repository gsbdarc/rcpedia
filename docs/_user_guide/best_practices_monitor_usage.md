# How Do I Check My Resource Usage on the Yens?
If you would like to check your resource usage on the Yens, there are a few tools available.

- **`userload`** allows you to monitor CPU and RAM usage.
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

## Multiple CPU Cores Example
We are going to use an example with R, `investment-npv-parallel.R`, and experiment running it on multiple cores and monitoring our resource consumption.

To monitor the resource usage while running a program, we will need three terminal windows that are all connected to the **same** Yen server.

`ssh` to `yen3` in the first terminal windows.

```bash title="Terminal Command"
ssh yen3.stanford.edu
```

Check what Yen you are connected to in the first terminal:

```bash title="Terminal Command"
hostname
```

```{.yaml .no-copy title="Terminal Output"}
yen3
```

Then `ssh` to the same Yen in the second and third terminal windows. So if you are on `yen3`, you would open two new terminals and `ssh` to `yen3` in both so you can monitor your resources when you start running the R program on `yen3`.

```bash title="Terminal Command"
ssh yen3.stanford.edu
```

Create an `investment-npv-parallel.R` file below and save it in your desired directory.

```R title="investment-npv-parallel.R"
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

Once you have three terminal windows connected to the same Yen, run the `investment-npv-parallel.R` program after loading the R module in one of the terminals:

```bash title="Terminal Command"
ml R
Rscript investment-npv-parallel.R
```

!!! Notes
    If you have not installed `foreach` and `doParallel` packages. You have to run these commands after loading `r`: `install.packages("foreach")` and `install.packages("doParallel")`

Once the program is running, monitor your usage with `userload` command in the second window:

```bash title="Terminal Command"
watch -n 1 userload
```

While the program is running, you should see about 8 CPU cores being utilized in `userload` output. Note that the `watch` command allows you to see the real time CPU cores count every 1 second.

![Resource monitoring during parallel run](/assets/images/monitor_userload_r_8_cores.png)

Run `htop -u $USER` in the third window, where `$USER` is your SUNetID:

```bash title="Terminal Command"
htop -u $USER
```

While the program is running, you should see 8 R processes running in the `htop` output because we specified 8 cores in our R program.
![Resource monitoring during parallel run](/assets/images/monitor_htop_r_8_cores.png)

At the end of the program run, you should see the following output.

```{.yaml .no-copy title="Terminal Output"}
Loading required package: iterators
Loading required package: parallel
   user  system elapsed
349.660   2.311 126.050
Parallel NPV Calculation (using 8 cores):
       V1
 Min.   :-761.0356
 1st Qu.: -96.6439
 Median :  -0.0745
 Mean   :  -0.1852
 3rd Qu.:  96.2920
 Max.   : 713.7188
```

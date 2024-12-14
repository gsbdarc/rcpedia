# How Do I Check My Resource Usage on the Yens?
Monitoring your resource usage is important to be a good citizen of the GSB Research Computing community, but also to be able to effectively estimate your needs on scheduled systems.

These tools can help you characterize your usage:

- **`htop`** allows you to get an overview of the activity on the whole system that you are logged into. 
- **`userload`** is a custom tool that allows you to monitor CPU and RAM usage in a simplified view.
- **`topbyuser`** is another custom tool that lists out the active users on your current host and the amount of resources they are currently using.

!!! important
    We have [Community Guidelines](/_policies/user_limits){target="_blank"} to illustrate responsible use of our shared resources that our users are expected to follow. These guidelines ensure that the Yens can remain accessible and performant.

## Monitoring Compute with `htop`
One easy method of getting a quick snapshot of your CPU and memory usage is via the `htop` command line tool. Running `htop` shows usage graphs and a process list that is sortable by user, top CPU, top RAM, and other metrics. Please use this tool liberally to monitor your resource usage, especially if you are running multiprocessing code on shared systems for the first time.

You can toggle between a threaded view of processes by pressing ++t++ -- here is sample `htop` output in threaded mode.

![resource monitoring during parallel run](/assets/images/monitor_htop_r_8_cores.png)

!!! warning "Jobs may be automatically killed"
    Note that jobs that exceed user limits may be terminated automatically to preserve the integrity of the system.

## User Limits and Multiprocessing

Per our [Community Guidelines](/_policies/user_limits){target="_blank"}, CPU usage should always be limited based on system size. When working with implicitly or explicitly *multiprocessed* code, care must be taken to ensure your code does not use every available processor.
Please refer to our [Best Practices in R](/_user_guide/best_practices_r/){target="_blank"} and [Parallel Processing in Python](/_user_guide/best_practices_parallel_processing_python/){target="_blank"} articles for information about how to limit resource consumption when using parallel packages in those languages.

Be sure to monitoring your processes, particularly when using a new package, to verify that you are using the expected number of cores.

## Monitoring Disk Usage
Personal home directories have a 50 GB quota, while faculty project directories on [ZFS](/_user_guide/storage){target="_blank"} are much larger. 

!!! danger "Do NOT exceed your home directory quota!"
    If you exceed your home directory quota, you cannot access Jupyter or perform many basic system tasks.

Disk storage is a finite resource so to allow us to continue to provide large project spaces, please always be aware of your disk footprint. 
This includes removing intermediate and/or temp files whenever possible, and avoiding storing multiple copies of the same data set.
See the [Storage Solutions](/_user_guide/storage){target="_blank"} page for more information about file storage options.

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

Unsure what's taking up space? The `gsbbrowser` command scans your home directory and provides a visual representation of your directories and files and their associated sizes. You can also provide a path to a project directory to scan that directory:

```bash title="Terminal Command"
gsbbrowser /zfs/projects/students/<my-project-dir>/
```

## Example: Monitoring an R Script
Here we present an example in R, to illustrate monitoring code running on multiple cores.

To monitor the resource usage while running a program, we will need *three* terminal windows that are all connected to the **same** Yen server.

`ssh` to `yen3` in the first terminal window.

```bash title="Terminal 1 Command"
ssh yen3.stanford.edu
```

Check what Yen you are connected to in the first terminal:

```bash title="Terminal 1 Command"
hostname
```

```{.yaml .no-copy title="Terminal 1 Output"}
yen3
```

Then `ssh` to the same Yen in the second and third terminal windows. So if you are on `yen3`, you would open two new terminals and `ssh` to `yen3` in both so you can monitor your resources when you start running the R program on `yen3`.

```bash title="Terminal 2,3 Command"
ssh yen3.stanford.edu
```

Create an `investment-npv-parallel.R` file below and save it in your desired directory. 

!!! tip "We explicitly set the cores in this code!"
    Note that we set **8 cores** for use with the `registerDoParallel` function.

```R title="investment-npv-parallel.R" linenums="1" hl_lines="14 17"
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

```bash title="Terminal 1 Command"
ml R
Rscript investment-npv-parallel.R
```

!!! Notes
    If you have not installed `foreach` and `doParallel` packages. You have to run these commands after loading `r`: `install.packages("foreach")` and `install.packages("doParallel")`

Once the program is running, monitor your usage with `userload` command in the second window:

```bash title="Terminal 2 Command"
watch -n 1 userload
```

While the program is running, you should see about 8 CPU cores being utilized in `userload` output. Note that the `watch` command allows you to see the real time CPU cores count every 1 second.

![Resource monitoring during parallel run](/assets/images/monitor_userload_r_8_cores.png)

Run `htop -u $USER` in the third window, where `$USER` is your SUNetID:

```bash title="Terminal 3 Command"
htop -u $USER
```

While the program is running, you should see 8 R processes running in the `htop` output because we specified 8 cores in our R program.
![resource monitoring during parallel run](/assets/images/monitor_htop_r_8_cores.png)
# Best Practices in R 

## Tips for Being a Good Citizen

Many parallel packages in R require you to create a "cluster" of workers executing tasks in parallel. If you copy code from the internet, it might look like this:

```{ .yaml .no-copy }
😱 cluster_fork <- makeForkCluster(detectCores()) 😱
```

Don't use `detectCores`. It checks the machine for the total number of available cores and attempts to use all of them. Instead, replace `detectCores()` with a fixed number, such as 4, or another reasonably scaled allocation of resources. It's also a good practice to benchmark your code first before scaling up. Consider [this guide](https://jstaf.github.io/hpc-r/parallel/){:target="_blank"} or [this one](https://bookdown.org/rdpeng/rprogdatascience/parallel-computation.html){:target="_blank"} to understand how your code might benefit from parallelization.

!!! Warning
    Using all available cores with `detectCores` can overwhelm shared systems, degrade performance for other users, and potentially lead to resource throttling or job termination. Always limit the number of cores to a reasonable amount, especially in shared or high-performance computing environments. Failing to do so may negatively impact both your work and the system's overall efficiency.

## Parallelization Under the Hood

Even if you’re not explicitly running parallel code, some packages may use parallelization "under the hood." If you’re unsure, learn how to [monitor usage](/_user_guide/best_practices_monitor_usage/){:target="_blank"}. If your code runs in parallel automatically, figure out which options to pass to the functions you’re using in R to limit the number of cores. For example, in the [ranger](https://rdocumentation.org/packages/ranger/versions/0.15.1) package, the `num.threads` option defaults to the total number of cores (!!!). However, you can—and should-override this manually to prevent overuse of resources.

## An Example of Parallelized Simulation

Let's consider the following function, which determins how many rolls of 5 dice are needed to achieve a "Yahtzee" (all dice showing the same value):

```R title="R"
# Create a function to simulate dice rolls for Yahtzee
getRolls <- function(x) {
  dice = 1:6
  rolls = 0
  yahtzee = F
  while (!yahtzee) {
    roll <- sample(dice,5,replace = T)
    print(roll)
    rolls <- rolls + 1
    if (sd(roll)==0) {
      yahtzee = T
    }
  }
  return(rolls)
}
```

We aim to sample from the distribution 100 times to determine how many rolls it takes to achieve a Yahtzee. To accomplish this, we use the `parallel` package, and a distributed apply call `mclapply`:

```R hl_lines="5" title="R"
# Load library
library(parallel)

# Set the number of cores to use
nc <- 4

# Perform the parallel computation
res <- mclapply(1:100,getRolls,mc.cores=nc)

# Create a histogram
hist(unlist(res))
```

This uses 4 cores on your local machine to apply this function. If you display or save the results as a histogrm (e.g., `yahtzee_histogram.png`), it will look similar to this:

![yahtzee histogram image](/assets/images/yahtzee_histogram.png)
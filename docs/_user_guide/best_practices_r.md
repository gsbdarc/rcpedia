## Tips to being a good citizen

Many parallel packages in R require you to create a "cluster" of workers before doing work in parallel.  If you copy code off the internet, it might look like this:

```{ .yaml .no-copy }
😱 cluster_fork <- makeForkCluster(detectCores()) 😱
```

Don't use `detectCores`.  This will ask the machine how many cores there are, and then your code will try to use them all - **don't do this on a shared environment**. Instead, replace `detectCores()` with 4, or some other reasonably scaled amount of resources.  It's often a good idea to benchmark your code first before trying to scale up - consider [this guide](https://jstaf.github.io/hpc-r/parallel/){:target="_blank"} or [this one](https://bookdown.org/rdpeng/rprogdatascience/parallel-computation.html){:target="_blank"} to understand how your code might benefit from parallelization.

You might not think something is running in parallel, but a package you're running might use parallelization "under the hood". Check out how to [monitor usage](/_user_guide/best_practices_monitor_usage/){:target="_blank"} if you're not sure how! If your code is running in parallel automatically, you'll need to figure out which options to pass to the functions you're calling in R to limit the number of cores. For the [ranger](https://rdocumentation.org/packages/ranger/versions/0.15.1) package, for example, the `num.threads` option defaults to the number of cores (!!!) but you can override this manually.

## An instructive example

Let's consider the following function, which considers how many rolls of 5 dice it takes to get a "Yahtzee" (all of a kind):

```title="Terminal Command"
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

```title="Terminal Command"
# Load library 
library(parallel)
# Set the number of cores to use
nc <- 4
# Perform the parallel computation
res <- mclapply(1:100,getRolls,mc.cores=nc)
# Create a histogram
hist(unlist(res))
```

This uses 4 cores on your local machine to apply this function. If you save the results as a histogrm (for example, `yahtzee_histogram.png`), it will look similar to this:

![](/assets/images/yahtzee_histogram.png)
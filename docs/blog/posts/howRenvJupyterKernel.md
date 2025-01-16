---
date:
  created: 2023-08-23
categories:
    - R
    - Environments
authors:
    - mason
---

# How Do I Export My R Environment To JupyterHub?

If you've created an `R` virtual environment and want to use it as a kernel in JupyterHub, follow the steps below.


!!! note
    Want to use a Python virtual environment in JupyterHub? Have a look at [this page](/_getting_started/jupyter/){target="_blank"}

<!-- more -->

### Launch `R` In Virtual Environment
To start, open a terminal window, SSH into the Yens, and launch the instance of `R` associated with your virtual environment.

```title="Terminal Command"
/path/to/virtual/environment/bin/R
```

### Install And Use `IRkernel`
Once in your instance of `R`, install the `IRkernel` package and create a Jupyter kernel for your `R` environment.

```{ .r .no-copy title="Terminal Output"}
R version 4.2.1 (2022-06-23) -- "Funny-Looking Kid"
Copyright (C) 2022 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

> install.packages("IRkernel")
> library("IRkernel")
> IRkernel::installspec(name = 'rtest', displayname = 'This is a test R environment')
```

### Check Kernel Existence
Exit out of your instance of `R` and check for the existence of your new Jupyter kernel.

```title="Terminal Command"
jupyter kernelspec list
```
```{ .yaml .no-copy title="Terminal Output" }
Available kernels:
rtest                 /home/users/mpjiang/.local/share/jupyter/kernels/rtest
```

### Use Kernel In JupyterHub
Open a [JupyterHub](/_getting_started/jupyter/){:target="_blank"} session in your browser and you should now find your R environment available as a kernel under the `displayname` that you chose:

![JupyterHub select kernel screen with name of kernel selected](/assets/images/R-jupyter-kernel.png)

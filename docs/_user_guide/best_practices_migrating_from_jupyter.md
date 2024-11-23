---
date:
  created: 2024-09-14
categories:
    - Yen
---

<!-- ---
title: Migrating Processes From JupyterHub to Yen-Slurm
layout: indexPages/yen
subHeader: How to migrate processes
keywords: yen, web, jupyter, cluster, server
category: yen
parent: yen
order: 6
updateDate: 2023-12-18
--- -->

# Migrating Processes From JupyterHub To Yen-Slurm

JupyterHub and the interactive Yens are a great resource for developing and debugging code, but is not intended to be final stop for your research computing needs.  If your process requires more resources than the [technical limits](/_policies/user_limits/){:target="_blank"} of JupyterHub and Yen1-5, migrating your process to the [`yen-slurm`](/_user_guide/slurm/){:target="_blank"} scheduler</a> will allow you to access more resources.

## Common Reasons To Migrate Your Code From JupyterHub

There are three common reasons to migrate your code from JupyterHub:

1. JupyterHub has a 3 hour timeout limit on idle processes. If you are babysitting your code by keeping your laptop open and moving the mouse every few hours, it's time to migrate.

2. Your code uses more cores or RAM on `yen` than the limits stated on the [user limits page](/_policies/user_limits){:target="_blank"}. 

3. You would like to use the GPUs.


## Before You Migrate You Have A Few Options

* Run your workflow on a fraction of the data, and keep an eye on the memory usage.  You can expect your memory usage to scale with your data.
* Reduce the amount of cores your program uses.  If your usage is going above the CPU limit your program will get shut down.  Most code from ChatGPT will attempt to greedily use all cores on the system.
* Settle for a machine learning algorithm over deep learning. These can often times be as effective and use less resources.

[`This article`](/_user_guide/best_practices_monitor_usage/){:target="_blank"} gives some help on how to check your resources.  


## Managing Package Dependencies

The biggest hurdle in migrating your process from a JupyterHub notebook to `yen-slurm` will be managing package dependencies.  Generally, for any process, the following steps will help make a smooth transition:

* Create a virtual environment for your process to run
* Install any packages needed in that environment
* Setup that environment in JupyterHub
* Test your process 
* Write a submit script to run your process on `yen-slurm` using your working environment


## Python Virtual Environments

For Python, you can use `venv` to create an environment that can be shared across `yen`, `yen-slurm`, and JupyterHub. See [this page](/_user_guide/best_practices_python_env/){:target="_blank"} for information on setting up a Python virtual environment using `venv`.

### Activate Your Environment And Install `ipykernel`

```title="Terminal Command"
source <path/to/your/venv>/bin/activate
pip install ipykernel
```
The `ipykernel` package is required to make a virtual environment into a JupyterHub kernel.

### Setup That Environment In JupyterHub

!!! important
    Make sure your environment is **active** before installing it on JupyterHub!

The following command should install the environment `my_env` as a kernel in JupyterHub:

```title="Terminal Command"
python -m ipykernel install --user --name=my_env
```
          
In JupyterHub, you should see the new kernel, `my_env`, available. 


### Test Your Process

Try running your JupyterHub notebook using the `my_env` kernel you just installed.  You can change the kernel of an existing notebook by going to Kernel -> Change Kernel...

![Change Kernel](/assets/images/jupyterhub_changekernel.png)

If it works on this kernel, your next step would be to migrate these commands to a `.py` script.  You can test this by activating your `venv` environment on the Yens, and running your script via `python <my_script.py>`.

### Submit Script To Run Your Process

The specifics of writing a submit script are [`outlined here`](/_user_guide/slurm/){:target="_blank"}.  In addition, you'll need to make sure your submit script is running the correct python environment.  There are two ways to do that.

First, you can run 
```title="Terminal Command"
source <path/to/your/venv>/bin/activate
``` 
before you run `python`.  Afterwards, you can add the line 
```title="Terminal Command"
echo $(which python);
``` 
to print out which python your script using, to be sure it's in `my_env/bin/`.


The second method is to explicitly call out the python instance you want to use.  In your submit script, instead of using the command
```{ .yaml .no-copy }
python <my_script.py>
```
you would use 
```{ .yaml .no-copy }
<path/to/your/venv>/bin/python <my_script.py>
``` 
to be sure the `python` instance in your `venv` is being used.


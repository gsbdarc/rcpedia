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

# Migrating Processes From JupyterHub to Yen-Slurm

JupyterHub and the interactive Yens are a great resource for developing and debugging code, but is not intended to be final stop for your research computing needs.  If your process requires more resources than the technical limits of JupyterHub and Yen1-5, migrating your process to the [`yen-slurm`](/_user_guide/slurm/) scheduler</a> will allow you to access more resources.

## How do I know if it is time to migrate my code from JupyterHub?

There are three common reasons to migrate your code from JupyterHub:

1. Your code takes longer than 3 hours to run. JupyterHub has a 3 hour timeout limit on running processes. If you are baby sitting your code by keeping your laptop open and moving mouse every few hours its time to migrate.

2. Your code uses more than 48 cores or 192 GB of RAM on yens 2-5 or 12 cores or 320 GB of Ram on yen1. 

3. You would like to use the GPUS


Before you migrate you have a few option

* Run your workflow on a fraction of the data, and keep an eye on the memory usage.  You can expect your memory usage to scale with your data.
* Reduce the amount of cores your program uses. If your usage is going above the CPU limit your program will get shut down, in JupyterHub your kernal will die. Most code from chatGPT will attempt to greedily use all cores on the system.
* Settle for a Machin learning algorithm over deep learning. These can often times be as effective and use less resources.


!!! warning
    Not all algorithms or data types will scale memory linearly!

[`This article`](/_user_guide/best_practices_monitor_usage/){target="_blank"} gives some help on how to check your resources.  


## Managing Package Dependencies

The biggest hurdle in migrating your process from a JupyterHub notebook to `yen-slurm` will be managing package dependencies.  Generally, for any process, the following steps will help make a smooth transition:

* Create a virtual environment for your process to run
* Install any packages needed in that environment
* Setup that environment in JupyterHub
* Test your process 
* Write a submit script to run your process on `yen-slurm` using your working environment


### Python Virtual Environments

For Python, you can use  `venv` to create an environment that can be shared across Yen1-5, `yen-slurm`, and JupyterHub. See [this page](/_user_guide/best_practices_python_env/){target="_blank"} for information on setting up a Python virtual environment using `venv`.

#### Activate your environment and install ipykernel

```title="Terminal Command"
source <path/to/your/venv>/bin/activate
pip install ipykernel
```
The `ipykernel` package is required to make a virtual environment into a JupyterHub kernel.

#### Setup that environment in JupyterHub

!!! important
    Make sure your environment is **active** (`source <path/to/your/venv>/bin/activate`) before installing it on JupyterHub!

The following command should install the environment `my_env` as a kernel in JupyterHub:

```title="Terminal Command"
python -m ipykernel install --user --name=my_env
```
          
In JupyterHub, you should see the new kernel, `my_env`, available. 


#### Test your process

Try running your JupyterHub notebook using the `my_env` kernel you just installed.  You can change the kernel of an existing notebook by going to Kernel->Change Kernel...

![Change Kernel](/assets/images/jupyterhub_changekernel.png)

If it works on this kernel, your next step would be to migrate these commands to a `.py` script.  You can test this by activating your `venv` environment on the Yens, and running your script via `python <my_script.py>`.

#### Write a submit script to run your process on `yen-slurm` using your working environment

The specifics of writing a submit script are [`outlined here`](/_user_guide/slurm/){target="_blank"}.  In addition, you'll need to make sure your submit script is running the correct python environment.  There are two ways to do that.

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


### Non-Python Code Migration

If there's a package manager for the programming language you are using, try it out!

Otherwise, DARC recommends running your program from the interactive Yen command line before moving to `yen-slurm`.  This is a good test of whether your process will succeed or not.

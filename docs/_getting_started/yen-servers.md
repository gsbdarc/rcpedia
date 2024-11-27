# Yen Servers

##  Introduction to the Yen Servers

At the GSB, we have a collection of Ubuntu Linux servers (the `yen` cluster) specifically for doing your research computing work.  If you are a faculty member, PhD student, post-doc or research fellow, by default you should have access to these servers.  They are administered by the [Stanford Research Computing (SRC)](https://srcc.stanford.edu){:target="_blank"} and located in Stanford's data centers.

![](/assets/images/yens.png)

These Linux research servers are useful for a variety of tasks, including when you want or need to:

- Run a program over a long period of time and do not want to leave your personal computer on and running
- Run a program that will use a lot of memory (such as when analyzing a large data set)
- Take advantage of parallel processing
- Access software for which you do not have a personal license
- Save files in a place where multiple people can access and work with them

!!! danger
    The `Yen` servers are **NOT** designed for **teaching** or **high risk data**.

## Overview of the Yen Computing Infrastructure
![](/assets/images/yen-computing-infrastructure.png)

When you access the yen cluster, you get directed to your home directory on the interactive yen (`yen1, yen2, yen3, yen4 or yen5`).
At this point, you can manage your files, get them ready for submission, submit a job that will execute on yen-slurm cluster,
view the status of pending jobs and so on.

Once you submit your job, it gets queued along with all the other jobs submitted by other yen users.
We use a [Slurm scheduler](/_user_guide/slurm){:target="_blank"} to automatically form a *queue of jobs* with a fair share of common resources like cores and memory.
When the required amount of resources (CPU cores and/or memory) becomes available, the batch scheduler executes your job.
This practice is similar to [Sherlock HPC](https://www.sherlock.stanford.edu/docs/overview/introduction){:target="_blank"} and is common among many other supercomputers at various academic institutions and national labs.

Yen-Slurm has 11 nodes - `yen[11-18]` and `yen-gpu[1-3]`, each with multiple CPU's (processors) containing multiple cores and some with multiple GPU's.

Together, the yen-slurm cluster of 11 nodes has over 1,500 CPU cores, 10 TB of RAM, and 12 GPUs.

- **`yen[11, 15-18]`** has 2 CPUs per node, each with 128 cores, totaling **256 CPU cores** and **1 TB of RAM** per node.
- **`yen[12-14]`** each has **32 CPU cores** and **1.5 TB of RAM**. 
- **`yen-gpu[1-3]`** nodes have **64 CPU cores**, **256 GB of RAM**, and **4 GPUs**. **`yen-gpu1`** has **4** NVIDIA Ampere A30 GPUs, each with **24 GB of GPU RAM**. **`yen-gpu[2-3]`** each has **4** NVIDIA Ampere A40 GPUs, each with **48 GB of GPU RAM**.

<div class="row">
    <div class="col-lg-12">
      <H1> </H1>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
     <div class="fontAwesomeStyle"><i class="fas fa-tachometer-alt"></i> Current cluster configuration</div>
    <iframe class="airtable-embed" src="https://airtable.com/embed/shr0XAunXoKz62Zgl?backgroundColor=purple" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
    </div>
    <div class="col col-md-2"></div>
  </div>

## How to Connect
!!! tip
    New to using a research server?  Learn about [Getting Started](/_getting_started/how_access_yens){:target="_blank"}

There are various ways to connect to the `yen` servers.

* SSH in to `yen.stanford.edu`
* A terminal on [JupyterLab](/_getting_started/jupyter){:target="_blank"}
* RStudio or Jupyter Notebook on [JupyterLab](/_getting_started/jupyter){:target="_blank"}

When you SSH in to `yen.stanford.edu`, a load-balancer will assign you to `yen1`, `yen2`, `yen3`, `yen4` or `yen5`.  The `yen11`, `yen12`, `yen13`, `yen14`, `yen15`, `yen16`, `yen17`, `yen18`, `yen-gpu1`, `yen-gpu2`, and `yen-gpu3` servers can only be accessed using the [Slurm scheduler.](/_user_guide/slurm){:target="_blank"}

!!! tip
    Any work running on an interactive server (`yen[1-5]`) can only be started or stopped from that server.

## Why Use the `Yen` Servers?

These servers offer you several advantages over using a laptop or desktop computers.

**Better Hardware**

Let's use the server `yen2.stanford.edu` as an example: this machine has 256 processing cores and about 1 TB of RAM.  With `yen2`, you are able to complete memory- or CPU-intensive work that would overwhelm even the best personal laptop!

**Long running jobs**

Even when your laptop is capable of doing the job, you may still want to offload that work to the external server.  The server can free up resources for your laptop to use for other tasks such as browsing web sites, reading PDF files, working with spreadsheets, and so forth. If your laptop crashes, it's very convenient for your compute jobs to continue!

**Storage**

The project files and any large output should live on ZFS file system (not in your home). The ZFS capacity is nearly 1 PB (petabyte).

**Licensed software**

Tools like Matlab and Stata are installed and licensed to use on the `yen` servers.

# Yen Servers

##  Introduction to the Yen Servers

At the GSB, we have a collection of Ubuntu Linux servers (the Yen cluster) specifically for doing your research computing work.  If you are a faculty member, PhD student, post-doc or research fellow, by default you should have access to these servers.  They are administered by the [Stanford Research Computing (SRC)](https://srcc.stanford.edu){:target="_blank"} and located in Stanford's data centers.

![physical Yen servers](/assets/images/yens.png)

!!! danger
    The Yen servers are **NOT** designed for **teaching** or **high risk data**.

## Why Use the Yen Servers?

These servers offer you several advantages over using a laptop or desktop computers.

**Better Hardware**

Let's use the server `yen2.stanford.edu` as an example: this machine has 256 processing cores and about 1 TB of RAM.  With `yen2`, you are able to complete memory- or CPU-intensive work that would overwhelm even the best personal laptop!

**Long running jobs**

Even when your laptop is capable of doing the job, you may still want to offload that work to the external server.  The server can free up resources for your laptop to use for other tasks such as browsing websites, reading PDF files, working with spreadsheets, and so forth. If your laptop crashes, it's very convenient for your compute jobs to continue!

**Storage**

The project files and any large output should live on [ZFS file system](/_user_guide/storage/#preferred-platforms){:target="_blank"} (not in your home). The ZFS capacity is nearly 1 PB (petabyte).

**Licensed software**

[Tools like Matlab and Stata](/_getting_started/modules/){:target="_blank"} are installed and licensed to use on the Yen servers.

## How to Connect
!!! tip
    New to using a research server?  Learn about [**Getting Started**](/_getting_started/how_access_yens){:target="_blank"}

There are various ways to connect to the Yen servers.

* SSH in to `yen.stanford.edu`
* A terminal on [JupyterLab](/_getting_started/jupyter){:target="_blank"}
* [RStudio](/_getting_started/jupyter/#rstudio){:target="_blank"} or Jupyter Notebook on JupyterLab

When you SSH in to `yen.stanford.edu`, a load-balancer will assign you to one of the interactive Yen server: `yen1`, `yen2`, `yen3`, `yen4` or `yen5`.  

The Yen Slurm nodes can only be accessed using the [Slurm scheduler.](/_user_guide/slurm){:target="_blank"}

!!! tip
    Any work running on an interactive server (**`yen[1-5]`**) can only be **started or stopped from that server**.

## Overview of the Yen Computing Infrastructure
![Yen computing infrastructure](/assets/images/yen-computing-infrastructure.png)

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

!!! Important
     **`yen-gpu1`** has **4** NVIDIA Ampere **A30 GPUs**, each with **24 GB of GPU RAM**<br>
     **`yen-gpu[2-3]`** each has **4** NVIDIA Ampere **A40 GPUs**, each with **48 GB of GPU RAM**

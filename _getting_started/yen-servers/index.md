# Yen Servers

## Introduction to the Yen Servers

At the GSB, we have a collection of Ubuntu Linux servers (the Yen cluster) specifically for doing your research computing work. If you are a faculty member, PhD student, post-doc or research fellow, by default you should have access to these servers. They are administered by the [Stanford Research Computing (SRC)](https://srcc.stanford.edu) and located in Stanford's data centers.

Danger

The Yen servers are **NOT** designed for **teaching** or **high risk data**.

## Why Use the Yen Servers?

These servers offer you several advantages over using a laptop or desktop computers.

**Better Hardware**

Let's use the server `yen2.stanford.edu` as an example: this machine has 256 processing cores and about 1 TB of RAM. With `yen2`, you are able to complete memory- or CPU-intensive work that would overwhelm even the best personal laptop!

**Long running jobs**

Even when your laptop is capable of doing the job, you may still want to offload that work to the external server. The server can free up resources for your laptop to use for other tasks such as browsing websites, reading PDF files, working with spreadsheets, and so forth. If your laptop crashes, it's very convenient for your compute jobs to continue!

**Storage**

The project files and any large output should live in a dedicated [project space](/_user_guide/storage/#project-directory) (not in your home). The storage capacity is over 1 PB (petabyte).

**Licensed software**

[Tools like Matlab and Stata](/_getting_started/modules/) are installed and licensed to use on the Yen servers.

## How to Connect

Tip

New to using a research server? Learn about [**Getting Started**](/_getting_started/how_access_yens)

There are various ways to connect to the Yen servers.

- SSH in to `yen.stanford.edu`
- A terminal on [JupyterLab](/_getting_started/jupyter)
- [RStudio](/_getting_started/jupyter/#rstudio) or Jupyter Notebook on JupyterLab

When you SSH in to `yen.stanford.edu`, a load-balancer will assign you to one of the interactive Yen server: `yen1`, `yen2`, `yen3`, `yen4` or `yen5`.

The Yen Slurm nodes can only be accessed using the [Slurm scheduler.](/_user_guide/slurm)

Tip

Any work running on an interactive server (**`yen[1-5]`**) can only be **started or stopped from that server**.

## Overview of the Yen Computing Infrastructure

# 

Current cluster configuration

Important

**`yen-gpu1`** has **4** NVIDIA Ampere **A30 GPUs**, each with **24 GB of GPU RAM**\
**`yen-gpu[2-3]`** each has **4** NVIDIA Ampere **A40 GPUs**, each with **48 GB of GPU RAM**\
**`yen-gpu4`** has **2** NVIDIA Hopper **H200 GPUs**, each with **141 GB of GPU RAM**

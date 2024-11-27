---
title: Web-based Computing
layout: indexPages/yen
subHeader: How to of web-based computing
keywords: yen, web, jupyter, cluster, server
category: yen
parent: yen
order: 5
updateDate: 2020-02-13
---

# Web-based Computing

Web-based computing is now available on the Yen servers with [JupyterHub!](https://jupyterhub.readthedocs.io/en/stable/).  JupyterHub is a platform designed to allow multiple users to launch their own Jupyter notebook servers on a shared system with minimal user effort. Our implementation of JupyterHub currently features several language kernels including Python 3, R, and SAS.

## Getting Started

To get started, open a web browser and visit one of the following links for each server:

- <a href="https://yen1.stanford.edu/jupyter/" target="_blank">Yen1 https://yen1.stanford.edu/jupyter</a>
- <a href="https://yen2.stanford.edu/jupyter/" target="_blank">Yen2 https://yen2.stanford.edu/jupyter</a>
- <a href="https://yen3.stanford.edu/jupyter/" target="_blank">Yen3 https://yen3.stanford.edu/jupyter</a>
- <a href="https://yen4.stanford.edu/jupyter/" target="_blank">Yen4 https://yen4.stanford.edu/jupyter</a>
- <a href="https://yen5.stanford.edu/jupyter/" target="_blank">Yen5 https://yen5.stanford.edu/jupyter</a>

You will need to login with your SUNet credentials, and then `Launch Server`. From there, you will have access to the web-based computing services available.

If you are a non-GSB collaborator and don't have a SUNet, you must request full sponsorship to access Jupyter. You can learn more about SUNet ID sponsorship [here](https://uit.stanford.edu/service/sponsorship).

{% include important.html content="JupyterHub instances on each `yen` server are independent of each other! If you launch a server on `yen2`, it will only use resources available on `yen2`" %}

{% include warning.html content="JupyterHub does not work well on Safari - we recommend using a different browser" %}


## Features of JupyterHub

We recommend taking a look at the [official documentation](https://jupyter-notebook.readthedocs.io) for JupyterHub if you have any questions on the features below!

### Notebooks
-------------
![](/images/jupyter_notebooks.png "Notebooks")

Notebooks allow you to write code and execute it within a web browser.  Code is written into cells, which can be run in any order, on demand.  You can also include text, images, and plots to make your code read like a lab notebook.  As of March 2020, the above coding languages are supported. Contact the [DARC team](mailto:gsb_darcresearch@stanford.edu) if you have a language you would like installed

### Text File Editor
-------------------------
![](/assets/images/intro_to_yens/editor.png)

Finally, you can also edit text files like R scripts directly on JupyterHub. Clicking on Text File icon will open a new file that you can edit. Similarly, clicking on Python File will create an empty `.py` file and clicking on R File will create an empty `.r` file.
You can also navigate to a directory that has the scripts you want to edit and double click on the script name to open it up in the Text Editor.

For example, navigate to `intro_yens_sep_2023` folder in file brower first then double click on `investment-npv-parallel.R` file to open it in the text editor:
![](/images/intro_to_yens/edit-r-script.png)

### RStudio
-----------
![](/images/jupyter_rstudio.png "RStudio")

RStudio is also available! Clicking this link will bring up a new tab with a web-based RStudio on the Yens.

### SAS
-----------
![](/images/sas-jupyter_notebooks.png "SAS")

There are a few preliminary steps that need to be taken before SAS can be used on Yens/notebooks.

* Log into the Yens
* Install the [SAS kernel for Jupyter](https://github.com/sassoftware/sas_kernel) by running `pip3 install sas_kernel`
* Confirm that you see the newly installed SAS kernel by running `jupyter kernelspec list`
* Find the location where this new kernel is installed by running `pip3 show saspy` (it will probably be something like `/home/users/{SUNetID}/.local/lib/python3.6/site-packages/saspy`)
* Edit the default SAS path in the `sascfg.py` file within that directory to be `/software/non-free/SAS-langsup/SAS9.4/software/SASFoundation/9.4/sas`
* Restart JupyterHub and start a new notebook with the SAS kernel. After running your first cell, the output should show a successful connection to SAS.


### I don't see Julia on my JupyterHub!
---------------------------------------

See our [FAQ page](/faqs/installJuliaOnJupyter.html) on how to install it!


### Consoles and Terminal
-------------------------
![](/images/jupyter_consoles.png "Consoles")

You can also launch interactive consoles from JupyterHub.  These will behave very similar to the versions on the Yen servers.

![](/images/jupyter_terminal.png "Terminal")

You can also launch a bash terminal from JupyterHub.  This provides access to commands you would normally run on the Yens, but through the web browser.

### File Upload and Download
----------------------------
![](/images/jupyter_upload.png "File Upload")

One very useful feature of JupyterHub is the ability to upload and download files from ZFS/AFS.  First, make sure you are in the proper directory.  Then, to upload, click the up arrow on the top left of your screen to select a file.

![](/images/jupyter_download.png "File Download")

To download, right click the file you would like, and click "Download".

## Technical Details

### File Access and Storage
---------------------------
The JupyterHub instances will automatically launch from your home directory on the Yens.  Use the `afs-home` and `zfs` directories in your home directory to navigate to your normal file systems.

### Installing Packages
-----------------------
JupyterHub will load packages found in your `~/.local/` directory.  If you wish to install Python packages from a JupyterHub notebook, run `!pip3 install --user <package_name>` in a cell.  We recommend using similar user-based installs for other package managers.

### Technical Limits
------------
The following limits will be imposed on JupyterHub servers:

<iframe class="airtable-embed" src="https://airtable.com/embed/shrGC2dYzvDSgJfXa?backgroundColor=purple" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
JupyterHub instance will shut down after 3 hours idle (no notebooks actively running code).

{% include warning.html content="Idle servers shut down will not retain any local packages or variables in the notebooks.  Please save your output" %}

If your processes require more than these limits, reach out to the [DARC team](/services/researchSupportRequest.html) for support.

<!--
---
title: 6. Custom JupyterHub Python Kernel 
layout: indexPages/training
subHeader: Data, Analytics, and Research Computing. 
keywords: yen, jupyterhub, python, kernel, cluster, server
category: training 
parent: training
section: intermediateYens 
order: 6
updateDate: 2023-12-18
---
-->

# Custom JupyterHub Python Kernel
To make an active `venv` into a kernel in your JupyterHub, make sure you have an active `venv`:

```bash
$ source /zfs/gsb/intermediate-yens/venv/bin/activate
```
and that environment has `ipykernel` package installed.

#### Setup Active `venv` Environment as a Kernel in JupyterHub
The following command should install the active `venv` environment as a kernel in your JupyterHub:

```bash
$ python -m ipykernel install --user --name=interm-yens
```



If installed correctly, you should see:

``` { .yaml .select }
Installed kernelspec interm-yens in /home/users/$USER/.local/share/jupyter/kernels/interm-yens
```
where `$USER` is your username.
<!-- ```bash
Installed kernelspec interm-yens in /home/users/$USER/.local/share/jupyter/kernels/interm-yens
```
where `$USER` is your username. -->

#### Connect to JupyterHub

Open a web browser and connect to any of the following to start up your JupyterHub:

- <a href="https://yen1.stanford.edu/jupyter/" target="_blank">Yen1 https://yen1.stanford.edu/jupyter</a>
- <a href="https://yen2.stanford.edu/jupyter/" target="_blank">Yen2 https://yen2.stanford.edu/jupyter</a>
- <a href="https://yen3.stanford.edu/jupyter/" target="_blank">Yen3 https://yen3.stanford.edu/jupyter</a>
- <a href="https://yen4.stanford.edu/jupyter/" target="_blank">Yen4 https://yen4.stanford.edu/jupyter</a>
- <a href="https://yen5.stanford.edu/jupyter/" target="_blank">Yen5 https://yen5.stanford.edu/jupyter</a>

In JupyterHub, you should see the new kernel show up under Notebook Launcher:
![](/images/jupyter-kernel-interm-yens.png)


#### Test Your Process on JupyterHub

Try running your JupyterHub notebook using the `venv` kernel -- `interm-yens`, you just installed. You can change the kernel of an existing notebook by going to `Kernel` --> `Change Kernel…`:

![](/images/jupyterhub_changekernel.png)


Make sure you can import the required python packages in the notebook cell.

Copy and paste the following to test the import statements for python packages we will use:
```python
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

Kernel should indicate your `venv` environment name `interm-yens` (or whatever name you chose when adding this kernel to JupyterHub above):
![](/images/jupyter-kernel.png)

In case you need to uninstall a kernel from JupyterHub, use:

```bash
$ source /zfs/gsb/intermediate-yens/venv/bin/activate 
$ jupyter kernelspec list
$ jupyter kernelspec uninstall <kernel-name>
```
where `<kernel-name>` is the name of the kernel you want to uninstall.


---         
<a href="/training/5_python_env.html"><span class="glyphicon glyphicon-menu-left fa-lg" style="float: left;"/></a> <a href="/training/7_run_first_job.html"><span class="glyphicon glyphicon-menu-right fa-lg" style="float: right;"/></a>

<!--
---
title: How Do I Run a Jupyter Notebook on the Yens?
layout: indexPages/faqs
subHeader: Data, Analytics, and Research Computing.
keywords: Jupyter, faq, notebook, server, Yens
category: faqs
parent: faqs
section: software
order: 1
updateDate: 2020-03-18
---
-->

# How Do I Run a Jupyter Notebook on the Yens?

The best and easiest way to run Jupyter notebooks on the Yens is through [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/), which is set up on each individual Yen server. Please transition any past implementations of notebooks that you had on the Yens to this platform, which will be more stable and regularly maintained.

Find out more details about JupyterHub on the Yens [here](/yen/webBasedCompute.html).

ttps://yen1.stanford.edu/jupyter</a>
- <a href="https://yen2.stanford.edu/jupyter/" target="_blank">Yen2 https://yen2.stanford.edu/jupyter</a>
- <a href="https://yen3.stanford.edu/jupyter/" target="_blank">Yen3 https://yen3.stanford.edu/jupyter</a>
- <a href="https://yen4.stanford.edu/jupyter/" target="_blank">Yen4 https://yen4.stanford.edu/jupyter</a>
- <a href="https://yen5.stanford.edu/jupyter/" target="_blank">Yen5 https://yen5.stanford.edu/jupyter</a>

You will need to login with your SUNet credentials, and then click on `Start My Server`.  From there, you will have access to the web-based computing services available.


![](/images/intro_to_yens/launch-hub.png)

{% include important.html content="JupyterHub instances on each `yen` server are independent of each other! If you launch a server on `yen3`, it will only use resources available on `yen3`." %}

{% include warning.html content="JupyterHub does not work well on Safari - we recommend using a different browser." %}

## Features of JupyterHub

We recommend taking a look at the <a href="https://jupyter-notebook.readthedocs.io" target="_blank">official documentation</a> for JupyterHub if you have any questions on the features below!

The JupyterLab interface looks like:

![](/images/intro_to_yens/jupyterlab.png)

The front panel has a Launcher interface from which you can start notebooks with different language kernels and custom environment kernels.


### Notebook
![](/images/intro_to_yens/notebooks.png)

Notebooks allow you to write code and execute it on the yens in your web browser. 
Code is written into cells, which can be run in any order, on demand. 
You can also include text, images, and plots to make your code read like a lab notebook.  
Contact the [DARC team](mailto:gsb_darcresearch@stanford.edu) if you have a language you would like installed.

**Note:** If you do not see Julia as an option under Notebooks, see <a href="/faqs/installJuliaOnJupyter.html" target="_blank">this page</a> on how to add it.

### RStudio
-----------
![](/images/intro_to_yens/rstudio.png)

RStudio GUI is also available! Clicking this link will bring up a new tab with a web-based RStudio on the Yens.

If you opened up a notebook and want to get back to the Launcher interface to launch other software as well, click the "+" button in the upper left corner:
![](/images/intro_to_yens/launcher.png)


### Console
-------------------------
![](/images/intro_to_yens/console.png)

You can launch interactive consoles from JupyterHub.  These will behave very similar to the versions on the Yen servers.


### Terminal
-------------------------
![](/images/intro_to_yens/terminal.png)

You can launch a terminal from JupyterHub.  This provides access to commands you would normally run on the command line on the Yens, 
but through the web browser. However, we have seen issues with JupyterHub terminal (as well as VSCode) that modifies or overwrites python paths and environment variables so for package installations, we recommend using a terminal outside of JupyterHub.

Let's open up a Terminal and make a new directory where the scripts for this class will live.


```bash
$ mkdir intro_yens_sep_2023
$ mv investment-npv-parallel.R intro_yens_sep_2023
```
We moved the script `investment-npv-parallel.R` into the newly created directory, `intro_yens_sep_2023`.


### File Browser
The JupyterHub instances will automatically launch from your home directory on the Yens. 
Your home directory is a file icon shown by the red arrow:

![](/images/intro_to_yens/file-browser.png)

The current directory is also displayed:

![](/images/intro_to_yens/file-browser-current.png)

Clicking on the home icon (folder icon), returns the file browser back to your home where you can access any directories that are accessible from your home on the Yens.

![](/images/intro_to_yens/home-dir-zfs.png)

Double click on the `zfs` directory in your home directory to navigate to your ZFS project files.



### File Upload and Download
----------------------------
![](/images/jupyter_upload.png)

One very useful feature of JupyterHub is the ability to upload and download files from ZFS. 
First, make sure you are in the proper directory.  Then, to upload, click the up arrow on the top left of your screen to select a file from your local machine ot upload to the Yens.

![](/images/jupyter_download.png "File Download")

To download, right click the file you would like to download to your local machine, and click "Download".



### Installing Packages
-----------------------
JupyterHub loads packages found in your `~/.local/` directory. 
If you wish to install Python packages to be available in a JupyterHub notebook, we recommend using <a href="/training/5_python_env.html" target="_blank">Python `venv`</a> environment. 

The following limits will be imposed on JupyterHub servers:

<div class="row">
    <div class="col-lg-12">
      <H2> </H2>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
     <div class="fontAwesomeStyle"><i class="fas fa-tachometer-alt"></i> Compute Limits</div>
<iframe class="airtable-embed" src="https://airtable.com/embed/shrGC2dYzvDSgJfXa?backgroundColor=purple" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
   </div>
    <div class="col col-md-2"></div>
  </div>

JupyterHub instance will shut down after 3 hours idle (no notebooks actively running code).

{% include warning.html content="Idle servers shut down will not retain any local packages or variables in the notebooks.  Please save your output." %}

If your processes require more than these limits, reach out to the <a href="/services/researchSupportRequest.html" target="_blank">DARC team</a> for support.

---
<a href="/gettingStarted/7_transfer_files.html"><span class="glyphicon glyphicon-menu-left fa-lg" style="float: left;"/></a> <a href="/gettingStarted/9_run_jobs.html"><span class="glyphicon glyphicon-menu-right fa-lg" style="float: right;"/></a>

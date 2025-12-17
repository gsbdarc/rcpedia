# Web-based Computing

Web-based computing is available on the Yen servers with JupyterHub. JupyterHub is a platform designed to allow multiple users to launch their own Jupyter notebook servers on a shared system with minimal user effort. 

## Getting Started

To get started, open a web browser and visit one of the following links for each server:

- <a href="https://yen1.stanford.edu" target="_blank">`yen1` https://yen1.stanford.edu</a>
- <a href="https://yen2.stanford.edu" target="_blank">`yen2` https://yen2.stanford.edu</a>
- <a href="https://yen3.stanford.edu" target="_blank">`yen3` https://yen3.stanford.edu</a>
- <a href="https://yen4.stanford.edu" target="_blank">`yen4` https://yen4.stanford.edu</a>
- <a href="https://yen5.stanford.edu" target="_blank">`yen5` https://yen5.stanford.edu</a>

You will need to login with your SUNet credentials, and then click on "Start My Server". From there, you will have access to the web-based computing services available.

If you are a non-GSB collaborator and don't have a SUNet, you must request full sponsorship to access Jupyter. You can learn more about SUNet ID sponsorship [here](https://uit.stanford.edu/service/sponsorship){:target="_blank"}.

!!! note "Jupyter Instances are Independent" 
    JupyterHub instances on each Yen server are independent of each other! If you launch a server on `yen2`, it will only use resources available on `yen2`.

!!! warning "Do NOT use Safari Browser"
    JupyterHub does not work well on Safari - we recommend using a different browser.


## Features of JupyterHub

We recommend taking a look at the [official documentation](https://jupyter-notebook.readthedocs.io){:target="_blank"} for JupyterHub if you have any questions on the features below!

### RStudio
Launch RStudio by opening the link below. It will bring up a new tab with a web-based RStudio on the Yens.
![RStudio](/assets/images/jupyter_rstudio.png)
!!! warning "Launching the GUI Takes Time!"
    RStudio currently takes ~1 minute to load.
There is only one version of R usable in RStudio. The current version is `R/4.3.0`.

### Matlab
Matlab GUI is available. Launch it by clicking on the Open MATLAB icon. It will bring up a new tab with a web-based Matlab on the Yens.
!!! warning "Launching the GUI Takes Time!"
    Matlab currently takes ~5 minutes to load.

![Matlab GUI icon](/assets/images/matlab.png)
There is only one version of Matlab available via a GUI. The current version is `matlab/R2024a`.

### Notebooks
![row of icons of softwares in Notebooks](/assets/images/jupyter_notebooks.png)

Notebooks allow you to write code and execute it within a web browser.  Code is written into cells, which can be run in any order, on demand.  You can also include text, images, and plots to make your code read like a lab notebook.  As of December 2024, the above coding languages are supported. Contact the [DARC team](mailto:gsb_darcresearch@stanford.edu){:target="_blank"} if you have a language you would like installed.


#### Python 
JupyterHub comes with a default Python 3 kernel. 

In addition, any virtual environment created with `venv` can be made into a custom Python kernel in your JupyterHub. All the packages you install into the `venv` will be importable in Jupyter as well.

* First, activate your `venv` from a terminal:
    ```title="Terminal Command"
    source venv/bin/activate
    ```
    This command assumes you have [already made](/_user_guide/python_envs/#creating-a-new-virtual-environment-with-venv){:target=_blank} a `venv` in your project folder and the name of your virtual environment is `venv`.

* Install `ipykernel` package into the active `venv`: 
    ```title="Terminal Command"
    pip install ipykernel
    ```
* Add active `venv` as a kernel:

    ```title="Terminal Command"
    python -m ipykernel install --user --name=venv
    ```

* Open Jupyter and you should see the new kernel show up under Notebook Launcher. 

#### R
JupyterHub comes with a default R kernel. 

In addition, an `R` virtual environment can be added as a custom kernel as well. See [this blog](/blog/2023/08/23/how-do-i-export-my-r-environment-to-jupyterhub){:target=_blank} for details on how to add a custom R kernel to your Jupyter.

#### SAS
![SAS](/assets/images/sas-jupyter_notebooks.png)

There are a few preliminary steps that need to be taken before SAS can be used on the Yens/notebooks.

* Install the [SAS kernel for Jupyter](https://github.com/sassoftware/sas_kernel){:target=_blank} by running `pip3 install sas_kernel`.
* Confirm that you see the newly installed SAS kernel by running `jupyter kernelspec list`. You may need to have a Python virtual environment that already has Jupyter installed.
* Find the location where this new kernel is installed by running `pip3 show saspy`. It should look something like `/home/users/{SUNetID}/.local/lib/python3.10/site-packages/saspy`.
* Edit the default SAS path in the `sascfg.py` file within that directory to be `/software/non-free/SAS-langsup/SAS9.4/software/SASFoundation/9.4/sas`.
* Restart JupyterHub and start a new notebook with the SAS kernel. After running your first cell, the output should show a successful connection to SAS.


#### Julia
If you do no see a Julia kernel under Notebooks, follow these steps to add it: 

* Load Julia module and start Julia REPL:

    ```title="Terminal Command"
    module load julia
    julia
    ```

* Load `IJulia` for notebooks by running the following Julia commands in the interactive Julia console:

    ```.julia title="Julia Commands"
    using Pkg
    Pkg.add("IJulia")
    ```

* Relaunch JupyterHub server, and you should see Julia listed as a notebook kernel.

The steps above install Julia kernel that will use a single core on JupyterHub on the Yens. 

!!! tip "Add Multithreaded Julia Kernel to Jupyter"
    Optionally, you can also add a multithreaded Julia kernel. You will have two Julia kernels - one single threaded and one multithreaded.


If you want to run multithreaded Julia kernel, you can install it by running the following in the interactive Julia console. Choose the number of threads for the kernel to stay within [User Limits](/_policies/user_limits/){:target="_blank"}.

For example, let's say we want to use 4 threads. 

```julia title="Julia Commands to Add Julia Kernel with 4 Threads"
using IJulia
IJulia.installkernel(
    "julia-mp", 
    env=Dict("JULIA_NUM_THREADS" => "4")
)
```

Once you launch JupyterHub and the new multithreaded Julia kernel, check that you are using the 
correct number of threads:

```julia title="Example Output"
Threads.nthreads()
4
```

The output of `Threads.nthreads()` should be equal to the number of threads you used to create the kernel.

#### Stata
* Install Stata kernel by running this command from a terminal:
```title="Terminal Command"
install_stata_kernel
```
    This command will take a few minutes to run and will do the following:
    - Create a new Python virtual environment named `stata_kernel`

    - Install the `stata_kernel` and `jupyter` Python packages inside the environment

    - Install the Stata kernel in user JupyterHub

    - Generate a `.stata_kernel.conf` configuration file in your home directory with the correct Stata path and runtime settings

    If everything worked, you should see:
    ```{ .yaml .no-copy title="Terminal Output" }
    Loading Stata module...
    Creating Python virtual environment for Stata kernel...
    Activating virtual environment...
    Installing Stata kernel and Jupyter...
    Installing Jupyter kernel spec
    Configuring Stata kernel...
    Installation complete!
    Launch JupyterHub and select Stata notebook
    ```
    The install script adds a Stata/19 kernel to JupyterHub. 
 
    
* Start JupyterHub.
    
    You should now see a Stata kernel under Notebooks:
    
    ![Stata Kernel](/assets/images/stata-kernel.png)
    
* Finally, test that Stata works. Open a new Stata notebook and run:
    
    ![Testing Stata kernel](/assets/images/test-stata-kernel.png)
    
### Uninstalling Jupyter Kernels
If you need to uninstall a particular Jupyter kernel, you can do so with `jupyter kernelspec` commands. 

First, list all of your Jupyter kernels:    
```title="Terminal Command"
jupyter kernelspec list 
```

Then, to uninstall a kernel called `mykernel`, run:
```title="Terminal Command"
jupyter kernelspec uninstall mykernel
```

### Consoles and Terminal
You can also launch interactive consoles from JupyterHub.  These will behave very similar to the versions on the Yen servers.
![Consoles](/assets/images/jupyter_consoles.png)

You can also launch a bash terminal from JupyterHub.  This provides access to commands you would normally run on the Yens, but through the web browser.

![Terminal](/assets/images/jupyter_terminal.png)


!!! warning "Jupyter Terminal vs. Standard `ssh` Terminal"
    You may notice slight differences between the Jupyter terminal and a standard `ssh` login terminal. Please use a terminal not in Jupyter to build, install and configure software. If you experience any unexpected behavior in the Jupyter terminal, please log in using `ssh` and try again.


### File Upload and Download
One very useful feature of JupyterHub is the ability to upload and download files from Yen storage.  First, make sure you are in the proper directory.  Then, to upload, click the up arrow on the top left of your screen to select a file.

![File Upload](/assets/images/jupyter_upload.png)


To download, right click the file you would like, and click "Download".

![File Download](/assets/images/jupyter_download.png)


### Text File Editor
![Editor](/assets/images/editor.png)

Finally, you can also edit text files like R scripts directly on JupyterHub. Clicking on Text File icon will open a new file that you can edit. Similarly, clicking on Python File will create an empty `.py` file and clicking on R File will create an empty `.r` file.
You can also navigate to a directory that has the scripts you want to edit and double click on the script name to open it up in the Text Editor.

## Technical Details

### File Access and Storage
The JupyterHub instances will automatically launch from your home directory on the Yens.  Use the `zfs` directory in your home directory to navigate to your normal [file systems](/_user_guide/storage/#yen-file-system){:target=_blank}.

### Installing Packages
JupyterHub will load packages found in your `~/.local/` directory.  For Python, we recommend using environments to install packages.  You can review the [User Guide](/_user_guide/python_envs/){:target="_blank"} for Python packages and the [User Guide](/_user_guide/r/#installing-r-packages){:target=_blank} for R packages.

### Technical Limits
* JupyterHub instance will shut down after 3 hours idle (no notebooks actively running code).

!!! warning "Please Save Your Work"
    Idle servers shut down will not retain any local packages or variables in the notebooks.  Please save your output.

* JupyterHub servers have the same [User Limits](/_policies/user_limits){:target=_blank} as the interactive Yen nodes.


!!! tip "Learn How to Migrate to Yen-Slurm"
    If your notebooks take days to run or you often exceed the resource limits, it might be time to [migrate your Jupyter](/_user_guide/migrating_from_jupyter){:target=_blank} processes to Yen-Slurm.

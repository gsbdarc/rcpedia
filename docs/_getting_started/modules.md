# Software on Yen Servers

##  Overview
The Yen servers host a variety of software packages for research and computing needs. This guide provides information on available software, how to load specific versions, and how to manage software modules on the Yen servers.

## Available Software

Here's a list of software packages currently available on the Yen servers:

- AMPL
- Anaconda
- AWS CLI
- Bats
- Bbcp
- Dotnet
- Emacs
- Goold Cloud
- Google Drive
- Go
- GSL
- Gurobi
- HDF5
- Intel-python
- Intel
- Julia
- KNitro
- Ludwig
- Mathematica
- Matlab
- Microsoft-R
- Mosek
- OpenMPI
- PostgreSQL
- Python
- PyTorch
- R
- Rclone
- SAS
- Singularity
- Stata
- Tensorflow
- Tomlab

To check the current list of available software and versions, use the following command:

```title="Terminal Command" 
module avail
```

You should see the following:

```{ .yaml .no-copy title="Terminal Output"}
---------------------------------------------------------------- Global Aliases -----------------------------------------------------------------
   statamp/17 -> stata/17
------------------------------------------------------------ /software/modules/Core -------------------------------------------------------------
   R/3.6.3                   gurobi/8.0.1                julia/1.8.0                   python/2.7.18               stata/17      (D)
   R/4.0.2                   gurobi/9.0.2                julia/1.9.2                   python/3.10.5      (D)      stata/18
   R/4.1.3                   gurobi/9.5.2                julia/1.10.2           (D)    python/3.10.11              statamp/now
   R/4.2.1                   gurobi/10.0.0        (D)    knitro/12.0.0                 python/3.11.3               statamp/16
   R/4.3.0            (D)    gurobipy/9.5.2              knitro/12.1.1                 pytorch/2.0.1      (g)      statamp/17    (D)
   ampl/20231031             gurobipy/10.0.0      (D)    knitro/12.3.0                 pytorch/2.1.2      (g,D)    statamp/18
   anaconda/5.2.0            gurobipy3/9.5.2             knitro/14.0.0          (D)    rclone/1.47.0               tensorflow/2  (g)
   anaconda3/5.2.0           gurobipy3/10.0.0     (D)    ludwig/0.8.6           (g)    rclone/1.54.0               tomlab/8.8
   anaconda3/2022.05         hdf5/1.12.0                 mathematica/11.2              rclone/1.60.0               xstata-mp/now
   anaconda3/2023.09  (D)    intel-python/2019.4         matlab/R2018a                 rclone/1.62.2               xstata-mp/16
   awscli/2.13.22            intel-python3/2019.4        matlab/R2018b                 rclone/1.63.1      (D)      xstata-mp/17  (D)
   bats/1.5.0                intel/2019.4                matlab/R2019b                 sas/9.4                     xstata-mp/18
   bbcp/17.12.00.00.0        julia/0.7.0                 matlab/R2021b                 singularity/3.4.0           xstata/now
   dotnet/2.1.500            julia/1.0.0                 matlab/R2022a                 singularity/3.11.5 (D)      xstata/16
   dotnet/3.0.0-p2    (D)    julia/1.0.2                 matlab/R2022b          (D)    stata-mp/now                xstata/17     (D)
   emacs/27.2                julia/1.2.0                 matlab/R2024a                 stata-mp/16                 xstata/18
   gcloud/448.0.0            julia/1.3.1                 microsoft-r-open/3.5.3        stata-mp/17        (D)      xstatamp/now
   gdrive/2.1.0              julia/1.5.1                 mosek/10.2                    stata-mp/18                 xstatamp/16
   go/1.13                   julia/1.6.2                 openmpi/4.1.0                 stata/now                   xstatamp/17   (D)
   gsl/2.7.1                 julia/1.7.3                 postgresql/15.1        (g)    stata/16                    xstatamp/18
  
  Where:
   g:  built for GPU
   D:  Default Module

f the avail list is too long consider trying:
"module --default avail" or "ml -d av" to just list the default modules.
"module overview" or "ml ov" to display the number of modules for each name.

Use "module spider" to find all possible modules and extensions.
Use "module keyword key1 key2 ..." to search for all possible modules matching any of the "keys".

```

The `(D)` stands for the default module. These will be loaded when the version is not specified. The `(g)` means these module were built with GPU support, meaning they will support use with our GPU nodes.

You can filter module avail for a specific software with the command: 

```title="Terminal Command"
module avail R/
```

```{ .yaml .no-copy title="Terminal Output"}
-------------------------------------------------------------------------- Global Aliases ---------------------------------------------------------------------------
---------------------------------------------------------------------- /software/modules/Core -----------------------------------------------------------------------
   R/3.6.3    R/4.0.2    R/4.1.3    R/4.2.1    R/4.3.0 (D)
 
  Where:
   D:  Default Module

If the avail list is too long consider trying:
"module --default avail" or "ml -d av" to just list the default modules.
"module overview" or "ml ov" to display the number of modules for each name.

Use "module spider" to find all possible modules and extensions.
Use "module keyword key1 key2 ..." to search for all possible modules matching any of the "keys".

```

## Loading Software Modules

To load a software module, use the following command:

```title="Terminal Command"
module load <module_name>
```
!!! Tip
    You may also use the `ml` command as a shorthand for `module load`.

For example, to load R:
    
```title="Terminal Command"
module load R
```

To see currently loaded modules, use the following command:

```title="Terminal Command"
module list
```

or with the shorthand:

```title="Terminal Command"
ml
```

if you have loaded the R module, you should see the following output:

```{ .yaml .no-copy title="Terminal Output"}
Currently Loaded Modules:
  1) R/4.3.0
```

## Switching Versions

If multiple versions of a software are available, the default version is indicated by a `(D)`. To load a specific version, you'll need to specify the version number. For example, to load R version 4.1.3, use the following command:

```title="Terminal Command"
module load R/4.1.3
```
Now if you run the command `module list`, you should see the following output:

```{ .yaml .no-copy title="Terminal Output"} 
Currently Loaded Modules:
  1) R/4.1.3
```

You can also swap versions of R with the command:

```title="Terminal Command"
module swap R/3.6.3
```
```{ .yaml .no-copy title="Terminal Output"}
Currently Loaded Modules:
  1) R/3.6.3
```

## Unloading Modules

You can unload an individual module with:

```title="Terminal Command"
module unload rstudio
```

Or with a shorthand:

```title="Terminal Command"
ml -rstudio
```
Or you can unload all modules that you have currently loaded with:

```title="Terminal Command"
ml purge
```

Now, if you run 

```title="Terminal Command"
ml
```

You will see:

```{ .yaml .no-copy title="Terminal Output"}
No modules loaded
```

## Managing Software Modules

Sometimes you want to know the path where software binary is installed. For example, you might use this information 
to install some R packages from source. To get details about a currently loaded package, use:

```title="Terminal Command"
ml R/4.2.1
ml show R
```

This will print the following information that might be useful:

```{ .yaml .no-copy title="Terminal Output"}
--------------------------------------------------------------------------------------------------
   /software/modules/Core/R/4.2.1.lua:
---------------------------------------------------------------------------------------------------
whatis("Name: R")
whatis("Version: 4.2.1")
whatis("Category: tools")
whatis("URL: http://cran.cnr.berkeley.edu/")
whatis("Description: R")
family("R")
load("rstudio")
prepend_path("PATH","/software/free/R/R-4.2.1/bin")
```

Linux modules only modify your current working environment which means that if you lose connection to the Yens or close your terminal window,
you will need to reload the modules. But all of the libraries or packages that you have installed as a user will persist and 
only need to be installed once.

Once the software you want to use is loaded, the binary is available for you to use from the command line. 
For example, if you want to install R packages or run interactive R console, type:

```title="Terminal Command"
R
```

The interactive R console will open with the R version matching the module you have loaded:

```{ .yaml .no-copy title="Terminal Output"}
R version 4.2.1 (2022-06-23) -- "Funny-Looking Kid"
Copyright (C) 2022 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.
Type 'license()' or 'licence()' for distribution details.

R is a collaborative project with many contributors.
Type 'contributors()' for more information and
'citation()' on how to cite R or R packages in publications.

Type 'demo()' for some demos, 'help()' for on-line help, or
'help.start()' for an HTML browser interface to help.
Type 'q()' to quit R.
```

Type `q()` to exit out of R:

```title="Terminal Command"
q()
```
```{ .yaml .no-copy title="Terminal Output"}
Save workspace image? [y/n/c]: n
```

# Software on Yen Servers

## Overview

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
- Google Cloud
- Google Drive
- Go
- GSL
- Gurobi
- HDF5
- Intel-python
- Julia
- Knitro
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
- TensorFlow
- Tomlab

To check the current list of available software and versions, use the following command:

```title="Terminal Command" 
module avail
```

You should see the following:

```{ .yaml .no-copy title="Terminal Output"}
----------------------------------------------------------------- Global Aliases -----------------------------------------------------
   statamp/17 -> stata/17

------------------------------------------------------------- /software/modules/Core -------------------------------------------------
   R/3.6.3                   gurobi/9.0.2                julia/1.10.2           (D)    python/3.10.11              statamp/16
   R/4.0.2                   gurobi/9.5.2                knitro/12.0.0                 python/3.11.3               statamp/17    (D)
   R/4.1.3                   gurobi/10.0.0        (D)    knitro/12.1.1                 pytorch/2.0.1      (g)      statamp/18
   R/4.2.1                   gurobipy/9.5.2              knitro/12.3.0                 pytorch/2.1.2      (g,D)    tensorflow/2  (g)
   R/4.3.0            (D)    gurobipy/10.0.0      (D)    knitro/14.0.0          (D)    rclone/1.47.0               tomlab/8.8
   ampl/20231031             gurobipy3/9.5.2             ludwig/0.8.6           (g)    rclone/1.54.0               xstata-mp/now
   anaconda/5.2.0            gurobipy3/10.0.0     (D)    mathematica/11.2              rclone/1.60.0               xstata-mp/16
   anaconda3/5.2.0           hdf5/1.12.0                 mathematica/14.1.0     (D)    rclone/1.62.2               xstata-mp/17  (D)
   anaconda3/2022.05         intel-python/2019.4         matlab/R2018a                 rclone/1.63.1      (D)      xstata-mp/18
   anaconda3/2023.09  (D)    intel-python3/2019.4        matlab/R2018b                 sas/9.4                     xstata/now
   awscli/2.13.22            intel/2019.4                matlab/R2019b                 singularity/3.4.0           xstata/16
   bats/1.5.0                julia/0.7.0                 matlab/R2021b                 singularity/3.11.5 (D)      xstata/17     (D)
   bbcp/17.12.00.00.0        julia/1.0.0                 matlab/R2022a                 stata-mp/now                xstata/18
   dotnet/2.1.500            julia/1.0.2                 matlab/R2022b          (D)    stata-mp/16                 xstatamp/now
   dotnet/3.0.0-p2    (D)    julia/1.2.0                 matlab/R2024a                 stata-mp/17        (D)      xstatamp/16
   emacs/27.2                julia/1.3.1                 microsoft-r-open/3.5.3        stata-mp/18                 xstatamp/17   (D)
   gcloud/448.0.0            julia/1.5.1                 mosek/10.2                    stata/now                   xstatamp/18
   gdrive/2.1.0              julia/1.6.2                 openmpi/4.1.0                 stata/16
   go/1.13                   julia/1.7.3                 postgresql/15.1        (g)    stata/17           (D)
   gsl/2.7.1                 julia/1.8.0                 python/2.7.18                 stata/18
   gurobi/8.0.1              julia/1.9.2                 python/3.10.5          (D)    statamp/now

  Where:
   g:  built for GPU
   D:  Default Module
```

The `(D)` stands for the default module. These will be loaded when the version is not specified. The `(g)` means these modules were built with GPU support, meaning they will support use with our GPU nodes.

You can filter `module avail` for a specific software with the command: 

```title="Terminal Command"
module avail R/
```

```{ .yaml .no-copy title="Terminal Output"}
-------------------------------------------------------------------------- Global Aliases ---------------------------------------------------------------------------
---------------------------------------------------------------------- /software/modules/Core -----------------------------------------------------------------------
   R/3.6.3    R/4.0.2    R/4.1.3    R/4.2.1    R/4.3.0 (D)
 
  Where:
   D:  Default Module
```

## Loading Software Modules

To load a software module, use the following command:

```title="Terminal Command"
module load <module_name>
```

!!! Tip
    You may also use the `ml` command as a shorthand for `module load`.

For example, to load R, run:
    
```title="Terminal Command"
module load R
```

To see the currently loaded modules, use the following command:

```title="Terminal Command"
module list
```

or with the shorthand:

```title="Terminal Command"
ml
```

If you have loaded the R module, you should see the following output:

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

You can also swap versions of R with the following command:

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
module unload R/3.6.3
```

or with the shorthand:

```title="Terminal Command"
ml -R/3.6.3
```

Alternatively, you can unload all currently loaded modules with:

```title="Terminal Command"
ml purge
```

Now, if you run: 

```title="Terminal Command"
ml
```

you will see:

```{ .yaml .no-copy title="Terminal Output"}
No modules loaded
```

## Managing Software Modules

Sometimes you want to know the path where software binary is installed. For example, this information can be useful when installing certain R packages from source. To get details about a currently loaded module, you can use the following commands:

```title="Terminal Command"
ml R/4.2.1
ml show R
```

These commands will display information about the module, including details that might be useful for your task.

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

Linux modules modify only your current working environment. This means that if you lose connection to the Yens server or close your terminal window, you will need to reload the modules. However, all the libraries or packages you have installed as a user will persist and only need to be installed once.

Once the software you want to use is loaded, the binary becomes available for use from the command line.
For example, to install R packages or run the interactive R console, type:

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

Type `q()` to exit the interactive R console:

```title="Terminal Command"
q()
```

Type `n` when prompted to save the workspace. This is generally recommended to prevent clutter from unwanted saved objects and to provide a clean start for your next session:

```{ .yaml .no-copy title="Terminal Output"}
Save workspace image? [y/n/c]: n
```
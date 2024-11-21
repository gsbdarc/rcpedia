# Running R Interactively

On the Yens, R is available via the `module` command.

See all currently installed versions with:

```title="Terminal Input"
module avail R/
```

You will see the current R versions listed:

```{.yaml .no-copy title="Terminal Output"}
----------------------------------------------------------------- Global Aliases -----------------------------------------------------------------


------------------------------------------------------------- /software/modules/Core -------------------------------------------------------------
   R/3.6.3    R/4.0.2    R/4.1.3    R/4.2.1    R/4.3.0 (D)

  Where:
   D:  Default Module
```

!!! tip
    If you require access to a newer R version that is not currently available on the system, please don't hesitate to [contact DARC](mailto:gsb_darcresearch@stanford.edu) to request its installation.

## Load R Module
To use R software on the Yens, load the module:
```title="Terminal Input"
ml R
```
This will load the default R module. You can also load a specific version of R with:

```title="Terminal Input"
ml R/4.2.1
```

## Managing R Software Libraries and Versions
The R software is installed system-wide, allowing each user to maintain their own set of R packages within their home directory by default. Furthermore, each R version has its dedicated library, distinct from other versions.
Every R version will also have its own library separate from other versions. For example, R 4.0 will have its user-installed
packages side by side with R 4.2 library containing the user-installed packages specific to that version.

!!! warning
    When upgrading your R version (e.g., to run code with a newly released R version), you must first install packages that are needed for your script to run for that specific R version. 

However, once the package is installed, you can load it in your scripts without the need for repeated installations upon each login.

## Installing R Packages 
Load the R module with the version that you want (R 4.3 is the current default).

For example, let's use the newest R version available on the yens:

```bash title="Terminal Input"
ml R
```

Start interactive R console by typing `R`.

You should see:

``` {.yaml .no-copy R title="Terminal Output"} 
R version 4.3.0 (2023-04-21) -- "Already Tomorrow"
Copyright (C) 2023 The R Foundation for Statistical Computing
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

>
```

### Example Package Install
In R, install packages that you need:
```R title="Terminal Input"
> install.packages('foreach')
```

!!! note
    If this is your first time installing R package for this R version on the Yens, you will be asked to create a personal library because users do not have write permissions to the system R library. 

Answer `yes` to both questions:
```{.yaml .no-copy R title="Create User R Library"}
Warning in install.packages("foreach") :
  'lib = "/software/free/R/R-4.3.0/lib/R/library"' is not writable
Would you like to use a personal library instead? (yes/No/cancel) yes
Would you like to create a personal library
‘/zfs/home/users/nrapstin/R/x86_64-pc-linux-gnu-library/4.3’
to install packages into? (yes/No/cancel) yes
```
This creates a new personal R 4.3 library in your home directory. The library path is
`~/R/x86_64-pc-linux-gnu-library/4.3` where all of the user packages will be installed. Once the library is created, next
package will be installed there automatically when the corresponding R module is loaded.

If asked, pick any mirror in the US:
```{.yaml .no-copy R title="Pick a Mirror"}
Installing package into ‘/home/users/nrapstin/R/x86_64-pc-linux-gnu-library/4.3’
(as ‘lib’ is unspecified)
--- Please select a CRAN mirror for use in this session ---
Secure CRAN mirrors

 1: 0-Cloud [https]
 2: Australia (Canberra) [https]
...
74: USA (IA) [https]
75: USA (MI) [https]
76: USA (OH) [https]
77: USA (OR) [https]
78: USA (TN) [https]
79: USA (TX 1) [https]
80: Uruguay [https]
81: (other mirrors)

Selection: 77
```
If the package is successfully installed, you should see:

```{.yaml .no-copy R title="Package Was Successfully Installed Message"}
* DONE (foreach)

The downloaded source packages are in
        ‘/tmp/RtmpsYpzoP/downloaded_packages’
```
If you want to quit R, type:
```R title="Terminal Input"
> q()
```

## Run R Code Interactively
After loading the version of R you need, to execute a R script at the terminal, run:
```bash title="Terminal Input"
Rscript <your-script.R>
```
where `<your-script.R>` is your R script.



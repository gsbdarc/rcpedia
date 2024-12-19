# RStudio

On the Yens, RStudio Server is available via the JupyterHub. You can access your files and scripts and develop R code in a convenient environment.

!!! warning
    RStudio only has a single version of R. Right now, it is version R/4.3.0.

Launch RStudio from Launcher JupyterHub interface:
![RStudio launch button from Jupyter](/assets/images/jupyter_rstudio.png)


RStudio Server will open up in a new tab. 

!!! warning 
    The RStudio server may take some time to load during startup.

![RStudio server opens](/assets/images/rstudio-gui.png)

!!! danger
    Do **not** install packages directly from RStudio on JupyterHub. Instead, use the terminal and run R to install packages. This ensures compatibility with the Yen environment.

See [this guide](/_user_guide/r#installing-r-packages){target="_blank"} on how to install R packages on the Yens. Make sure the R module you load is the one RStudio is using.


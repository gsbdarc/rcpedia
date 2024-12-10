# Running Python Interactively

To use the system Python software on the Yens, simply type `python3`.

```title="Terminal Input"
python3
```

This Python can be found at `/usr/bin/python3`

You should see:

```{.yaml .no-copy title="Terminal Output"} 
Python 3.10.12 (main, Sep 11 2024, 15:47:36) [GCC 11.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```

This will load the system Python version (Python-3.10.12) 
You can also load a specific version of Python with:

!!! Tip 
    If you need a specific version of python we recommend using a [virtual environment](/_user_guide/best_practices_python_env/#creating-a-new-virtual-environment-with-venv).


### Managing Python Software Libraries and Versions

The Python3 software is installed system-wide, allowing each user to maintain their own set of Python3 packages within their home directory by default. Each Python version has its own dedicated library, allowing you to maintain packages independently for different versions. To make sure your Python packages are installed to the correct place, check out the [Python Virtual Environment](/_user_guide/best_practices_python_env/) guide.

!!! Warning
    This is the system Python. Note that [JupyterHub](/_getting_started/jupyter) uses a different Python version.

#### Installing Python Packages
pip/pip3 is the package installer for Python. To install a package, use the following command:

```title="Terminal Input"
pip3 install package_name
```

This will install a package to your home directory. In the `/home/users/<user_name>/.local/lib/python3.x/site-packages`. 

!!! Tip
    This will take up space in your home directory and may cause package conflicts later. To avoid this, you can install packages in a project-specific virtual environment. 


#### Example: Installing a Python Package

```title="Terminal Input"
pip3 install pandas
```

This will install the pandas package to your home directory.

You can verify this by navigating to the directory where the package is installed:

```title="Terminal Input"
ls /home/users/<user_name>/.local/lib/python3.x/site-packages

```

You should see the installed package listed:

```{.yaml .no-copy title="Terminal Output"}
pandas  pandas-2.2.3.dist-info
```

You can now import this package in your Python scripts

### Running Python Scripts

To run a Python script, use the following command:

```title="Terminal Input"
python3 script.py
```
where `script.py` is your Python script.
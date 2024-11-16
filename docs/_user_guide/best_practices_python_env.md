# Python Environments

Python environments are a foundational aspect of professional Python development, allowing developers to isolate and manage Python packages and dependencies specific to individual projects or tasks. This isolation is crucial in maintaining a clean and organized development workspace, as it prevents conflicts between packages used in different projects. Furthermore, virtual environments ensure that projects are reproducible and can be shared with others without compatibility issues, as all the necessary dependencies are clearly defined and contained within the environment.

Managing Python virtual environments can be achieved through various tools, each offering unique features and benefits. The most commonly used tools include:

* `venv`: built into Python 3.3 and later,
* `Virtualenv`: third-party tool that supports both newer and older Python versions,
* [Anaconda](https://www.anaconda.com/products/distribution){:target="_blank"}: third-party tool popular in data science,
* `Pipenv`: third-party tool that combines package management with virtual environment management.

The choice of tool often depends on the specific needs of a project and the preferences of a development team. For instance, `venv` is typically sufficient for straightforward Python projects, while `virtualenv` might be preferred for projects requiring compatibility with older Python versions or more granular control over the environment.

Regardless of the tool selected, the best practices for using Python virtual environments involve:

*  **Creating a New Environment for Each Project**: This ensures that each project has its own set of dependencies.
*  **Documenting Dependencies**: Clearly listing all dependencies in a requirements file or using a tool that automatically manages this aspect.
*  **Regularly Updating Dependencies**: Keeping the dependencies up-to-date to ensure the security and efficiency of your projects.

By adhering to these practices, developers can take full advantage of Python virtual environments, leading to more efficient, reliable, and maintainable code development.

## Best Practices on the Yens

!!! Recommendation
    Utilize `venv` for Python Environment Management

We highly recommend using `venv`, Python’s built-in tool for creating virtual environments, especially in shared systems like the Yens. This recommendation is rooted in several key advantages that `venv` offers over other tools like `conda`:

* **Built-in and Simple**: `venv` is included in Python's standard library, eliminating the need for third-party installations and making it straightforward to use, especially beneficial in shared systems where ease of setup and simplicity are crucial.
* **Fast and Resource-Efficient**: `venv` offers quicker environment creation and is more lightweight compared to tools like `conda`, making it ideal for shared systems where speed and efficient use of resources are important.
* **Ease of Reproducibility**: `venv` allows for easy replication of environments by using a `requirements.txt` file, ensuring that the code remains reproducible and consistent regardless of the platform.

## Creating a New Virtual Environment with `venv`

To ensure the virtual environment is sharable, create it in a shared location on the Yen system, such as a faculty project directory, rather than in a user’s home directory. The virtual environment only needs to be created once, and all team members with access to the project directory will be able to activate and use it.

Let's navigate to the shared project directory:

```title="Terminal Command"
cd <path/to/project>
```
where `<path/to/project>` is the shared project location on ZFS.

Create a new virtual environment using the system Python path named `my_env` where we make a directory `my_env` inside the project directory.:

```title="Terminal Command"
/usr/bin/Python3  -m venv my_env
```

## Activating a New Virtual Environment

Next, we activate the virtual environment:

```title="Terminal Command"
source my_env/bin/activate
```

You should see `(my_env):` prepended to the prompt:

```{ .yaml .no-copy title="Terminal Output" }
(my_env):
```

Check Python version:

```title="Terminal Command"
python3 --version
```
```{ .yaml .no-copy title="Terminal Output" }
python 3.10.12
```

## Installing Python Packages into the New Virtual Environment

Install any Python package with `pip`:

```title="Terminal Command"
pip install <package>
```

where `<package>` is a Python package (or list) to install, such as `numpy` or `pandas`.

## Running Python Scripts Using Virtual Environment

Using your environment is straightforward—as long as your environment is activated, you can run Python as usual:

```title="Terminal Command"
python3 <my_script.py>
```
where `<my_script.py>` is your Python script.

The Python executabled will be specific to your environment. You can troubleshoot this with the `which` command:

```title="Terminal Command"
which python3
```
```{ .yaml .no-copy title="Terminal Output" }
/path/to/env/bin/python3
```
where `/path/to/env/bin/python3` is the path to the system Python in your environment.

## Making the Virtual Environment into a JupyterHub Kernel

Install `ipykernel` package before installing the new environment as a kernel on JupyterHub:

```title="Terminal Command"
pip install ipykernel
```

To add the **active** virtual environment as a kernel, run:

```title="Terminal Command"
Python3 -m ipykernel install --user --name=<kernel-name>
```

where `<kernel-name>` is the name of the kernel on JupyterHub.

## Saving and Sharing Virtual Environment

One of the major advantages of virtual environments is the ability to share their setup with others. This is achieved by saving the environment’s dependencies to a file (e.g., `requirements.txt`), which allows others to recreate the same environment on thier own system.

The tool we will use for this is called `pipreqs` and it can be installed using `pip`:

```title="Terminal Command"
pip install pipreqs
```

Next, we use `pipreqs` to generate a `requirements.txt` file that captures all the package dependencies required to recreate the virtual environment. If all the Python scripts reside in `src` directory, `pipreqs` will identify all the packages used in those scripts:

```title="Terminal Command"
pipreqs <path/to/project/src>
```

The `requirements.txt` file will be automatically generated and saved in the `<path/to/project/src>` directory. This file contains all the necessary information for `pip` to rebuild the environment.

Create a new virtual environment named `new_env`:

```title="Terminal Command"
/usr/bin/python3  -m venv new_env
```

Activate the virtual environment on a new server:

```title="Terminal Command"
source new_env/bin/activate
```

Finally, install the dependencies listed in the `requirements.txt` file inside the virtual environment.

```title="Terminal Command"
pip install -r <path/to>/requirements.txt
```

## Deactivating the Virtual Environment

You can deactivate the virtual environment with:

```title="Terminal Command"
deactivate
```

### Removing the Virtual Environment

If you would like to delete a previously created virtual environment, simply delete the environment directory. Since a `venv` environment is essentially a directory containing files and folders, removing it is as simple as deleting the directory.

```title="Terminal Command"
rm -rf <env_name>
```

!!! Warning
    Before deleting a virtual environment, especially in a shared project setting, ensure that all team members are informed and agree with the decision. Deleting an environment is irreversible and may impact others who rely on the same setup for development, testing, or deployment. Always verify that the environment is no longer needed for the project's continuity and that any valuable configurations have been safely backed up or migrated.

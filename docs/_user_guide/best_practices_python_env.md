Python environments are a foundational aspect of professional Python development, allowing developers to isolate and manage Python packages and dependencies specific to individual projects or tasks. This isolation is crucial in maintaining a clean and organized development workspace, as it prevents conflicts between packages used in different projects. Furthermore, virtual environments ensure that projects are reproducible and can be shared with others without compatibility issues, as all the necessary dependencies are clearly defined and contained within the environment.

Managing Python virtual environments can be achieved through various tools, each offering unique features and benefits. The most commonly used tools include:

* `venv`: built into Python 3.3 and later,
* `Virtualenv`: third-party tool that supports both newer and older Python versions, 
* [Anaconda](https://www.anaconda.com/products/distribution): third-party tool popular in data science,
* `Pipenv`: third-party tool that combines package management with virtual environment management.

The choice of tool often depends on the specific needs of a project and the preferences of a development team. For instance, `venv` is typically sufficient for straightforward Python projects, while `Virtualenv` might be preferred for projects requiring compatibility with older Python versions or more granular control over the environment.

Regardless of the tool selected, the best practices for using Python virtual environments involve:
1. **Creating a New Environment for Each Project**: This ensures that each project has its own set of dependencies.

2. **Documenting Dependencies**: Clearly listing all dependencies in a requirements file or using a tool that automatically manages this aspect.

3. **Regularly Updating Dependencies**: Keeping the dependencies up-to-date to ensure the security and efficiency of your projects.

By adhering to these practices, developers can take full advantage of Python virtual environments, leading to more efficient, reliable, and maintainable code development.

### Best Practices on the Yens
**Recommendation: Utilizing venv for Python Environment Management**

We highly recommend using `venv`, Python’s built-in tool for creating virtual environments, especially in shared systems like the Yens. This recommendation is rooted in several key advantages that `venv` offers over other tools like `conda`:

* **Built-in and Simple**: `venv` is included in Python's standard library, eliminating the need for third-party installations and making it straightforward to use, especially beneficial in shared systems where ease of setup and simplicity are crucial.

* **Fast and Resource-Efficient**: `venv` offers quicker environment creation and is more lightweight compared to tools like `conda`, making it ideal for shared systems where speed and efficient use of resources are important.

* **Ease of Reproducibility**: `venv` allows for easy replication of environments by using a `requirements.txt` file, ensuring that the code remains reproducible and consistent regardless of the platform.


## Creating a New Virtual Environment with `venv`

To make the virtual environment sharable, we make it in a shared location on the Yens such as a faculty project directory, and not in user's home. The virtual environment needs to be created once and all team members with access to the project directory will able to activate and use it. 

Let's navigate to the shared project directory:

```bash
$ cd <path/to/project>
```
where `<path/to/project>` is the shared project location on ZFS.

Create a new virtual environment:

```bash
$ /usr/bin/python3  -m venv .venv
```
where we make a hidden directory `.venv` inside the project directory. 

## Activating a New Virtual Environment 

Next, we activate the virtual environment:
```bash
$ source .venv/bin/activate
```

You should see `(.venv):` prepended to the prompt: 
```bash
(.venv): 
```

Check Python version:

```
$ python --version
Python 3.10.12
```

## Installing Python Packages into the New Virtual Environment
Install any python package with `pip`:

```bash
$ pip install <package>
```

where `<package>` is a Python package (or list) to install, such as `numpy`, `pandas`, etc.

## Making the Virtual Environment into a JupyterHub Kernel 
Install `ipykernel` package before installing the new environment as a kernel on JupyterHub:

```bash
$ pip install ipykernel
```

To add the **active** virtual environment as a kernel, run:
```bash
$ python -m ipykernel install --user --name=<kernel-name>
```
where `<kernel-name>` is the name of the kernel on JupyterHub.

## Running Python Scripts Using Virtual Environment
Using your environment is very simple - as long as your environment is activated, you can run python normally:

```
(.venv) USER@yenX:$ python <my_script.py> 
```
where `<my_script.py>` is your Python script.

The Python command will be specific to your environment. You can troubleshoot this with the `which` command:

```
(.venv) USER@yenX:$ which python
/path/to/env/bin/python
```
where `/path/to/env/bin/python` is the path to the Python in your environment.

## Activating a Shared Virtual Environment That Has Already Been Created 
Simply navigate to the shared project directory and activate the environment:

```bash
$ cd <path/to/project>
$ source .venv/bin/activate
```
This assumes the virtual environment has been previously installed in the project directory under `.venv` subdirectory.

## Saving and Sharing Virtual Environment

One of the big advantages of virtual environments is sharing the environments. This is done by saving the environment to a file.

The tool we are going to use is called `pipreqs` and we can install it with `pip`:

```
$ pip install pipreqs
```
We then use `pipreqs` to generate a `requirements.txt` that captures all package requirements for recreating the virtual environment. If all of the Python scripts live in `src` directory, `pipreqs` will identify all the packages that are used in the scripts:

```
$ pipreqs <path/to/project/src>
```
The `requirements.txt` will be automatically generated and saved in `<path/to/project/src>` directory. You will now have a `requirements.txt` file with all the necessary information for `pip` to build your environment.

If you want to load this environment on a new server, you can run the following command:

```
$ source <env_name>/bin/activate
(<env_name>)$ pip install -r <path/to>/requirements.txt
```

### Deactivating the Virtual Environment
You can deactivate the virtual environment with:
```
$ deactivate
```

### Removing the Virtual Environment
If you would like to delete the previouly created virtual enviroment, simply delete the environment directory since `venv` environment is essentially a directory containing files and folders. 

```
$ rm -rf .venv
```

**Caution**: Before deleting a virtual environment, especially in a shared project setting, ensure that all team members are informed and agree with the decision. Deleting an environment is irreversible and may impact others who rely on the same setup for development, testing, or deployment. Always verify that the environment is no longer needed for the project's continuity and that any valuable configurations have been safely backed up or migrated.

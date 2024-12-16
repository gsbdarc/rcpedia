# Running Python Interactively

To use the system Python software on the Yens, simply type `python3`.

```title="Yen Terminal Input"
python3
```

This Python can be found at `/usr/bin/python3`

Upon entering `python3`, you should see output similar to the following:

```{.yaml .no-copy title="Yen Terminal Output"} 
Python 3.10.12 (main, Sep 11 2024, 15:47:36) [GCC 11.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```

This will load the system Python version (Python-3.10.12) 

To exit the Python interpreter, type `exit()` or press ++ctrl+"D"++ .



!!! Tip 
    If you need a specific version of python we recommend using a [virtual environment](/_user_guide/best_practices_python_env/#creating-a-new-virtual-environment-with-venv){:target="_blank"}.

### Running Python Scripts

#### 1. Create a Python Script 

Let's create the classic "Hello, World!" script. Create a file named hello.py with the following content:

```title="hello.py"
print("Hello, World!")
```

!!! Tip
    - **Using JupyterHub**: If you're logged into JupyterHub, you can create and edit this file using the built-in text editor.
    - **Using the Command Line**: If you're using the command line, you can create this file using [`vim hello.py`](/blog/2023/09/20/editing-files-on-the-command-line){:target="_blank"} or another text editor.
    ```title="Terminal Input"
    vim hello.py
    ```
    

#### 2. Run the Python Script

To execute the Python script, run the following command in the terminal:

```title="Terminal Input"
python3 hello.py
```

You should see the following output:

```{.yaml .no-copy title="Terminal Output"}
Hello, World!
```

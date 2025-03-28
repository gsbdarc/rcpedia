# Optimization

We have licensed and installed optimization software on the Yens that the GSB researchers can use including
[Gurobi](https://www.gurobi.com){:target="_blank"}, [Knitro](https://www.artelys.com/solvers/knitro){:target="_blank"}, and [AMPL](https://ampl.com){:target="_blank"}. In this guide, we will show how to use the licensed optimization software interactively on the Yens, in Jupyter notebooks and in Slurm.

## Software Overview

- **Gurobi** is a state-of-the-art mathematical optimization solver that delivers high-performance solutions for linear programming (LP), mixed-integer linear programming (MILP), quadratic programming (QP), mixed-integer quadratic programming (MIQP), and other related problems. Known for its robustness and speed, Gurobi is designed to efficiently solve large-scale optimization problems.
- **Knitro** is an advanced solver for nonlinear optimization. It offers algorithms for both smooth and non-smooth
problems, making it particularly effective for solving large-scale, complex nonlinear problems. Knitro is well-suited for applications requiring high precision.
- **AMPL** (A Mathematical Programming Language) is a powerful and flexible algebraic modeling language for linear and
nonlinear optimization problems. It is designed to express complex problems with simple, readable formulations. AMPL's strength lies in its ability to integrate with various solvers, including Gurobi and Knitro.

## Running Software Interactively on the Yens

### Gurobi

#### Running Gurobi in Python

Because the Yens already have Gurobi software and Gurobi Python interface installed, we simply need to access them by loading the `gurobipy3` [module](/_getting_started/modules/){:target="_blank"}.

Load Gurobi module:
```title="Terminal Command"
ml gurobipy3
```

Next, create a new [Python virtual environment](/_user_guide/python_envs/){:target="_blank"} using the `venv` package.
This virtual environment will be used across interactive Yen cluster nodes, Slurm nodes, and as a Jupyter kernel.

To ensure the virtual environment is sharable, create it in a shared location on the Yen cluster, such as a faculty project directory, rather than in a user’s home directory.

Let's navigate to the shared project directory:

```title="Terminal Command"
cd <path/to/project>
```

Create a new virtual environment, named `gurobi_env`:

```title="Terminal Command"
/usr/bin/python3  -m venv gurobi_env
```
You can also choose a different name instead of `gurobi_env` in this step.

Next, activate the virtual environment using the following command:

```title="Terminal Command"
source gurobi_env/bin/activate
```

You should see `(gurobi_env):` prepended to the prompt:

```{ .yaml .no-copy title="Terminal Output" }
(gurobi_env): $
```

Finally, install the required python packages using `pip` (this step may take some time):

```title="Terminal Command"
pip install numpy pandas ipykernel threadpoolctl scipy gurobipy
```

The `ipykernel` module is needed to turn this virtual environment into a Jupyter kernel at a later step, the `threadpoolctl` and `scipy` packages are used in the example, and the [`gurobipy`](https://pypi.org/project/gurobipy/){:target="_blank"} package serves as the Python interface to Gurobi.

After the packages are installed, start the Python REPL by typing `python`:

```title="Terminal Command"
python
```

This will display:

```{ .python .yaml .no-copy title="Terminal Output" }
Python 3.10.12 (main, Sep 11 2024, 15:47:36) [GCC 11.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Ensure that you can import `gurobipy`by running the following command:

```python title="Terminal Command"
from gurobipy import *
```

To exit the REPL, type:

```title="Terminal Command"
exit()
```

When you are finished working interactively and want to deactivate the virtual environment and unload all modules, run the following commands:

```title="Terminal Command"
deactivate
module purge
```

The environment is now set up to run your Python scripts that import `gurobipy` on the interactive Yen cluster nodes. Keep in mind that the `module load` command and virtual environment activation are only active in the current shell.

!!! Important
    You need to load the `gurobipy3` module and activate your `venv` environment every time you log in to the Yens before running the interactive Python scripts that use the `gurobipy` package.

#### Running Gurobi in R

!!! Warning
    The default Gurobi 10 version is not compatible with the default R 4.3 version. To ensure proper functionality, you need to use R 4.2 instead. Running `ml gurobi R` with an incompatible version will result in an error. For more details on which Gurobi versions work with specific R versions, please refer to the information provided [here](https://support.gurobi.com/hc/en-us/articles/360025593712-Which-R-versions-are-supported-by-Gurobi){:target="_blank"}. 

Similar to running Gurobi in Python, Gurobi R package is also installed and available system-wide to use on the Yens. You do not need to install anything into your user R library.

To use Gurobi software with R, simply load both modules:

```title="Terminal Command"
ml gurobi R/4.2
```

To list the currently loaded modules, use:

```title="Terminal Command"
 ml
```
```{ .yaml .no-copy title="Terminal Output" }
Currently Loaded Modules:
  1) gurobi/10.0.0   2) R/4.2.1
```

Launch interactive R:

```title="Terminal Command"
 R
```

Then you can load the `gurobi` R package:

```{ .yaml .no-copy title="Terminal Output" }
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
>
```

```R title="Terminal Command"
library("gurobi")
```
```{ .yaml .no-copy title="Terminal Output" }
Loading required package: slam
>
```

You can now run the R scripts to solve the optimization problem using Gurobi on interactive Yen cluster nodes.

!!! Important
    You need to load the `gurobi` and `R` modules every time you log in to the Yens before running the interactive R scripts that use `gurobi` R package.

Note that if you want to use an older Gurobi version, you will need to install `gurobi` R package to your user R library.

Load R and the older Gurobi module:

```title="Terminal Command"
module purge
ml R/4.2 gurobi/9.5.2
```

Start R by typing `R`:

```title="Terminal Command"
R
```

Then install a personal `gurobi` package that links to Gurobi 9:

```title="Terminal Command"
install.packages("/software/non-free/Gurobi/gurobi952/linux64/R/gurobi_9.5-2_R_4.2.0.tar.gz", repos=NULL)
```
```{.r .yaml .no-copy title="Terminal Output" }
> install.packages("/software/non-free/Gurobi/gurobi952/linux64/R/gurobi_9.5-2_R_4.2.0.tar.gz", repos=NULL)
Warning in install.packages("/software/non-free/Gurobi/gurobi952/linux64/R/gurobi_9.5-2_R_4.2.0.tar.gz",  :
  'lib = "/software/free/R/R-4.2.1/lib/R/library"' is not writable
Would you like to use a personal library instead? (yes/No/cancel) yes
Would you like to create a personal library
‘/home/users/$USER/R/x86_64-pc-linux-gnu-library/4.2’
to install packages into? (yes/No/cancel) yes
* installing *binary* package ‘gurobi’ ...
* DONE (gurobi)
```

```R title="Terminal Command"
library("gurobi")
```
```{ .yaml .no-copy title="Terminal Output" }
Loading required package: slam
>
```

Quit R. You can now run the R scripts to solve the optimization problem using Gurobi on interactive Yen cluster nodes.


### AMPL with Knitro Solver

#### Running AMPL with Knitro Solver in Python

Because the Yens already have Knitro and AMPL software installed, we simply need to load the appropriate [modules](/_getting_started/modules/){:target="_blank"}.

Load both modules:

```title="Terminal Command"
ml ampl knitro
```

You can check currently loaded modules with:

```title="Terminal Command"
ml
```
```{ .yaml .no-copy title="Terminal Output" }
Currently Loaded Modules:
  1) ampl/20231031   2) knitro/14.0.0
```

You can get details about a specific module with:

```title="Terminal Command"
ml show knitro
```

which displays useful details about `PATH` modifications when the module is loaded:

```{ .yaml .no-copy title="Terminal Output" }
---------------------------------------------------------------------------------------------------------------------
   /software/modules/Core/knitro/14.0.0.lua:
---------------------------------------------------------------------------------------------------------------------
whatis("Name:        knitro")
whatis("Version:     14.0.0")
whatis("Category:    math, optimization")
whatis("URL:         https://www.artelys.com/en/optimization-tools/knitro")
whatis("Description: Artelys Knitro is an optimization solver for difficult large-scale nonlinear problems.")
pushenv("KNITRODIR","/software/non-free/knitro/14.0.0")
pushenv("ARTELYS_LICENSE_NETWORK_ADDR","srcc-license-srcf.stanford.edu")
prepend_path("PATH","/software/non-free/knitro/14.0.0/knitroampl")
prepend_path("LIBRARY_PATH","/software/non-free/knitro/14.0.0/lib")
prepend_path("LD_LIBRARY_PATH","/software/non-free/knitro/14.0.0/lib")
prepend_path("CPATH","/software/non-free/knitro/14.0.0/include")
prepend_path("MATLABPATH","/software/non-free/knitro/14.0.0/knitromatlab")
prepend_path("PYTHONPATH","/software/non-free/knitro/14.0.0/examples/Python")
```

Next, create a new [Python virtual environment](/_user_guide/python_envs/){:target="_blank"} using the `venv` package.
This virtual environment will also be used across interactive Yen cluster nodes, Slurm nodes, and as a Jupyter kernel. The process is the same as the one we set up for Gurobi above.

To ensure the virtual environment is sharable, create it in a shared location on the Yen cluster, such as a faculty project directory, rather than in a user’s home directory.

Let's navigate to the shared project directory:

```title="Terminal Command"
cd <path/to/project>
```

Create a new virtual environment, named `opt`:

```title="Terminal Command"
/usr/bin/python3  -m venv opt
```
You can also choose a different name instead of `opt` in this step.

Next, activate the virtual environment using the following command:

```title="Terminal Command"
source opt/bin/activate
```

You should see `(opt):` prepended to the prompt:
```{ .yaml .no-copy title="Terminal Output" }
(opt): $
```

Finally, install the required python packages using `pip` (this step may take some time):

```title="Terminal Command"
pip install numpy pandas ipykernel amplpy
```

The `ipykernel` module is needed to turn this virtual environment into a Jupyter kernel at a later step and the [`amplpy`](https://pypi.org/project/amplpy){:target="_blank"} package serves as the Python interface to AMPL.

We can now use both AMPL and Knitro on interactive Yen cluster nodes. After the packages are installed, start the Python REPL by typing `python`:

```title="Terminal Command"
python
```

This will display:

```{ .python .yaml .no-copy title="Terminal Output" }
Python 3.10.12 (main, Sep 11 2024, 15:47:36) [GCC 11.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Ensure that you can import `amplpy` and verify that AMPL is accessible and the license is a network floating license by running the following code. You can save it to `knitro_test.py`and run it in the terminal:

```python linenums="1" title="knitro_test.py"
import os
import sys
from amplpy import AMPL, Environment

# Initialize the AMPL instance with a specific AMPL license
ampl = AMPL(Environment("/software/non-free/ampl/20231031/"))

try:
    # Execute an AMPL command to check the version
    ampl.eval("option version;")    
    
    # Set Knitro as the solver for an optimization problem
    ampl.setOption('solver', "/software/non-free/knitro/14.0.0/knitroampl/knitroampl")
    
    # Define and solve an optimization problem
    ampl.eval('''
    # Simple Linear Optimization Problem
    var x >= 0;   # Decision variable x
    var y >= 0;   # Decision variable y
    maximize objective: x + 2 * y;  # Objective function
    subject to Constraint1: 3 * x + 4 * y <= 24;  # Constraint 1
    ''')
   
    # Solve the defined optimization problem
    ampl.solve()

finally:
    # Output the results of the optimization
    print(f"Objective value: {ampl.getObjective('objective').value()}")
    print(f"x = {ampl.getVariable('x').value()}")
    print(f"y = {ampl.getVariable('y').value()}")
    
    # Properly close the AMPL instance to free resources
    ampl.close()

```

We point to the AMPL floating network license with `AMPL(Environment("/software/non-free/ampl/20231031"))` call.

The `ampl.eval()` call should indicate that we have checked out the license:

```{ .yaml .no-copy title="Terminal Output" }
option version 'AMPL Development Version 20231213 (Linux-5.15.0-1052-azure, 64-bit)\
Licensed to Stanford University, Natalya Rapstine <nrapstin@stanford.edu> (srcc-license-srcf).\
Temporary license expires 20250131.\
Using license file "/software/non-free/ampl/20231031/ampl.lic".\
';
```

!!! Warning
    To ensure that the AMPL instance is always properly released (even in cases of errors or exceptions), we must properly close `ampl` instance. The `try` and `finally` logic does that in which we release the AMPL license with `ampl.close()` call. Be sure to shut down the Jupyter kernel when using AMPL in a Jupyter notebook, as only one floating license is available.

We also point to the Knitro license on the Yens with `ampl.setOption()` call.

After defining the problem, the `ampl.solve()` call should print out the Knitro license information and the problem solution.

```{ .yaml .no-copy title="Terminal Output" }
=======================================
           Academic License
       (NOT FOR COMMERCIAL USE)
         Artelys Knitro 14.0.0
=======================================

No start point provided -- Knitro computing one.

Knitro presolve eliminated 0 variables and 0 constraints.

concurrent_evals:        0
datacheck:               0
hessian_no_f:            1
The problem is identified as an LP.
```

To exit the REPL, type:

```title="Terminal Command"
exit()
```

When you are finished working interactively and want to deactivate the virtual environment and unload all modules, run the following commands:

```title="Terminal Command"
deactivate
module purge
```

The environment is now set up to run your Python scripts that use AMPL and Knitro on the interactive Yen cluster nodes. Keep in mind that the `module load` command and virtual environment activation are only active in the current shell.

!!! Important
    You need to load the `ampl` and `knitro` modules and activate your `venv` environment every time you log in to the Yens before running the interactive Python scripts that use AMPL and Knitro.

## Integrating with Jupyter Notebooks

### Running Gurobi in Jupyter Notebooks

To make Gurobi Python interface work on the Yen's JupyterHub, we can take our `gurobi_env` virtual environment and make it into a Jupyter kernel.

Load `gurobipy3` module:
```title="Terminal Command"
ml gurobipy3
```

Activate the virtual environment in your project space:

```title="Terminal Command"
cd <path/to/project>
source gurobi_env/bin/activate
```

Then, we add the **active** `gurobi_env` virtual environment as a new JupyterHub kernel and name it as `gurobi_env`:

```title="Terminal Command"
python -m ipykernel install --user --name=gurobi_env \
--env GUROBI_HOME /software/non-free/Gurobi/gurobi1000/linux64 \
--env GRB_LICENSE_FILE /software/non-free/Gurobi/gurobi1000/linux64/gurobi.lic \
--env PATH '/software/non-free/Gurobi/gurobi1000/linux64/bin:${PATH}' \
--env LD_LIBRARY_PATH '/software/non-free/Gurobi/gurobi1000/linux64/lib:${LD_LIBRARY_PATH}'
```

Notice the extra `--env` arguments to add necessary Gurobi environment variables so that Jupyter kernel can find the software. List all of your Jupyter kernels with the following command:

```title="Terminal Command"
jupyter kernelspec list
```

To remove a kernel, run:

```title="Terminal Command"
jupyter kernelspec uninstall <kernel-name>
```

where `<kernel-name>` is the name of the kernel you want to uninstall from JupyterHub.

On [JupyterHub](/_getting_started/jupyter/){:target="_blank"}, launch the new `gurobi_env` kernel and test the package imports:
<br>

![gurobi kernel image](/assets/images/gurobi-kernel.png)

### Running AMPL/Knitro in Jupyter Notebooks

To make AMPL/Knitro Python interface work on the Yen's JupyterHub, we can take our `opt` virtual environment and make it into a Jupyter kernel.

Load AMPL and Knitro modules:

```title="Terminal Command"
ml ampl knitro
```

Activate the virtual environment in your project space:

```title="Terminal Command"
cd <path/to/project>
source opt/bin/activate
```

Then, we add the **active** `opt` virtual environment as a new JupyterHub kernel and name it as `opt`:

```title="Terminal Command"
python -m ipykernel install --user --name=opt \
--env KNITRODIR /software/non-free/knitro/14.0.0 \
--env ARTELYS_LICENSE_NETWORK_ADDR srcc-license-srcf.stanford.edu \
--env LD_LIBRARY_PATH '/software/non-free/knitro/14.0.0/lib:${LD_LIBRARY_PATH}' \
--env PYTHONPATH '/software/non-free/knitro/14.0.0/examples/Python:${PYTHONPATH}'
```

Notice the extra `--env` arguments to add necessary Knitro and AMPL environment variables so that Jupyter kernel can find the licenses. Launch the new `opt` kernel and test the `ampl` and `knitro` imports.
<br>

![knitro jupyter kernel image](/assets/images/opt_kernel.png)
![knitro license info image](/assets/images/opt_kernel-2.png)

### Combining Gurobi, Knitro, and AMPL in a Single Kernel

Consider combining the instructions for Gurobi and AMPL/Knitro to make a single "optimization" virtual environment and Jupyter kernel. After loading `gurobipy3`, `ampl` and `knitro` modules, make the virtual environment, activate it, then `pip install` all the required packages - `numpy pandas ipykernel threadpoolctl scipy gurobipy amplpy`.

You can then make that active virtual environment into a new Jupyter kernel combining the environment variables we used previously and name it as `opt_combined`:

```title="Terminal Command"
python -m ipykernel install --user --name=opt_combined \
--env GUROBI_HOME /software/non-free/Gurobi/gurobi1000/linux64 \
--env GRB_LICENSE_FILE /software/non-free/Gurobi/gurobi1000/linux64/gurobi.lic \
--env KNITRODIR /software/non-free/knitro/14.0.0 \
--env ARTELYS_LICENSE_NETWORK_ADDR srcc-license-srcf.stanford.edu \
--env LD_LIBRARY_PATH '/software/non-free/knitro/14.0.0/lib:${LD_LIBRARY_PATH}' \
--env PATH '/software/non-free/Gurobi/gurobi1000/linux64/bin:${PATH}' \
--env PYTHONPATH '/software/non-free/knitro/14.0.0/examples/Python:${PYTHONPATH}'
```

On [JupyterHub](/_getting_started/jupyter/){:target="_blank"}, launch the new `opt_combined` kernel and test the package imports for `amplpy`, `gurobipy` and all other previous imports.

!!! Note
    Since we already have a Jupyter kernel named `opt`, we chose a different name `opt_combined` for the combined Gurobi, AMPL and Knitro kernel. If you choose the same kernel name `opt`, the `opt` kernel will be overwritten to reference the latest kernel install from the active environment.

## Running Software on Slurm

### Running Batch Jobs 

To use the optimization software on the [Yen Slurm cluster](/_user_guide/slurm/){:target="_blank"}, we first need to load the required modules and activate the virtual Python environment before calling python in the Slurm script. Let's save the following Slurm script to a file named `opt_test.slurm`:

```bash linenums="1" title="opt_test.slurm"
#!/bin/bash

# Example of running Gurobi, AMPL and Knitro on Yens

#SBATCH -J opt
#SBATCH -p normal
#SBATCH -c 1                    # one core per task
#SBATCH -t 1:00:00
##SBATCH --mem=1gb              # uncomment/set to request total RAM need
#SBATCH -o opt-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Clean modules first
module purge

# Load software
module load gurobipy3 ampl knitro

# Activate venv (can either be a global or relative path)
source /zfs/projects/<your-project>/opt_combined/bin/activate

# Run Python script
python <my_script.py>
```

In this example, we load all three optimization software, but you can omit the ones you don't need.

Submit this Slurm script to test:

```title="Terminal Command"
sbatch opt_test.slurm
```

See your job in the queue:

```title="Terminal Command"
squeue
```

Display the `.out` file once the job is done.

```title="Terminal Command"
cat *.out
```

### Running Job Arrays

A Slurm job array is a way to launch multiple jobs in parallel. One use case is when you want to change input parameters in your script (such as a Python, Julia, or R script). Instead of manually changing the input parameters and rerunning the script multiple times, you can achieve this with a single job array.

#### Gurobi Example

We will work with the following Python script that was modified from [Gurobi documentation](https://docs.gurobi.com/current/){:target="_blank"} that performs sensitivity analysis using the Gurobi optimization library.

Specifically, this script formulates and solves a simple Mixed Integer Programming (MIP) model using the Gurobi matrix API:

![gurobi equation image](/assets/images/gurobi-eq.png)

Save this Python script to a new file named `gurobi_sensitivity.py`.

```python linenums="1" title="gurobi_sensitivity.py"
import numpy as np
import scipy.sparse as sp
import gurobipy as gp
import sys
from threadpoolctl import threadpool_limits
from gurobipy import GRB

# Limits the number of cores for numpy BLAS
threadpool_limits(limits = 1, user_api = 'blas')

# Set total number of threads for Gurobi to
__gurobi_threads = 1

try:
    # Define the coefficients to run sensitivity analysis
    capacity_coefficients = np.linspace(1, 10, num=32)

    # Assign a based on command line input - default is 0
    if len(sys.argv) > 1 and int(sys.argv[1]) < 31:
        a = capacity_coefficients[int(sys.argv[1])]
    else:
        a = 0

    # Create a new model
    m = gp.Model("matrix1")

    # Set the total number of Gurobi threads for model "m"
    m.Params.threads = __gurobi_threads

    # Create variables
    x = m.addMVar(shape=3, vtype=GRB.BINARY, name="x")

    # Set objective
    obj = np.array([1.0, 1.0, 2.0])
    m.setObjective(obj @ x, GRB.MAXIMIZE)

    # Build (sparse) constraint matrix
    data = np.array([1.0, 2.0, 3.0, -1.0, -1.0])
    row = np.array([0, 0, 0, 1, 1])
    col = np.array([0, 1, 2, 0, 1])

    A = sp.csr_matrix((data, (row, col)), shape=(2, 3))

    # Build rhs vector
    rhs = np.array([4.0 + a, -1.0])

    # Add constraints
    m.addConstr(A @ x <= rhs, name="c")

    # Optimize model
    m.optimize()

    print(f"Solved LP with a = {a}")
    print(f"Optimal Solution: {x.X}")
    print(f"Obj: {m.objVal}")

except gp.GurobiError as e:
    print(f"Error code {str(e.errno)}: {str(e)}")

except AttributeError:
    print(f"Encountered an attribute error")
```

This Python script can be run with `python gurobi_sensitivity.py` with no command line argument (`a` is set to 0 by default). However, we will run it via the scheduler on the Yen Slurm cluster.

Here is an example Slurm script, that loads `gurobipy3` module, activates `venv`, and runs `gurobi_sensitivity.py` script. Save this Slurm script to a file named `sensitivity_analysis.slurm`:

```bash linenums="1" title="sensitivity_analysis.slurm"
#!/bin/bash

# Example of running a single Gurobi run for sensitivity analysis

#SBATCH -J gurobi
#SBATCH -p normal
#SBATCH -c 1                     # one core per task
#SBATCH -t 1:00:00
##SBATCH --mem=1gb
#SBATCH -o gurobi-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Clean modules first
module purge

# Load software
module load gurobipy3

# Activate venv (can either be a global or relative path)
source /zfs/projects/<your-project>/opt_combined/bin/activate

# Run Python script
# With no command line argument: a = 0 in the script
python gurobi_sensitivity.py
```

You will need to modify the path to your `venv` enviroment as well as your email address. After that, you can submit the script to run with `sbatch sensitivity_analysis.slurm`

Next, we will modify this Slurm script to run as a job array. Each task in a job array will run the same Python script with a unique argument.

We will pass an index as a command line argument to the Python script, which performs sensitivity analysis. The Python script will set the value of `a` based on the corresponding array element. For example, if we run the Python script with the argument `5`, the script will assign the value corresponding to the 5th element in the user-defined capacity coefficient array.

We also want to ensure that we limit the threads to 1 in both `numpy` and `gurobi` since we will be launching one task per CPU core. The following lines in the Python script accomplish this:

```python linenums="8" title="gurobi_sensitivity.py"
# Limits the number of cores for numpy BLAS
threadpool_limits(limits = 1, user_api = 'blas')

# Set total number of threads for Gurobi to
__gurobi_threads = 1
```

Now, our Slurm script should look like below. Save this to `sensitivity_analysis_array.slurm`:

```bash linenums="1" hl_lines="26" title="sensitivity_analysis_array.slurm"

#!/bin/bash

# Example of running a job array to run Gurobi python script for sensitivity analysis.

#SBATCH --array=0-31        # there is a max array size - 512 tasks
#SBATCH -J gurobi
#SBATCH -p normal
#SBATCH -c 1                # one core per task
#SBATCH -t 1:00:00
##SBATCH --mem=1gb
#SBATCH -o gurobi-%A-%a.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Clean modules first
module purge

# Load software
module load gurobipy3

# Activate venv (can either be a global or relative path)
source /zfs/projects/<your-project>/opt_combined/bin/activate

# Run Python script with a command line arg from --array option
# It will be an input index from 0 to 31
python gurobi_sensitivity.py $SLURM_ARRAY_TASK_ID
```

Again, you will have to modify the script to use your `venv` environment and your email.

Note that in this case, we specify Slurm option `#SBATCH --array=0-31` to run 32 tasks in parallel. The maximum job array index is 511 (`--array=0-511`) on Yen Slurm. All tasks will be launched as independent jobs. There is a limit of 512 concurrent jobs per user that could be running at the same time. Each task will generate a unique log file `gurobi-%A-%a.out` where `%A` will be the unique job ID and `%a` will be the unique task ID (from 0 to 31).

You can see the limits for the `normal` partition with:

```bash title="Terminal Input"
sacctmgr show qos normal
```
Look for values in `MaxSubmitPU` and `MaxJobsPU` columns which list the maximum number of jobs allowed to be submitted by a user and the maximum number of jobs that can be running at the same time, respectively.

After modifying the path to your `venv` environment, submit the `sensitivity_analysis_array.slurm` script to the scheduler to run the job array on the cluster. It will launch all 32 tasks at the same time (some might sit in the queue while others are going to run right away). To submit, run:

```title="Terminal Command"
sbatch sensitivity_analysis_array.slurm
```

Monitor your jobs with `watch squeue -u $USER` where `$USER` is your SUNet ID. Identify any failed job array tasks and rerun them by setting `--array=` to include only the failed indices.

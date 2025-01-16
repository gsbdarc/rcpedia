
# Parallel Processing in Python

## Common Python Libraries (`numpy`, `sklearn`, `pytorch`, etc...)
Some Python libraries will parallelize tasks for you. A few of these libraries include `numpy`, `sklearn`, and `pytorch`. If you are working on a shared system like the Yens, you may want to limit the amount of cores these packages can use. The following code should work for the packages listed above:

```python title="Python Code"
import os
os.environ["OMP_NUM_THREADS"] = "6" 
os.environ["OPENBLAS_NUM_THREADS"] = "6" 
os.environ["MKL_NUM_THREADS"] = "6" 
os.environ["VECLIB_MAXIMUM_THREADS"] = "6" 
os.environ["NUMEXPR_NUM_THREADS"] = "6" 

import numpy as np
import sklearn
import torch
```

Note that the core count is set *before* importing the packages.

## Using the `multiprocessing` library
This library has several methods to help you parallelize your code.  The most common example is using the `Pool` object.  In general, the `Pool` object works by applying a processing function you've created to a number of items you need processed. Take the following example:

```python title="Python Code"
from multiprocessing import Pool

def f(x):
    return x*x

data = [1,2,3,4]
with Pool(5) as p:
    results  = p.map(f, data)
```
This code will open a `Pool` of 5 processes, and execute the function `f` over every item in `data` in parallel.

If you've got a directory full of files you need to process, this library can be very helpful.  Look at this example:

```python title="Python Code"
import multiprocessing
import os

def process_file(input_file, output_file):
	#read file...
	#Process it...	
	#Write processed file...

input_file_dir = '/path/to/input/files/'
output_file_dir = '/path/to/output/'

input_files = [input_file_dir+filename for filename in os.listdir(input_file_dir)]
output_files = [output_file_dir+filename for filename in os.listdir(input_file_dir)]

with Pool(5) as p:
    results = p.map(process_file, zip(input_files,output_files))
```

!!! tip
    You can check your processes and their core usage on the Yens using `htop`! See [this page](/_user_guide/best_practices_monitor_usage/){:target="_blank"} for more information on monitoring your resource usage.

## Example
We will use `numpy` and `multiprocessing` packages to do a giant matrix inversion (which will
take a long time to run so we have time to monitor our CPU utilization).

Here is a python script (save it as `matrix_invert.py`):

```python title="Python Code"
import os

# set number of CPUs to run on
ncore = "1"

# set env variables
# have to set these before importing numpy
os.environ["OMP_NUM_THREADS"] = ncore
os.environ["OPENBLAS_NUM_THREADS"] = ncore
os.environ["MKL_NUM_THREADS"] = ncore
os.environ["VECLIB_MAXIMUM_THREADS"] = ncore
os.environ["NUMEXPR_NUM_THREADS"] = ncore

import numpy as np
from multiprocessing import Pool
def f(x):
    ''' 
    Function that inverts a big random matrix
    '''
    np.linalg.inv(np.random.rand(10000, 10000))

# data is a list from 0 to 99
data = list(range(100))

# parallel region
# set a number of processes to use ncore each
with Pool(6) as p:
    results  = p.map(f, data)
```

In the above script, we are setting a few environment variables to limit the number of cores that `numpy` wants to use. In this case, we are setting the number of cores to 1. Then using `multiprocessing` package, we can create a parallel region in our code with the `Pool` object which will run a function `f` in parallel 100 times (for each of 100 elements in the `data` list). 

On the yens, before we start running the script, let's log into a second terminal window so we can monitor our CPU usage. Remember to login to the same yen machine! Check which yen you are on in terminal 1 by typing `hostname` then `ssh` to the same yen in terminal 2. For example, running `hostname` might output:

```{.yaml .no-copy title="Terminal Output"}
yen4
```
I am logged in to yen4 in my terminal window, so I will connect to the same yen in the second one:

```title="Terminal Command"
ssh $USER@yen4.stanford.edu
```
Enter your password and authenticate with Duo. We will be running `htop` in this terminal to see how many
cores our program is claiming as we change the parameters in the python script.

Run:
```title="Terminal Command"
htop -u $USER
```
where `$USER` is your SUNet ID. 

You should see something like:

![](/assets/images/htop-no-processes.png)

No python processes are running yet. 

Back in terminal one, let's start the Python program and watch what happens to CPU usage with `htop` in terminal 2:

```title="Terminal Command"
python3 matrix_invert.py
```

Now you should see 6 python processes running with each CPU utilized close to 100%.

![](/assets/images/htop-6-python-processes.png)

Those 6 processes come from `p.map()` command where `p` is the `Pool` of processes created with 6 CPU's.
The environment variable set 1 core for each of the spawned processes so we end up with 6 CPU cores being efficiently utilized but not overloaded. 

#### CPU overloading with `multiprocessing`
It is easy to overload the CPU utilization and exceed 100% which will have a negative impact on performance of your code. If we were to change `ncore` parameter to say 6 and leave `Pool` as 6, we will end up overloading the 6 cores (spawning 6 processes with 6 cores each). 

Let's update the `ncore` to 6 in the python script, then for each process in the pool we will use 6 cores:

```python title="Python Code"
import os

# set number of CPUs to run on
ncore = "6"

# set env variables
# have to set these before importing numpy
os.environ["OMP_NUM_THREADS"] = ncore
os.environ["OPENBLAS_NUM_THREADS"] = ncore
os.environ["MKL_NUM_THREADS"] = ncore
os.environ["VECLIB_MAXIMUM_THREADS"] = ncore
os.environ["NUMEXPR_NUM_THREADS"] = ncore

import numpy as np
from multiprocessing import Pool
def f(x):
    ''' 
    Function that inverts a big random matrix
    '''
    np.linalg.inv(np.random.rand(10000, 10000))

# data is a list from 0 to 99
data = list(range(100))

# parallel region
# set a number of processes to use ncore each
with Pool(6) as p:
    results  = p.map(f, data)
```

After the update, rerun the python script:

```title="Terminal Command"
python3 matrix_invert.py
``` 

and watch `htop` in the other terminal and you should see something like:

![](/assets/images/htop-overload-cpus.png)

There are 36 python processes spawned and CPU utilization exceeds 100% which the user would want to avoid. 

!!! note
    Another way to limit the script to 6 cores but utilize them effiently is to set `ncore` to 6 but limit `Pool` to 1. You can think of Pool as setting the number of different processes with multiple CPU *cores* per process.

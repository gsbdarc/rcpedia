# Sherlock

![Sherlock Logo on a Narwhal](/assets/images/sherlock_narwhal_small.png){ align=right }

[Sherlock](https://www.sherlock.stanford.edu/) is a high-performance computing (HPC) cluster available for research at Stanford and operated by [Stanford Research Computing](https://srcc.stanford.edu){:target="_blank"}. Sherlock has over 1,700 compute nodes with 57,000+ CPU cores. It is divided into several logical partitions that are either accessble for everyone to use (`normal`) or provisioned specifically for a specific group.

#### Condo Model
Stanford Research Computing provides faculty with the opportunity to purchase from a catalog a recommended compute node configurations, for the use of their research teams. Using a traditional compute cluster "condo" model, participating faculty and their teams get priority access to the resources they purchase. When those resources are idle, other "owners" can use them, until the purchasing owner wants to use them. When this happens, those other owners jobs are re-queued to free up resources. Participating owner PIs also have shared access to the original base Sherlock nodes, along with everyone else.

### Sherlock and Yen

Sherlock and Yen are entirely separate systems -- this means:

* You cannot submit jobs from Yen to Sherlock or vice versa
* Data stored on Yen cannot be accessed from Sherlock, or vice versa
* Sherlock and Yen have different funding models, administrator teams and policies

Sherlock is exclusively a  _batch_  submission environment like [FarmShare](https://srcc.stanford.edu/farmshare) and [Yen-Slurm](/_user_guide/slurm/), not an _interactive_ computing environment like the [interactive yens](/_getting_started/yen-servers/). That is,  **you can't just log in and run intensive tasks**. To compute on Sherlock, you have to prepare and submit a <a href="/_user_guide/slurm/" target="_blank">slurm</a> job script that describes the CPU, memory (RAM), and time resources you require, as well as the code to run. A scheduler puts your requests in queue until the resources can be allocated.

Both Yen and Sherlock are valuable resources, but Sherlock is significantly larger. Consider using Sherlock for:

-   Parameter Sweeps: you need to run the same code _many_ times, but with different inputs
-   Large Compute: you need more CPU/memory resources than is "fair" to use at a time on the yens
-   Parallelization: you code in C/C++, and can use MPI for code parallelization across nodes
-   Deep Learning at Scale: your code uses a deep learning framework like Keras or PyTorch that needs more GPU resources than are available on the yens

Be advised that  **Sherlock isn't a magic bullet for getting a large amount of work done quickly**. Submitting work to Sherlock requires careful thought about how your analysis is organized to effectively be submitted and run, and you may end up waiting in queue for your resources to become available. DARC can help you evaluate your options and plan for success.


### Getting a Sherlock Account

!!! note
    If you are a faculty member at the GSB and are interested in using Sherlock, please [let DARC know](mailto:gsb_darcresearch@stanford.edu)!

For GSB faculty members, SRC can provision a Sherlock account with a PI group that will give access to the `gsb` partition. If you are a PhD student, you will need to have a faculty member on Sherlock who can add you to their PI group.

### Logging In

```title="Terminal Command"
ssh <$USER>sherlock.stanford.edu
```

Enter your SUNet ID and Duo authenticate to login.

!!! tip
    You'll be logged on to a **login node**, which has limited resources, and is not designed for running jobs.

You can also login using the web-based <a href="https://ondemand.sherlock.stanford.edu">Open OnDemand</a> environment.

Sherlock uses <a href="_user_guide/slurm/" target="_blank">Slurm</a> to schedule jobs and manage the queue of pending jobs. We can use the standard slurm commands to get system information, and similar submission scripts to the ones used on [Yen-Slurm](/_user_guide/slurm/) to run jobs on Sherlock.

See the queue on the `normal` partition:

```title="Terminal Command"
squeue -p normal
```

To get information about partitions that are available to you, run
```title="Terminal Command"
sh_part
```




## GSB Sherlock Partition

The GSB has its own partition, `gsb`, which all GSB faculty PI groups can access. The `gsb` partition is currently comprised of three nodes:

| Sherlock Generation | Cores      | RAM      |
| ------------- | ------------- | ------------- |
| 2 | 20 | 128GB |
| 3 | 128 | 1TB |
| 3 | 128 | 1TB |

Note that to submit jobs to this partition, you will need to specifically reference **`gsb`** in your Slurm submit script:

```bash linenums="1" hl_lines="4-4" title="hello.slurm"
#!/bin/bash
#
#SBATCH --job-name=test
#SBATCH -p normal,gsb

echo "hello"
```


## Examples

### Python Example 

The python script `hello.py` is a simple hello world script that prints hello and hostname of the node where 
it is running then sleeps for 30 seconds. 

```py linenums="1" title="hello.py"
import socket
import time

# print hostname of the node
print('Hello from {} node').format(socket.gethostname())
time.sleep(30)
```

We can use the following slurm script, `hello.slurm`, that will submit the above python script and use any of the three partitions that I have permission to submit to:

```bash linenums="1" title="hello.slurm"
#!/bin/bash

# Example of running python script 

#SBATCH -J hello
#SBATCH -p normal,gsb,dev
#SBATCH -c 1                            # one CPU core 
#SBATCH -t 5:00
#SBATCH -o hello-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software
module load python/3.6.1

# Run python script 
python hello.py 
```

Submit with:

```title="Terminal Command"
sbatch hello.slurm
```

Monitor the queue:

```title="Terminal Command"
watch squeue -u $USER
```

You might see job's status as `CF` (configuring) when the job starts and `CG` (completing) when the job finishes.

Once the job is finished, look at the output:

```title="Terminal Command"
cat hello-$JOBID.out
```

You should see a similar output:

```{ .yaml .no-copy }
Hello from sh02-05n71.int node
```

### Large Job Array Example

Now, we want to run a large job array. First, let's check user job limits for the `normal` partition with:

```title="Terminal Command"
sacctmgr show qos normal
```

to find that `MaxTRESPU` limit is 512 CPUs max so we will need to limit our job array to 512 CPU cores.

We can modify the hello world python script and call it `hello-task.py` to also print a job task ID. 

```python linenums="1" title="hello-task.py"
import sys
import socket
import time

# print task number and hostname of the node
print('Hello! I am a task number {} on {} node').format(sys.argv[1], socket.gethostname())
time.sleep(30)
```

We use the following slurm script, `hello-job-array.slurm`, that will submit 512 job array tasks and use either `normal` or the `gsb` partition where I have permission to submit to:

```bash linenums="1" hl_lines="7" title="hello-job-array.slurm"
#!/bin/bash

# Example of running python script with a job array

#SBATCH -J hello
#SBATCH -p normal,gsb
#SBATCH --array=1-512                    # how many tasks in the array
#SBATCH -c 1                             # one CPU core per task
#SBATCH -t 5:00
#SBATCH -o out/hello-%A-%a.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software
module load python/3.6.1

# Run python script with a command line argument
python hello-task.py $SLURM_ARRAY_TASK_ID
```

Submit with:

```title="Terminal Input"
sbatch hello-job-array.slurm
```


Monitor the queue:

```title="Terminal Input"
watch squeue -u $USER
```

### Deep learning on GPU

Sherlock also has over 800+ GPUs that we can take advantage of when training machine learning / deep learning models. 

This is an abbreviated version of <a href="/topicGuides/runGPU.html" target="_blank">this topic guide</a> that also talks about how to setup your conda environment on Sherlock to be able to run the Keras example below, training a simple MNIST convnet.

```python linenums="1" title="mnist.py"
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

# Model / data parameters
num_classes = 10
input_shape = (28, 28, 1)

# the data, split between train and test sets
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

# Scale images to the [0, 1] range
x_train = x_train.astype("float32") / 255
x_test = x_test.astype("float32") / 255
# Make sure images have shape (28, 28, 1)
x_train = np.expand_dims(x_train, -1)
x_test = np.expand_dims(x_test, -1)
print("x_train shape:", x_train.shape)
print(x_train.shape[0], "train samples")
print(x_test.shape[0], "test samples")


# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

# build the model
model = keras.Sequential(
    [
        keras.Input(shape=input_shape),
        layers.Conv2D(32, kernel_size=(3, 3), activation="relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Conv2D(64, kernel_size=(3, 3), activation="relu"),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Flatten(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation="softmax"),
    ]
)

print(model.summary())

# train the model
batch_size = 128
epochs = 15

model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

model.fit(x_train, y_train, batch_size=batch_size, epochs=epochs, validation_split=0.1)

# evaluate the trained model
score = model.evaluate(x_test, y_test, verbose=0)
print("Test loss:", score[0])
print("Test accuracy:", score[1])
```

```bash linenums="1" hl_lines="6" title="keras-gpu.slurm"
#!/bin/bash

# Example slurm script to run keras DL models on Sherlock GPU

#SBATCH -J train-gpu
#SBATCH -p gpu(2)
#SBATCH -c 20
#SBATCH -N 1
#SBATCH -t 2:00:00
#SBATCH -G 1(1)
#SBATCH -o train-gpu-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# For safety, we deactivate any conda env that might be activated on interactive yens before submission and purge all loaded modules
source deactivate
module purge

# Load software (3)
ml py-tensorflow 

# Run python script
python3 mnist.py
```

1.  This script is asking for one GPU (`-G 1`)
2.  Running specifically on `gpu` partition
3.  See available modules on the [Sherlock Documentation](https://www.sherlock.stanford.edu/docs/software/list/)

Note that the `py-tensorflow` module on Sherlock contains the Python Tensorflow bindings. You may need to build your own virtual environment if you are incorporating other packages or need to refer to a specific software version.

Submit the job to the `gpu` partition with:

```title="Terminal Input"
sbatch keras-gpu.slurm
```

Monitor your job:

```title="Terminal Input"
squeue -u $USER
```

You should see something like:

```{ .yaml .no-select }
           JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
          20372833       gpu train-gp nrapstin  R       0:05      1 sh03-12n07
```

Once the job is running, connect to the node where your job is running to monitor GPU utilization:

```title="Terminal Input"
ssh sh03-12n07
```

Once you connect to the GPU node, load the cuda module there and monitor GPU utilization while the job is running:

```title="Terminal Input"
module load cuda/11.0.3
watch nvidia-smi
```

You should see that the GPU is being utilized (GPU-Util column):
```{ .yaml .no-select }
Every 2.0s: nvidia-smi                                                                                         
Tue Nov 15 13:43:04 2022
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 520.61.05    Driver Version: 520.61.05    CUDA Version: 11.8     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  On   | 00000000:C4:00.0 Off |                  N/A |
|  0%   44C    P2   114W / 260W |  10775MiB / 11264MiB |     40%   E. Process |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      4876	 C   python                          10772MiB |
+-----------------------------------------------------------------------------+
```

Once the job is done, look at the output file:

```title="Terminal Command"
cat train-gpu*.out
```

# Run jobs on Yen's GPU node 

## GPU Nodes Overview
The Yen-slurm has two GPU nodes, `yen-gpu1` node with 64 threads, 256 G of RAM and 4 A30 NVIDIA GPU's and `yen-gpu2` node with 64 threads, 256 G of RAM and 4 A40 NVIDIA GPU's.
The A30 NVIDIA GPU's have 24 G of GPU RAM while the A40 NVIDIA GPU's have 48 G of GPU RAM per GPU. 


## Login to Yens

Enter your SUNet ID and Duo authenticate to login.

```bash
$ ssh <$USER>@yen.stanford.edu
```

### Slurm GPU partition

The `yen-slurm` cluster now has a new `gpu` partition to run jobs on the GPU nodes. See its timelimit with:

```bash
$ sinfo -p gpu
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 1-00:00:00      2   idle yen-gpu[1-2]
```

{% include warning.html content="There is a limit of 1 day runtime and 2 GPU's per user."%}

## Python Example
This guide will detail how to run a short Python example using <a href="https://pytorch.org/" target="_blank">PyTorch</a> or
 <a href="https://keras.io/about/" target="_blank">Keras</a> for deep learning training. 
CUDA 11.7, PyTorch and Tensorflow/Keras are installed already so you do not have to install them yourself.

### PyTorch Example

To use `PyTorch`, you simple load the `pytorch` module which makes pytorch `venv` available and run the training example.

```bash
$ ml pytorch
```

When you load this module, you will be in a `venv` running Python 3.10 that has `pytorch` and other AI packages installed.

You can check with:

```bash
$ which python
/software/free/pytorch/2.0.1/bin/python

$ python --version
Python 3.10.12
```

List packages installed in pytorch `venv`:
```bash
$ pip list
Package                   Version
------------------------- ------------
accelerate                0.25.0
aiohttp                   3.9.1
aiosignal                 1.3.1
arrow                     1.3.0
asttokens                 2.4.1
async-timeout             4.0.3
attrs                     23.1.0
boto3                     1.33.8
botocore                  1.33.8
bravado                   11.0.3
bravado-core              6.1.0
certifi                   2023.11.17
charset-normalizer        3.3.2
click                     8.1.7
cmake                     3.27.9
comm                      0.2.0
contourpy                 1.2.0
cycler                    0.12.1
datasets                  2.15.0
debugpy                   1.8.0
decorator                 5.1.1
dill                      0.3.7
evaluate                  0.4.1
exceptiongroup            1.2.0
executing                 2.0.1
filelock                  3.13.1
fonttools                 4.46.0
fqdn                      1.5.1
frozenlist                1.4.0
fsspec                    2023.10.0
future                    0.18.3
gitdb                     4.0.11
GitPython                 3.1.40
huggingface-hub           0.19.4
idna                      3.6
ipykernel                 6.27.1
ipython                   8.18.1
isoduration               20.11.0
jedi                      0.19.1
Jinja2                    3.1.2
jmespath                  1.0.1
joblib                    1.3.2
jsonpointer               2.4
jsonref                   1.1.0
jsonschema                4.20.0
jsonschema-specifications 2023.11.2
jupyter_client            8.6.0
jupyter_core              5.5.0
kiwisolver                1.4.5
lightning-utilities       0.10.0
lit                       17.0.6
MarkupSafe                2.1.3
matplotlib                3.8.2
matplotlib-inline         0.1.6
monotonic                 1.6
mpmath                    1.3.0
msgpack                   1.0.7
multidict                 6.0.4
multiprocess              0.70.15
neptune                   1.8.6
nest-asyncio              1.5.8
networkx                  3.2.1
numpy                     1.26.2
nvidia-cublas-cu11        11.10.3.66
nvidia-cuda-cupti-cu11    11.7.101
nvidia-cuda-nvrtc-cu11    11.7.99
nvidia-cuda-runtime-cu11  11.7.99
nvidia-cudnn-cu11         8.5.0.96
nvidia-cufft-cu11         10.9.0.58
nvidia-curand-cu11        10.2.10.91
nvidia-cusolver-cu11      11.4.0.1
nvidia-cusparse-cu11      11.7.4.91
nvidia-nccl-cu11          2.14.3
nvidia-nvtx-cu11          11.7.91
oauthlib                  3.2.2
packaging                 23.2
pandas                    2.1.3
parso                     0.8.3
pexpect                   4.9.0
Pillow                    10.1.0
pip                       22.0.2
platformdirs              4.1.0
prompt-toolkit            3.0.41
psutil                    5.9.6
ptyprocess                0.7.0
pure-eval                 0.2.2
pyarrow                   14.0.1
pyarrow-hotfix            0.6
Pygments                  2.17.2
PyJWT                     2.8.0
pyparsing                 3.1.1
python-dateutil           2.8.2
pytorch-lightning         2.1.2
pytz                      2023.3.post1
PyYAML                    6.0.1
pyzmq                     25.1.2
referencing               0.31.1
regex                     2023.10.3
requests                  2.31.0
requests-oauthlib         1.3.1
responses                 0.18.0
rfc3339-validator         0.1.4
rfc3987                   1.3.8
rpds-py                   0.13.2
s3transfer                0.8.2
safetensors               0.4.1
scikit-learn              1.3.2
scipy                     1.11.4
setuptools                59.6.0
simplejson                3.19.2
six                       1.16.0
smmap                     5.0.1
stack-data                0.6.3
swagger-spec-validator    3.0.3
sympy                     1.12
threadpoolctl             3.2.0
tokenizers                0.15.0
torch                     2.0.1
torchmetrics              1.2.1
torchvision               0.15.2
tornado                   6.4
tqdm                      4.66.1
traitlets                 5.14.0
transformers              4.35.2
triton                    2.0.0
types-python-dateutil     2.8.19.14
typing_extensions         4.8.0
tzdata                    2023.3
uri-template              1.3.0
urllib3                   2.0.7
wcwidth                   0.2.12
webcolors                 1.13
websocket-client          1.7.0
wheel                     0.42.0
xformers                  0.0.22
xxhash                    3.4.1
yarl                      1.9.4
```

If you need additional packages installed, you can `pip install` them to your `~/.local` since this global pytorch `venv` 
is not user writable. 

### Copy Python script
This example uses the MNIST dataset for image classification, and consists of a simple fully connected neural network 
with one hidden layer. 

Save the following code to a new file called `mnist.py`.

```python
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.datasets as datasets
import torchvision.transforms as transforms

# Define the neural network architecture
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = x.view(-1, 784)
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# Load the MNIST dataset
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=transforms.ToTensor())
test_dataset = datasets.MNIST(root='./data', train=False, download=True, transform=transforms.ToTensor())

# Define the data loaders
train_loader = torch.utils.data.DataLoader(dataset=train_dataset, batch_size=100, shuffle=True)
test_loader = torch.utils.data.DataLoader(dataset=test_dataset, batch_size=100, shuffle=False)

# Define the neural network and move it to the GPU if available
net = Net()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
net.to(device)

# Define the loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(net.parameters(), lr=0.01, momentum=0.9)

# Train the neural network
for epoch in range(10):
    running_loss = 0.0
    for i, data in enumerate(train_loader, 0):
        inputs, labels = data
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = net(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print('[%d] loss: %.3f' % (epoch + 1, running_loss / len(train_loader)))

# Test the neural network
correct = 0
total = 0
with torch.no_grad():
    for data in test_loader:
        images, labels = data
        images, labels = images.to(device), labels.to(device)
        outputs = net(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print('Accuracy on the test set: %d %%' % (100 * correct / total))
```


### Submit Slurm script

The submission script `train-gpu.slurm` looks like:

```bash
#!/bin/bash

# Example slurm script to train pytorch DL model on Yen GPU

#SBATCH -J train-gpu
#SBATCH -p gpu
#SBATCH -c 20
#SBATCH -N 1
#SBATCH -t 1-             # limit of 1 day runtime
#SBATCH -G 1              # limit of 2 GPU's per user
#SBATCH -o train-gpu-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# load pytorch module 
ml pytorch

# run training script on GPU
python mnist.py
```

This script is asking for one GPU on the `gpu` partition and 20 CPU cores on GPU node for 1 day. 

Submit the job to the `gpu` partition with:

```bash
$ sbatch train-gpu.slurm
```

Monitor your job:

```bash
$ squeue -u $USER
```

You should see something like:

```bash
$ squeue -u nrapstin
            JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
            190526       gpu train-gp nrapstin  R       0:25      1 yen-gpu1
```

Once the job is running, connect to the node:

```bash
$ ssh yen-gpu1
```

Once you connect to the GPU node, monitor GPU utilization:

```bash
$ nvidia-smi
```

You should see that one of the four GPU's is being utilized (under GPU-Util column) and the process running on the GPU
is `python`:

```bash
Tue May  9 15:58:57 2023
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 530.30.02              Driver Version: 530.30.02    CUDA Version: 12.1     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                  Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf            Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA A30                      On | 00000000:17:00.0 Off |                    0 |
| N/A   34C    P0               33W / 165W|   1073MiB / 24576MiB |      3%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   1  NVIDIA A30                      On | 00000000:65:00.0 Off |                    0 |
| N/A   31C    P0               31W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   2  NVIDIA A30                      On | 00000000:CA:00.0 Off |                    0 |
| N/A   32C    P0               29W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   3  NVIDIA A30                      On | 00000000:E3:00.0 Off |                    0 |
| N/A   33C    P0               28W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   3927692      C   python                                     1070MiB |
+---------------------------------------------------------------------------------------+
```

Once the job is done, look at the output file:

```bash
$ cat train-gpu*.out
```

The output should look similar to:
```bash
[1] loss: 0.553
[2] loss: 0.265
[3] loss: 0.210
[4] loss: 0.175
[5] loss: 0.149
[6] loss: 0.129
[7] loss: 0.114
[8] loss: 0.101
[9] loss: 0.091
[10] loss: 0.083
Accuracy on the test set: 97 %
```


### Make PyTorch into a Jupyter Kernel

We can also add this environment to the interactive Yen's JupyterHub. Note that even though PyTorch will fall back to the CPU if GPU is not available,
deep learning and machine learning is much more efficient on GPU than CPU so you should not use the interactive yens for model training but
use the notebooks for visualization or other pre- or post-training tasks.

```bash
$ module purge
$ ml anaconda3
```

List all available kernels:
```bash
$ jupyter kernelspec list
``` 

Load `pytorch` module and make `venv` into a JupyterHub kernel:
```bash
$ ml pytorch
$ python -m ipykernel install --user --name pytorch201 --display-name 'PyTorch 2.0.1'
```

Launch <a href="/yen/webBasedCompute.html" target="_blank">JupyterHub</a> on the *same* interactive yen that you have 
loaded the `pytorch` module. You should see a new `PyTorch 2.0.1` Notebook kernel you can start up. 

{% include warning.html content="You have to load `pytorch` module in the terminal before you can launch the `PyTorch 2.0.1` kernel. If you do not load the module in the terminal, `torch` will not import in the notebook."%}

Once you start up the notebook, make sure you can import `torch` but CUDA is not available (since interactive yens do 
not have GPU's). 

![](/images/pytorch-kernel.png)


### Keras Example
To use `keras`, you simple load the `tensorflow` module and can run the training example.

```bash
$ ml tensorflow
$ source activate
```

When you load this module and activate the tensorflow conda environment, you will be in a base conda environment running Python 3.10.

You can check with:

```bash
$ conda info -e
base                     /software/free/tensorflow/2

$ python --version
Python 3.10.11
```

If you need additional packages installed, you can `pip install` them to your `~/.local` since this global conda environment
is not user writable. 

### Copy Python script
This example uses the MNIST dataset for image classification, and consists of a simple fully connected neural network 
with one hidden layer. 

Save the following code to a new file called `mnist-keras.py`.

```python
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

### Submit Slurm script

The submission script `train-gpu.slurm` looks like:

```bash
#!/bin/bash

# Example slurm script to train keras DL model on Yen GPU

#SBATCH -J train-gpu
#SBATCH -p gpu
#SBATCH -c 20
#SBATCH -N 1
#SBATCH -t 1-             # limit of 1 day runtime
#SBATCH -G 1              # limit of 2 GPU's per user
#SBATCH -o train-gpu-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# For safety, we deactivate any conda env that might be activated on interactive yens before submission and purge all loaded modules
source deactivate
module purge

# load tensorflow module 
ml tensorflow

# activate tensorflow conda env
source activate

# run training on GPU
python mnist-keras.py
```

This script is asking for one GPU on the `gpu` partition and 20 CPU cores on GPU node for 1 day. 

Submit the job to the `gpu` partition with:

```bash
$ sbatch train-gpu.slurm
```

Monitor your job:

```bash
$ squeue -u $USER
```

You should see something like:

```bash
$ squeue -u nrapstin
            JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
            190526       gpu train-gp nrapstin  R       0:25      1 yen-gpu1
```

Once the job is running, connect to the node:

```bash
$ ssh yen-gpu1
```

Once you connect to the GPU node, monitor GPU utilization:

```bash
$ nvidia-smi
```

You should see that one of the four GPU's is being utilized (under GPU-Util column) and the process running on the GPU
is `python`:


```bash
Fri May 26 19:34:36 2023
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 530.30.02              Driver Version: 530.30.02    CUDA Version: 12.1     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                  Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf            Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA A30                      On | 00000000:17:00.0 Off |                    0 |
| N/A   35C    P0               39W / 165W|  23285MiB / 24576MiB |     23%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   1  NVIDIA A30                      On | 00000000:65:00.0 Off |                    0 |
| N/A   32C    P0               31W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   2  NVIDIA A30                      On | 00000000:CA:00.0 Off |                    0 |
| N/A   32C    P0               29W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+
|   3  NVIDIA A30                      On | 00000000:E3:00.0 Off |                    0 |
| N/A   33C    P0               29W / 165W|      0MiB / 24576MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A     57595      C   python                                    23282MiB |
+---------------------------------------------------------------------------------------+
```

Once the job is done, look at the output file:

```bash
$ cat train-gpu*.out
```

The output should look similar to:
```bash
...
Epoch 14/15
422/422 [==============================] - 2s 5ms/step - loss: 0.0361 - accuracy: 0.9882 - val_loss: 0.0297 - val_accuracy: 0.9920
Epoch 15/15
422/422 [==============================] - 2s 5ms/step - loss: 0.0336 - accuracy: 0.9891 - val_loss: 0.0274 - val_accuracy: 0.9922
Test loss: 0.02380027435719967
Test accuracy: 0.9922000169754028
```

### Make Tensorflow into a Jupyter Kernel

We can also add this environment to the interactive Yen's JupyterHub. Note that even though Keras will fall back to the CPU if GPU is not available,
deep learning and machine learning is much more efficient on GPU than CPU so you should not use the interactive yens for model training but
use the notebooks for visualization or other pre- or post-training tasks.

You may also need to install `ipykernel` module first:

```bash
$ module load tensorflow
$ source activate
$ python -m ipykernel install --user --name tf2 --display-name 'Tensorflow 2.11'
```

Launch <a href="/yen/webBasedCompute.html" target="_blank">JupyterHub</a> on the *same* interactive yen that you have 
loaded the `tensorflow` module. You should see a new `Tensorflow 2.11` Notebook kernel you can start up. 

{% include warning.html content="You have to load `tensorflow` module in the terminal before you can launch the `Tensorflow 2.11` kernel. If you do not load the module in the terminal, `tensorflow` will not import in the notebook."%}

Once you start up the notebook, make sure you can import `tensorflow` but CUDA is not available (since interactive yens do 
not have GPU's). 

![](/images/tf-kernel.png)
---
<a href="/training/10_job_array.html"><span class="glyphicon glyphicon-menu-left fa-lg" style="float: left;"/></a> <a href="/training/12_sherlock_hpc.html"><span class="glyphicon glyphicon-menu-right fa-lg" style="float: right;"/></a>

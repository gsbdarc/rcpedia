---
date:
  created: 2024-03-28
categories:
    - Machine Learning
    - GPU
authors:
    - mason
---

# Train machine learning models on GPU


If you are running machine learning / deep learning algorithms, you might benefit from running them 
on the GPU. Currently, the Yens have <a href="/topicGuides/yenGPU.html" target="_blank">two GPU nodes</a> with 8 GPU's but there are other GPU resources that are available for Stanford research computing community as well. 

<!-- more -->

## Sherlock HPC 
Sherlock also has over 700+ GPUs that we can take advantage of when training machine learning / deep learning models. See <a href="/services/sherlock.html" target="_blank">this page</a> for getting started using Sherlock. 

Login to <a href="https://www.sherlock.stanford.edu/docs/overview/introduction/" target="_blank">Sherlock HPC</a> system:

```bash
ssh <$USER>@sherlock.stanford.edu
```
Enter your SUNet ID and Duo authenticate to login.

#### Install miniconda

To install miniconda in `/oak/stanford/projects/<your-lab>/<$USER>/miniconda`, use this shell script. 
You can save this file to your **home** directory and call it `install_miniconda.sh` for example. 
When you run the script from your home directory, it will ask to provide a path where to install miniconda. 
Make sure to paste your **oak path** instead of default home installation (for example, `/oak/stanford/projects/<your-lab>/<$USER>/miniconda`). 
We want to avoid making a bunch of conda environments in home because with machine learning / data science / deep learning packages 
it is possible to run out of space just by making a few conda environments, so use Oak or other path where you have large amounts of space:

```bash
#!/bin/sh

wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

chmod +x Miniconda3-latest-Linux-x86_64.sh

./Miniconda3-latest-Linux-x86_64.sh

conda config --set auto_activate_base false
```

See <a href="https://uit.stanford.edu/service/oak-storage/" target="_blank">this page</a> to learn more about Oak and to purchase space for your lab. 

To run the script from home,

```bash
sh install_miniconda.sh
```

After miniconda is installed, add path to conda bin to your bash profile so that `conda` and `python` executables are found:

```bash
# add path to miniconda
export PATH=$PATH:/oak/stanford/projects/<your-lab>/<$USER>/miniconda3/bin
```
Source bash profile to apply changes:

```bash
source ~/.bash_profile
```

#### Create conda env

To install deep learning python packages to work on GPU, we need to have CUDA loaded.
Load cuda module:

```
module load cuda/11.0.3
```

Make sure `conda` is found and is the one that you want:

```
which conda
```

should return:

```
/oak/stanford/projects/<your-lab>/<$USER>/miniconda3/bin/conda
```

Create a new conda env and install with `conda`. Note that `pip` and `conda` do not play nice in this case and 
we will stick to using only `conda` to properly manage the packages.

```bash
conda create -n tf-gpu python=3.8
source activate tf-gpu
conda install tensorflow-gpu keras pandas scikit-learn
```

**Note:** `pip` does not properly manage keras and tensorflow GPU based packages. So, we have to use `conda install` 
instead to install GPU based packages that we want.

Then we can activate this conda env in the slurm submission script.

## Keras example

We will run this python script on the Sherlock GPU to train a simple MNIST convnet. Save the following to `mnist.py`

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

#### Run slurm script

The submission script `keras-gpu.slurm` looks like:

```bash
#!/bin/bash

# Example slurm script to run keras DL models on Sherlock GPU

#SBATCH -J train-gpu
#SBATCH -p gpu
#SBATCH -c 20
#SBATCH -N 1
#SBATCH -t 1-
#SBATCH -G 1
#SBATCH -o train-gpu-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

source $HOME/.bash_profile
module load cuda/11.0.3
source activate tf-gpu

python mnist.py
```

This script is asking for one GPU on `gpu` partition and 20 CPU cores on one node for 1 day. 

Submit the job to the `gpu` partition with:

```bash
sbatch keras-gpu.slurm
```

Monitor your job:

```
squeue -u $USER
```

You should see something like:

```bash
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
          20372833       gpu train-gp nrapstin  R       0:05      1 sh03-12n07
```

Once the job is running, connect to the node and monitor your GPU utilization:

```
ssh sh03-12n07
```

Once you connect to the GPU node, load the cuda module there and monitor GPU utilization while the job is running:

```
module load cuda/11.0.3
watch nvidia-smi
```

You should see that the GPU is being utilized (under GPU-Util column):
```
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
|    0   N/A  N/A      4876      C   python                          10772MiB |
+-----------------------------------------------------------------------------+
```

Once the job is done, look at the output file:

```bash
cat train-gpu*.out
```

The output should look similar to:

```bash
/etc/profile.d/z99_srcc.sh: line 183: SHERLOCK: readonly variable
/etc/profile.d/z99_srcc.sh: line 319: PI_SCRATCH: readonly variable
2021-03-15 11:52:52.231386: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudart.so.10.1
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
11493376/11490434 [==============================] - 0s 0us/step
2021-03-15 12:08:05.866384: I tensorflow/compiler/jit/xla_cpu_device.cc:41] Not creating XLA devices, tf_xla_enable_xla_devices not set
2021-03-15 12:08:05.907107: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcuda.so.1
2021-03-15 12:08:06.000808: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1720] Found device 0 with properties:
pciBusID: 0000:c4:00.0 name: GeForce RTX 2080 Ti computeCapability: 7.5
coreClock: 1.62GHz coreCount: 68 deviceMemorySize: 10.76GiB deviceMemoryBandwidth: 573.69GiB/s
2021-03-15 12:08:06.000917: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudart.so.10.1
2021-03-15 12:08:08.793249: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcublas.so.10
2021-03-15 12:08:08.793435: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcublasLt.so.10
2021-03-15 12:08:12.168920: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcufft.so.10
2021-03-15 12:08:12.517624: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcurand.so.10
2021-03-15 12:08:13.562000: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcusolver.so.10
2021-03-15 12:08:13.966972: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcusparse.so.10
2021-03-15 12:08:16.409172: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudnn.so.7
2021-03-15 12:08:16.412824: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1862] Adding visible gpu devices: 0
2021-03-15 12:08:16.430127: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations:  SSE4.1 SSE4.2 AVX AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
2021-03-15 12:08:16.433601: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1720] Found device 0 with properties:
pciBusID: 0000:c4:00.0 name: GeForce RTX 2080 Ti computeCapability: 7.5
coreClock: 1.62GHz coreCount: 68 deviceMemorySize: 10.76GiB deviceMemoryBandwidth: 573.69GiB/s
2021-03-15 12:08:16.433698: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudart.so.10.1
2021-03-15 12:08:16.433743: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcublas.so.10
2021-03-15 12:08:16.433772: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcublasLt.so.10
2021-03-15 12:08:16.433799: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcufft.so.10
2021-03-15 12:08:16.433826: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcurand.so.10
2021-03-15 12:08:16.433875: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcusolver.so.10
2021-03-15 12:08:16.433904: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcusparse.so.10
2021-03-15 12:08:16.433931: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudnn.so.7
2021-03-15 12:08:16.437218: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1862] Adding visible gpu devices: 0
2021-03-15 12:08:16.437288: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudart.so.10.1
2021-03-15 12:08:22.623609: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1261] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-03-15 12:08:22.623693: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1267]      0
2021-03-15 12:08:22.623711: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1280] 0:   N
2021-03-15 12:08:22.626838: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1406] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 10073 MB memory) -> physical GPU (device: 0, name: GeForce RTX 2080 Ti, pci bus id: 0000:c4:00.0, compute capability: 7.5)
2021-03-15 12:08:22.668291: I tensorflow/compiler/jit/xla_gpu_device.cc:99] Not creating XLA devices, tf_xla_enable_xla_devices not set
2021-03-15 12:08:23.407609: I tensorflow/compiler/mlir/mlir_graph_optimization_pass.cc:116] None of the MLIR optimization passes are enabled (registered 2)
2021-03-15 12:08:23.531488: I tensorflow/core/platform/profile_utils/cpu_utils.cc:112] CPU Frequency: 2500025000 Hz
2021-03-15 12:08:24.419584: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcublas.so.10
2021-03-15 12:08:25.272119: I tensorflow/stream_executor/platform/default/dso_loader.cc:49] Successfully opened dynamic library libcudnn.so.7
x_train shape: (60000, 28, 28, 1)
60000 train samples
10000 test samples
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
conv2d (Conv2D)              (None, 26, 26, 32)        320
_________________________________________________________________
max_pooling2d (MaxPooling2D) (None, 13, 13, 32)        0
_________________________________________________________________
conv2d_1 (Conv2D)            (None, 11, 11, 64)        18496
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 5, 5, 64)          0
_________________________________________________________________
flatten (Flatten)            (None, 1600)              0
_________________________________________________________________
dropout (Dropout)            (None, 1600)              0
_________________________________________________________________
dense (Dense)                (None, 10)                16010
=================================================================
Total params: 34,826
Trainable params: 34,826
Non-trainable params: 0
_________________________________________________________________
None
Epoch 1/15
422/422 [==============================] - 6s 5ms/step - loss: 0.7651 - accuracy: 0.7647 - val_loss: 0.0860 - val_accuracy: 0.9765
Epoch 2/15
422/422 [==============================] - 1s 2ms/step - loss: 0.1198 - accuracy: 0.9634 - val_loss: 0.0576 - val_accuracy: 0.9842
Epoch 3/15
422/422 [==============================] - 1s 2ms/step - loss: 0.0892 - accuracy: 0.9728 - val_loss: 0.0464 - val_accuracy: 0.9875
Epoch 4/15
422/422 [==============================] - 1s 2ms/step - loss: 0.0716 - accuracy: 0.9773 - val_loss: 0.0420 - val_accuracy: 0.9878
Epoch 5/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0609 - accuracy: 0.9815 - val_loss: 0.0380 - val_accuracy: 0.9903
Epoch 6/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0585 - accuracy: 0.9819 - val_loss: 0.0390 - val_accuracy: 0.9888
Epoch 7/15
422/422 [==============================] - 1s 2ms/step - loss: 0.0474 - accuracy: 0.9853 - val_loss: 0.0394 - val_accuracy: 0.9885
Epoch 8/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0493 - accuracy: 0.9850 - val_loss: 0.0334 - val_accuracy: 0.9907
Epoch 9/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0417 - accuracy: 0.9870 - val_loss: 0.0322 - val_accuracy: 0.9912
Epoch 10/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0364 - accuracy: 0.9883 - val_loss: 0.0318 - val_accuracy: 0.9918
Epoch 11/15
422/422 [==============================] - 1s 2ms/step - loss: 0.0396 - accuracy: 0.9883 - val_loss: 0.0297 - val_accuracy: 0.9913
Epoch 12/15
422/422 [==============================] - 1s 2ms/step - loss: 0.0372 - accuracy: 0.9881 - val_loss: 0.0284 - val_accuracy: 0.9910
Epoch 13/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0344 - accuracy: 0.9891 - val_loss: 0.0305 - val_accuracy: 0.9913
Epoch 14/15
422/422 [==============================] - 3s 7ms/step - loss: 0.0324 - accuracy: 0.9896 - val_loss: 0.0284 - val_accuracy: 0.9910
Epoch 15/15
422/422 [==============================] - 1s 3ms/step - loss: 0.0299 - accuracy: 0.9899 - val_loss: 0.0277 - val_accuracy: 0.9923
Test loss: 0.02463490329682827
Test accuracy: 0.9919000267982483
```

If you see errors and warnings related to GPU and cuda libraries not found, it is likely that the keras and tensorflow did not install correctly.
 Make sure you load the cuda module then try to remove and reinstall the conda environment. 
 
## Google Colab
Google Colab lets you run Jupyter notebooks in the cloud on CPU or adding GPU and TPU accelerators.
We will use a free Colab tier but if you need more time or specific hardware, paid Colab pro may be a good option.

Navigate to <a href="https://colab.research.google.com/notebooks/gpu.ipynb" target="_blank">Colab website</a> and check out an example Jupyter 
notebook that uses a GPU for machine learning training.

An advantage of using Colab is that common machine learning packages like `keras`, `tensorflow` and `xgboost` are already installed with GPU support
 so there is no python environment setup that is needed on premise systems like Sherlock.
 
Colab connects to your Google Drive so you will to upload your data and Jupyter notebooks to Google Drive to open them
in Colab environment. Once your notebook is in your Google Drive, right click on it and select `Open with` option then select `Google Colaboratory`. 
If you do not see `Google Colaboratory` in drop-down, you can connect to it (do this once and Colab should be aviable in the future). 

#### Switch to using a GPU

After the notebook is open in Colab, it will be executed on the CPU by default. So, first we need to select an accelerator 
if we want to run code on the GPU/TPU.

Go to `Edit` -> `Notebook settings`. Then select GPU from the drop-down menu.

That's it! The notebook can now run on GPU. You can run the code there for up to 12 hours. If the notebook is inactive, it will be disconnected from Colab. But you can simply reconnect to it if that happens.

#### Put data on Google Drive

Google Colab is connected to Google Drive thus all of the data and Jupyter notebooks will need to be uploaded onto Google Drive.

For example, if I put my data into my Google Drive under new directory called `projects`, then I copy my data inside this `project` directory in a subdirecotry called `data`, 
so that I can reference the data inside the colab notebooks like so:

```python
path_to_data = 'drive/MyDrive/projects/data'
```

#### Run the notebook
Now we are ready to run the notebook cell by cell. Make sure the **paths** where you are saving the outputs and reading in data are set correctly.

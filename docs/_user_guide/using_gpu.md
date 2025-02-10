# Run Jobs on the GPU Partition

## GPU Partition Overview
[Yen Slurm](/_user_guide/slurm/){:target="_blank"} has three GPU nodes: 

- `yen-gpu1` has 64 threads, 256 G of RAM and 4 A30 NVIDIA GPU's
- `yen-gpu2` and `yen-gpu3` each have 64 threads, 256 G of RAM and 4 A40 NVIDIA GPU's

The A30 NVIDIA GPU's have 24 G of GPU RAM while the A40 NVIDIA GPU's have 48 G of GPU RAM.

### GPU Partition

To work with these GPU nodes on Yen Slurm, you can [submit jobs](/_user_guide/slurm/#how-do-i-use-the-scheduler){:target="_blank"} to the Slurm scheduler targeting the `gpu` partition. You can use the command `sinfo -p gpu` to get more information about this partition:

```{.yaml .no-copy title="Terminal Output"}
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 1-00:00:00      1    mix yen-gpu3
gpu          up 1-00:00:00      2   idle yen-gpu[1-2]
```

!!! warning "Job Time and GPU Limit"
    There is a limit of 1 day runtime and 4 GPU's per user.

## Usage Example with Python
This guide will detail how to run a short Python example using both [PyTorch](https://pytorch.org/){:target="_blank"} and [Keras](https://keras.io/about/){:target="_blank"} for deep learning training. CUDA, PyTorch and Tensorflow/Keras are installed already so you do not have to install them yourself.

### Loading Modules

To use either PyTorch or Keras, you can simply load the pre-installed module on the system.

=== "PyTorch"
    ```bash title="Terminal Command"
    ml pytorch
    ```
=== "Keras"
    ```bash title="Terminal Command"
    ml tensorflow
    source activate 
    ```

Once the chosen module is loaded, you will be in an environment running Python 3.10 that already includes the relevant packages installed.

### Create Python Script
This example uses the MNIST dataset for image classification, and consists of a simple fully connected neural network with one hidden layer. 

Save the following code to a new file called `mnist.py`:

=== "PyTorch"
    ```python title="mnist.py" linenums="1"
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
=== "Keras"
    ```python title="mnist.py" linenums="1"
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

### Submit Script to Yen Slurm

You can now write a Slurm submission script to run `mnist.py` on a GPU node on `yen-slurm`. An example submission script `train-gpu.slurm` looks like:

=== "PyTorch"
    ```slurm title="train-gpu.slurm"
    #!/bin/bash

    # Example slurm script to train pytorch DL model on Yen GPU

    #SBATCH -J train-gpu
    #SBATCH -p gpu
    #SBATCH -c 20
    #SBATCH -N 1
    #SBATCH -t 1-             # limit of 1 day runtime
    #SBATCH -G 1              # limit of 4 GPUs per user
    #SBATCH -o train-gpu-%j.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # load pytorch module
    ml pytorch

    # run training script on GPU
    python mnist.py
    ```
=== "Keras"
    ```slurm title="train-gpu.slurm"
    #!/bin/bash

    # Example slurm script to train keras DL model on Yen GPU

    #SBATCH -J train-gpu
    #SBATCH -p gpu
    #SBATCH -c 20
    #SBATCH -N 1
    #SBATCH -t 1-             # limit of 1 day runtime
    #SBATCH -G 1              # limit of 4 GPUs per user
    #SBATCH -o train-gpu-%j.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # For safety, we deactivate any conda env that might be activated on interactive yens before submission and purge all loaded modules
    source deactivate
    module purge

    # load tensorflow module 
    ml tensorflow

    # activate the tensorflow conda env
    source activate

    # run training on GPU
    python mnist.py
    ```

This script asks for one GPU on the `gpu` partition (`-p gpu`) and 20 CPU cores on the GPU node (`-c 20`) for 1 day (`-t 1-`). 

You can submit the job to the `gpu` partition with:

```bash title="Terminal Command"
sbatch train-gpu.slurm
```

Monitor your job:

```bash title="Terminal Command"
squeue -u $USER
```

You should see something like:

```{.yaml .no-copy title="Terminal Output"}
JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
190526       gpu train-gp    user  R       0:25      1 yen-gpu1
```

Once the job is running, you gain the ability to connect to the node that the job is running on:

```bash title="Terminal Command"
ssh yen-gpu1
```

Upon connecting to the GPU node, you can monitor GPU utilization:

```bash title="Terminal Command"
nvidia-smi
```

You should see that one of the four GPU's is being utilized (under `GPU-Util` column) and the process running on the GPU is `python`:

```{.yaml .no-copy title="Terminal Output"}
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

```bash title="Terminal Command"
cat train-gpu*.out
```

The output should look similar to:
=== "PyTorch"
    ```{.yaml .no-copy title="Terminal Output"}
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
=== "Keras"
    ```{.yaml .no-copy title="Terminal Output"}
    ...
    Epoch 14/15
    422/422 [==============================] - 2s 5ms/step - loss: 0.0361 - accuracy: 0.9882 - val_loss: 0.0297 - val_accuracy: 0.9920
    Epoch 15/15
    422/422 [==============================] - 2s 5ms/step - loss: 0.0336 - accuracy: 0.9891 - val_loss: 0.0274 - val_accuracy: 0.9922
    Test loss: 0.02380027435719967
    Test accuracy: 0.9922000169754028
    ```


### Make Module into a Jupyter Kernel

We can also add the PyTorch or Keras environment to the [interactive Yen's JupyterHub](/_getting_started/jupyter/){:target="_blank"}. Although each module will fall back to use CPU on JupyterHub since GPU is not available, you can still utilize JupyterHub notebooks for visualization and other pre-/post-training tasks. For model training and inference, it is better to utilize the GPU nodes on `yen-slurm`.

You can start by listing all of your available JupyterHub kernels:
```bash title="Terminal Command"
jupyter kernelspec list
```

To add the environment, load the module and then create a JupyterHub kernel from the `venv` using the following commands:
=== "PyTorch"
    ```bash title="Terminal Command"
    ml pytorch
    python -m ipykernel install --user --name pytorch212 --display-name 'PyTorch 2.1.2'
    ```
=== "Keras"
    ```bash title="Terminal Command"
    module load tensorflow
    source activate
    python -m ipykernel install --user --name tensorflow211 --display-name 'Tensorflow 2.11'
    ```

When you launch a new Python notebook, you should see the just created `PyTorch 2.1.2` or `Tensorflow 2.11` notebook kernel that you  can start up.

Once you start up the notebook, make sure you can import `torch` (for PyTorch) or `tensorflow` (for Keras). Note that CUDA is not available here since the interactive Yens do not have GPUs.

=== "PyTorch"
    ![PyTorch Kernel in JupyterHub](/assets/images/pytorch-kernel.png)
=== "Keras"
    ![Tensorflow Kernel in JupyterHub](/assets/images/tf-kernel.png)

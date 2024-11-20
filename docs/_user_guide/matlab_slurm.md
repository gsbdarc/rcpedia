## Matlab Example Slurm Script
The simplest Matlab script looks like:

```matlab title="Matlab Code"
disp('Hello world')
```

Save this line to a new file called `hello_world.m`. 

## Available Matlab versions on `Yen10`
Several version of Matlab are installed on the yens and the default version is designated with `(D)`:

```bash title="Terminal Command"
module avail matlab
```

Load the version you want:

```bash title="Terminal Command"
module load matlab
```

If you do not specify the version, `matlab/R2019b` will be loaded by default.

This one-liner script can be run with `matlab -nodesktop < hello_world.m`. 
However, we will run it via the Slurm scheduler on the `Yen10` server. 
Here is an example Slurm script that loads matlab module and runs the `hello_world.m` script.


```bash title="Terminal Command"
#!/bin/bash

# Hello world Matlab script with Slurm

#SBATCH -J hello
#SBATCH -p normal
#SBATCH -c 1                              # one core per task
#SBATCH -t 1:00:00
##SBATCH --mem=1gb
#SBATCH -o hello-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software (Matlab default is R2019b)
module load matlab

# Run hello world script
srun matlab -nodesktop < hello_world.m
```

**Note:** to use the scheduler, you prepend `matlab -nodesktop < hello_world.m` with `srun` command. 
Save this Slurm script to `hello.slurm`.
Then run it by submitting the job to the Slurm scheduler with:

```bash title="Terminal Command"
sbatch hello.slurm
```

Run `squeue` to monitor the queue of jobs.

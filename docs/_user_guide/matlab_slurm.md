The simplest Matlab script looks like:

```matlab title="hello_world.m"
disp('Hello world')
```

Save this line to a new file called `hello_world.m`. 

Several versions of Matlab are installed on the Yens and the default version is designated with `(D)`:

```bash title="Terminal Command"
module avail matlab
```

```{.yaml .no-copy title="Terminal Output"}
-------------------------------- Global Aliases --------------------------------


---------------------------- /software/modules/Core ----------------------------
   matlab/R2018a    matlab/R2019b    matlab/R2022a        matlab/R2024a
   matlab/R2018b    matlab/R2021b    matlab/R2022b (D)

  Where:
   D:  Default Module
```

Load the version you want:

```bash title="Terminal Command"
module load matlab/R2021b
```

If you do not specify the version (`module load matlab`), the version marked with `(D)` will be loaded by default.

This one-liner script can be run on the interactive Yens with `matlab -nodesktop < hello_world.m`. 
However, if you want to run it on the [Yen Slurm cluster](/_user_guide/slurm){:target="_blank"} via the scheduler, you must write a Slurm script.

Here is an example Slurm script that loads `matlab` module and runs the `hello_world.m` script.


```bash title="hello.slurm"
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

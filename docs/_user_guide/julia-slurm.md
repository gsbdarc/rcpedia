# Running Julia on Yen-Slurm 

## Single-threaded Julia on Yen-Slurm
Similar to running Julia interactively, we will load Julia module but run the script using Slurm scheduler so that the script is executed on the Yen-Slurm nodes.

```bash linenums="1"  title="hello.slurm"
#!/bin/bash

# Example of running a single Julia run

#SBATCH -J hello
#SBATCH -p normal
#SBATCH -c 1                              # one core per task
#SBATCH -t 1:00:00
#SBATCH -o hello-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software
module load julia

# Run Julia script
julia hello.jl
```
Then run it by submitting the job to the Slurm scheduler with:
```title="Terminal Command"
sbatch hello.slurm
```

## Multi-threaded Julia on Yen-Slurm
If you want to use multiple threads, set the number of cores and the environment variable to match it:
```bash linenums="1"  title="hello-multithreaded.slurm"
#!/bin/bash

# Example of running multithreaded Julia 

#SBATCH -J hello
#SBATCH -p normal
#SBATCH -c 16                              # use multiple cores 
#SBATCH -t 1:00:00
#SBATCH -o hello-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software
module load julia

# Set number of threads to use
export JULIA_NUM_THREADS=16

# Run Julia script
julia hello.jl
```

Then run it by submitting the job to the Slurm scheduler with:
```title="Terminal Command"
sbatch hello-multithreaded.slurm
```


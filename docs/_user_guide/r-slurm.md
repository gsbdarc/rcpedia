# Running R on Yen-Slurm 

Similar to running R interactively, we will load the R module but run the script using Slurm scheduler so that the script is executed on the Yen-Slurm nodes.

```bash linenums="1"  title="hello.slurm"
#!/bin/bash

# Example of running a single R run

#SBATCH -J hello
#SBATCH -p normal
#SBATCH -c 1                              # one core per task
#SBATCH -t 1:00:00
#SBATCH -o hello-%j.out
#SBATCH --mail-type=ALL
#SBATCH --mail-user=your_email@stanford.edu

# Load software
module load R

# Run R script
Rscript hello.R
```

Then run it by submitting the job to the Slurm scheduler with:
```title="Terminal Command"
sbatch hello.slurm
```

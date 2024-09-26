
# Slurm Job Array Examples

## Example Script

=== "R"
    ```R linenums="1" title="hello.R"
    print('Hello!')
    ```

    This one-liner script can be run with `Rscript hello.R`. 

=== "Python"
    ```py linenums="1" title="hello.py"
    print('Hello!')
    ```

    This one-liner script can be run with `python hello.py`. 

=== "Julia"
    ```julia linenums="1"  title="hello.jl"
    println("Hello!")
    ```

    This one-liner script can be run with `julia hello.jl`. 

=== "Matlab"
    ```matlab linenums="1"  title="hello.m"
    function hello()
        fprintf('Hello!');
    end
    ```    

However, we will run it via the Slurm scheduler on the yen-slurm cluster. 

=== "R"
    ```bash linenums="1" title="hello.slurm"
    #!/bin/bash

    # Example of running R script in a batch mode

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH -c 1                            # one CPU core
    #SBATCH -t 10:00
    #SBATCH -o hello-%j.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Load software
    module load R

    # Run R script
    Rscript hello.R
    ```

=== "Python"
    ```bash linenums="1" title="hello.slurm"   
    #!/bin/bash

    # Example of running python script in a batch mode

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH -c 1                            # one CPU core
    #SBATCH -t 10:00
    #SBATCH -o hello-%j.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Run python script
    python3 hello.py
    ```

=== "Julia"
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

=== "Matlab"
    ```bash linenums="1" title="hello.slurm"
    #!/bin/bash

    # Hello world Matlab script with Slurm

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH -c 1                              # one core per task
    #SBATCH -t 1:00:00
    #SBATCH -o hello-%j.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Load software
    module load matlab

    # Run hello world script
    matlab -batch "hello()"
    ```

Then run it by submitting the job to the Slurm scheduler with:

```title="Terminal Command"
sbatch hello.slurm
```

## Example Job Array

We will take this slurm job script and modify it to run as a job array. 
Each task in a job array will run the same script and print 'Hello!' and the job array task ID. We are going to do this by passing the job array task ID as a **command line argument** to the script. The script accepts the command line argument and prints 'Hello!' and the task ID passed to it. 



Let's modify our hello world script to look like:

=== "R"
    ```R linenums="1" title="hello-parallel.R"
    # accept command line arguments and save them in a list called args
    args = commandArgs(trailingOnly=TRUE)

    # print task number
    print(paste0('Hello! I am a task number: ', args[1]) )    
    ```


=== "Python"
    ```py linenums="1" title="hello-parallel.py"
    # import sys library (needed for accepted command line args)
    import sys

    # print task number
    print('Hello! I am a task number: ', sys.argv[1])
    ```

    This one-liner script can be run with `python hello.py`. 

=== "Julia"
    ```julia linenums="1"  title="hello-parallel.jl"
    # print command line argument (should be the job array index: 1, 2, ...)
    # note that command line arguments are stored as array of strings 
    # ARGS[1] is the command line argument following the name of julia script
    println("hello world from core: " * ARGS[1])
    ```

=== "Matlab"
    ```matlab linenums="1"  title="hello_parallel.m"
    function hello_parallel(i)
        fprintf('Hello! %d\n', i);
    end
    ```

Then we modify the slurm file to look like below:

=== "R"
    ```bash linenums="1" title="hello-parallel.slurm"
    #!/bin/bash

    # Example of running R script with a job array

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH --array=1-10                    # how many tasks in the array
    #SBATCH -c 1                            # one CPU core per task
    #SBATCH -t 10:00
    #SBATCH -o hello-%j-%a.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Load software
    module load R

    # Run R script with a command line argument
    Rscript hello-parallel.R $SLURM_ARRAY_TASK_ID    
    ```


=== "Python"
    ```bash linenums="1" title="hello-parallel.slurm"
    #!/bin/bash

    # Example of running python script with a job array

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH --array=1-10                    # how many tasks in the array
    #SBATCH -c 1                            # one CPU core per task
    #SBATCH -t 10:00
    #SBATCH -o hello-%j-%a.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Run python script with a command line argument
    srun python3 hello-parallel.py $SLURM_ARRAY_TASK_ID
    ```

=== "Julia"
    ```bash linenums="1" title="hello-parallel.slurm"
    #!/bin/bash

    # Example of running python script with a job array

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH --array=1-10                    # how many tasks in the array
    #SBATCH -c 1                            # one CPU core per task
    #SBATCH -t 10:00
    #SBATCH -o hello-%j-%a.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Load software
    module load julia

    # Run Julia with a command line arg being an index from 1 to 10
    srun julia hello-parallel.jl $SLURM_ARRAY_TASK_ID
    ```

=== "Matlab"
    ```bash linenums="1" title="hello-parallel.slurm"
    #!/bin/bash

    # Example of running python script with a job array

    #SBATCH -J hello
    #SBATCH -p normal
    #SBATCH --array=1-10                    # how many tasks in the array
    #SBATCH -c 1                            # one CPU core per task
    #SBATCH -t 10:00
    #SBATCH -o hello-%j-%a.out
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=your_email@stanford.edu

    # Load software
    module load matlab

    # Run Matlab with a command line arg being an index from 1 to 10
    matlab -batch "hello_parallel($SLURM_ARRAY_TASK_ID);"
    ```


Note that in this case, we specified slurm option `#SBATCH --array=1-10` to run ten independent tasks in parallel. The maximum job array size is set to 512 on Yen. Each task will generate a unique log file `hello-jobID-taskID.out` so we can look at those and see if any of the tasks failed.
 
### Submit Job Array to Scheduler
We can now submit our `hello-parallel.slurm` script to the slurm scheduler to run the job array. It will launch all 10 tasks at the same time (some might sit in the queue while others are going to run right away). To submit, run:

```title="Terminal Command"
sbatch hello-parallel.slurm
```

Monitor your jobs with `watch squeue -u USER` where `USER` is your SUNet ID. Check which job array tasks failed. 
Rerun those by setting `--array=` only to failed indices.

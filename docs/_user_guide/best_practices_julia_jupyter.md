# How Do I Install Julia on JupyterHub?

## Step 1: Log onto the Yens

## Step 2: Load and run Julia

Use the following commands:

```bash
module load julia
julia
```

## Step 3: Load IJulia for notebooks

You should now be at an interactive Julia console.  Run the following Julia commands:

```julia
using Pkg
Pkg.add("IJulia")
```

## Step 4: Relaunch JupyterHub

Restart your JupyterHub server, and you should see Julia listed as a notebook kernel.

!!! tip
    Learn more about JupyterHub on the Yens [here](/yen/webBasedCompute.html)

## Optional: Multithreaded Julia kernel
The steps above install Julia kernel that will use a single core on JupyterHub on the Yens. 

If you want to run multithreaded Julia kernel, you can install it by running the following
in the interactive Julia console. Choose the number of threads for the kernel to be less than 12
as per [Yen Community Guidelines](/yen/community.html).

```julia
using IJulia
IJulia.installkernel(
    "julia-mp", 
    env=Dict("JULIA_NUM_THREADS" => "4")
)
```

Once you launch JupyterHub and the new multithreaded Julia kernel, check that you are using the 
correct number of threads:

```julia
Threads.nthreads()
4
```

The output of `Threads.nthreads()` should be equal to the number of threads you used to create the kernel.

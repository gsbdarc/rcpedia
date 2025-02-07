 # How Do I Install Julia on JupyterHub?

## Step 1: Log onto the Yens

## Step 2: Load and Run Julia

Use the following commands:

```bash title="Terminal Input"
module load julia
julia
```

## Step 3: Load IJulia for notebooks

You should now be at an interactive Julia console.  Run the following Julia commands:

```julia  title="Julia Console Input"
using Pkg
Pkg.add("IJulia")
```

## Step 4: Relaunch JupyterHub

Restart your JupyterHub server, and you should see Julia listed as a notebook kernel.

!!! tip "JupyterHub on the Yen Cluster"
    Learn more about JupyterHub on the Yens [here](/_getting_started/jupyter){:target=_blank}.

## Optional: Multithreaded Julia Kernel
The steps above install Julia kernel that will use a single core on JupyterHub on the Yen cluster. 

To run a multithreaded Julia kernel, open the interactive Julia console and execute the following command. 
Be sure to set the number of threads to a value below the maximum allowed, as outlined in the
the [User Limits](/_policies/user_limits){:target=_blank}.

```julia title="Julia Console Input"
using IJulia
IJulia.installkernel(
    "julia-mp", 
    env=Dict("JULIA_NUM_THREADS" => "4")
)
```

Once you launch JupyterHub and the new multithreaded Julia kernel, check that you are using the 
correct number of threads:

```julia title="Julia Notebook Cell Input"
Threads.nthreads()
4
```

The output of `Threads.nthreads()` should be equal to the number of threads you used to create the kernel.

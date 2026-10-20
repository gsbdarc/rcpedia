# Running Julia Interactively

On the Yens, Julia is available via the `module` command.

See all currently installed versions with:

Terminal Input

```
module avail julia
```

You will see different Julia versions listed:

Terminal Output

```
-------------------------------------------- Global Aliases --------------------------------------------


---------------------------------------- /software/modules/Core ----------------------------------------
   julia/0.7.0    julia/1.0.2    julia/1.3.1    julia/1.6.2    julia/1.8.0    julia/1.10.2 (D)
   julia/1.0.0    julia/1.2.0    julia/1.5.1    julia/1.7.3    julia/1.9.2

  Where:
   D:  Default Module
```

## Load Julia Module

To use Julia software on the Yens, load the module:

Terminal Input

```
ml julia
```

This will load the default `(D)` module. You can also load a specific version of Julia with:

Terminal Input

```
ml julia/1.9.2
```

## Running Julia Code

To execute a Julia script, run:

Terminal Input

```
julia <your-script.jl>
```

where `<your-script.jl>` is your Julia script.

## Installing Packages

Launch Julia REPL by running `julia` in the terminal. Even though the Julia software is installed system-wide, every user keeps their own library of packages that they need to run their code.

To install packages, Press `]` to enter the package manager mode in the Julia REPL. You'll see the prompt change from `julia>` to `pkg>`. Use the `add` command followed by the package name:

Example Package Installation

```
pkg> add DataFrames
```

This will download and install the package along with any necessary dependencies.

Package Installation is Persistent

The packages need to be installed once, then can be loaded in subsequent code runs.

To switch back from the package manager mode (indicated by the `pkg>` prompt) to the Julia REPL (indicated by the `julia>` prompt), press the `delete` or `Backspace` key. Alternatively, you can press `Ctrl+C`, which will also return you to the regular Julia prompt.

To use the installed package:

Julia REPL Input

```
using DataFrames
```

Julia Packages Vary By Version

Every version of Julia has its own library of packages which means if you upgrade the version of Julia, you will need to reinstall the necessary packages for that version (once).

## Multithreading in Julia

We can utilize multiple threads on the Yens to run the code in parallel.

First, let's check how many threads Julia is currently using:

Julia REPL Input

```
Threads.nthreads()
```

You should see:

Julia REPL Output

```
1
```

To set the number of threads to 16, exit Julia (hit `Ctrl+D`), then run:

Terminal Input

```
export JULIA_NUM_THREADS=16
julia
```

Check that the number of threads is now set to 16:

Julia REPL Input

```
Threads.nthreads()
```

You should see:

Julia REPL Output

```
16
```

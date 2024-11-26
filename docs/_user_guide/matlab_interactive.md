# Running Matlab Interactively

On the Yens, Matlab is available via the `module` command.

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

## Load Matlab Module
To use Matlab software on the Yens, load the module:
```title="Terminal Input"
ml Matlab
```
This will load the default Matlab module (matlab/R2022b). You can also load a specific version of Matlab with:

```title="Terminal Input"
ml matlab/R2024a
```

You can start the Matlab interactive console by typing `matlab`.

```{.yaml .no-copy title="Terminal Output"}
MATLAB is selecting SOFTWARE OPENGL rendering.

                                                                                                                                 < M A T L A B (R) >
                                                                                                                  Copyright 1984-2022 The MathWorks, Inc.
                                                                                                                  R2022b Update 1 (9.13.0.2080170) 64-bit (glnxa64)
                                                                                                                                 September 28, 2022

 
To get started, type doc.
For product information, visit www.mathworks.com.
 
>> 

```

To exit matlab simply type `exit` in the interactive console.

```title="Matlab Console"
exit
```

To access MATLAB's help documentation, type `doc` for the documentation browser or `help` followed by a function name.

```title="Matlab Console"
>> doc
>> help disp
```

## Managing Matlab Software Libraries and Versions

The Matlab software is installed system-wide. Each user can maintain their own set of Matlab scripts within their home directory.

To see the list of currently installed toolboxes by running the interactive Matlab console and typing:

```title="Matlab Console"
>> ver
```
This command will display all installed MATLAB toolboxes and their version numbers.



## Running Matlab Scripts

A simple Matlab script looks like:

```matlab title="hello_world.m"
disp('Hello world')
```

Save this line to a new file called `hello_world.m`. 

This one-liner script can be run on the matlab interactive Yens with 
``` title="Terminal Input"
matlab -nodesktop < hello_world.m
``` 
!!! Tip
    The `-nodesktop` option runs MATLAB without the desktop environment, which is useful when running on a remote server or over SSH.



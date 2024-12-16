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

## Loading a Matlab Module
To load the default MATLAB module (for example, `matlab/R2022b`), run:

```title="Terminal Input"
ml matlab
```

!!! Note
      `ml` is a shorthand for `module load`.

If you want to load a specific MATLAB version instead, specify it directly:

```title="Terminal Input"
ml matlab/R2024a
```

## Starting an Interactive Matlab Session

You can start the Matlab interactive console by typing `matlab`.

```title=" Yen Terminal Input"
matlab
```

### Example Output

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
### Exiting Matlab

To exit matlab simply type:
```title="Matlab Input"
exit
```
Alternatively, you can press ++ctrl+"D"++ .

## Running Matlab Scripts

Create a simple test script named hello_world.m:

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



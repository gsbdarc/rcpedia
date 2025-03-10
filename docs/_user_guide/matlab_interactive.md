# Running Matlab Interactively

On the Yens, Matlab is available via the `module` command.

Several versions of Matlab are installed and the default version is designated with `(D)`:

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
To load the default Matlab module (for example, `matlab/R2022b`), run:

```title="Yen Terminal Input"
ml matlab
```

!!! Note
      `ml` is a shorthand for `module load`. Learn more about modules [here](/_getting_started/modules){:target=_blank}.

If you want to load a specific Matlab version instead, specify it directly:

```title="Yen Terminal Input"
ml matlab/R2024a
```

## Starting an Interactive Matlab Session

You can start the Matlab interactive console by typing `matlab`:

```title=" Yen Terminal Input"
matlab
```

### Example Output

```{.yaml .no-copy title="Terminal Output"}
Matlab is selecting SOFTWARE OPENGL rendering.

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

## Running Matlab Scripts

Create a simple test script named `hello_world.m`:

```matlab title="hello_world.m"
function hello()
    fprintf('Hello!');
end
```

To run this script non-interactively (without the desktop environment), use:

``` title="Terminal Input"
matlab -batch "hello()"
``` 

!!! Tip "Use Batch Mode for Running Scripts"
    The `-batch` option runs Matlab in a batch mode, which is useful when working on a remote server or over SSH where graphical interfaces may not be available or convenient.

## Use Graphical Matlab Interface on Jupyter
Start a full Matlab GUI from [JupyterHub](/_getting_started/jupyter/){:target=_blank} by navigating to Launcher / Notebook section.
![Jupyter Matlab Icon](/assets/images/matlab.png)

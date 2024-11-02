# Running SAS Interactively

On the Yens, SAS is available via the `module` command. 

See all currently installed versions with:

```title="Terminal Input"
module avail sas
```

You will see the current SAS versions listed:

```{.yaml .no-copy title="Terminal Output"}

-------------------------------------------- Global Aliases --------------------------------------------


---------------------------------------- /software/modules/Core ----------------------------------------
   sas/9.4
```

## Load SAS Module
To use SAS software on the Yens, load the module:
```title="Terminal Input"
ml sas
```
This will load the default `(D)` module. You can also load a specific version of SAS with:

```title="Terminal Input"
ml sas/9.4
```

## Running SAS Code

To execute a SAS script at the terminal, run:
```bash title="Terminal Input"
sas <your-script.sas>
```
where `<your-script.sas>` is your SAS script.

Note that SAS output is provided in a log file called `<your-script.log>`.

!!! tip "Graphical SAS"
    SAS can be also be accessed in a graphical form using [Jupyter Notebooks](/_getting_started/jupyter/#sas) or [X-Forwarding](/_user_guide/best_practices_gui).

## Other SAS Environments

Depending on your needs, you may prefer using SAS in a different environment.

* [SAS Studio on WRDS](https://wrds-www.wharton.upenn.edu/pages/grid-items/using-sas-studio/) provides a web-native graphical interface with access to the GSB's licensed data on WRDS.
* Your machine may be a more effective place to develop your code, given the native GUI. There is a [free license](https://uit.stanford.edu/service/softwarelic/sas) for SAS at the University level.

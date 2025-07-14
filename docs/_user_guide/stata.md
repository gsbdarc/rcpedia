# Running Stata Interactively

On the Yens, Stata is available via the `module` command. 

See all currently installed versions with:

```title="Terminal Input"
module avail stata
```

You will see the current Stata versions listed:

```{.yaml .no-copy title="Terminal Output"}

----------------------------------------------------------------- Global Aliases ------------------------------------------------------------------
   statamp/17 -> stata/17

------------------------------------------------------------- /software/modules/Core --------------------------------------------------------------
   stata-mp/now        stata/now        statamp/now        xstata-mp/now        xstata/now        xstatamp/now
   stata-mp/16         stata/16         statamp/16         xstata-mp/16         xstata/16         xstatamp/16
   stata-mp/17  (D)    stata/17  (D)    statamp/17  (D)    xstata-mp/17  (D)    xstata/17  (D)    xstatamp/17  (D)
   stata-mp/18         stata/18         statamp/18         xstata-mp/18         xstata/18         xstatamp/18

  Where:
   D:  Default Module
```

## Load Stata Module
To use Stata software on the Yens, load the module:
```title="Terminal Input"
ml stata
```
This will load the default Stata module. You can also load a specific version of Stata with:

```title="Terminal Input"
ml stata/18
```

!!! tip "Use `stata/now` module"
    Load the latest version of Stata by using `ml stata/now`

## Running Code

To execute a do script using `stata-mp` at the terminal, run:
```bash title="Terminal Input"
stata-mp -b do <your-script.do>
```
where `<your-script.do>` refers to your Stata do-file."

!!! tip "Graphical Stata"
    Stata can be also be accessed in a graphical form using [Jupyter Notebooks](/_getting_started/jupyter/#stata){:target=_blank} or [X-Forwarding](/_user_guide/using_gui){:target=_blank}.

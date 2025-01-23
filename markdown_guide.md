# Working With Code Snippets

## Code

* Turn line numbers on for code (`lineums="1"`)
* Give a helpful title (`title=`)
* Highlight a row if it makes sense (`hl_lines=`)

    ```bash linenums="1" hl_lines="4-4" title="hello.slurm"
    #!/bin/bash
    #
    #SBATCH --job-name=test
    #SBATCH -p normal,gsb

    echo "hello"
    ```

## Shell Input

Note:
* We don't do a language
* Set the title to be "Terminal Command"
* Remove the `$` or anything to indicate you're at the shell
* No line numbers

    ```title="Terminal Command"
    watch squeue -u $USER
    ```

## Shell Output

Note:
* We don't do a language
* We don't have a title
* Disable copying

    ```{ .yaml .no-copy }
    Hello from sh02-05n71.int node
    ```
    
## Language Output
You can format **with** the language syntax highlighting for outputs.

In R: 

```{.r .yaml .no-copy title="Terminal Output" }
> install.packages("package-name")
```

or Python REPL:

```{.python .yaml .no-copy title="Terminal Output" }
>>> import numpy as np
```

# Talking about Yen vs `yen`

When discussing the cluster, as a whole use...

> the Yen servers

or

> the Yen cluster

or, least favorably but still acceptable:

> the Yens

When discussing a machine in the context of a command, use `code`...

> Now, connect to `yen2` and run `python`



# Talking about Languages

Best practice is to capitalize languages.  When used in prose, you can use the following:

* Python (not python)
* Matlab (yes I know, it's properly MATLAB but ugh)
* R
* Julia
* Stata

# Links in New Tabs

Format links like this:

    visit [Stanford](https://stanford.edu){target="_blank"}

# Admonitions

When using Admonitions (e.g., `!!! tip` or `!!! danger`) use the optional title to add context and emphasis when helpful. Use `Title Case` for these, as they are formatted like a title:

    !!! danger "Be Aware of License Agreements"
        Not all data is licensed for use outside of Stanford!  Be careful before copying data to other university environments.

## What's Title Case?

In Title Case, the following words are typically not capitalized unless they are the first or last word of the title:

Articles:
a, an, the

Coordinating Conjunctions:
and, but, or, for, nor, so, yet

Prepositions (short ones, typically 4 letters or fewer):
at, by, for, in, of, off, on, out, to, up, with
However, longer prepositions like "between" or "underneath" are usually capitalized.

For example:

* Correct Title Case: "Be Aware of License Agreements"
* Incorrect Title Case: "Be Aware Of License Agreements" (note the capitalized "Of")

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

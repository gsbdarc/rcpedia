# User Limits
<div class="row">
    <div class="col-lg-12">
      <H1> </H1>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-13">
     <div class="fontAwesomeStyle"><i class="fas fa-tachometer-alt"></i> Interactive Yens have the following per node limits:</div>
<iframe class="airtable-embed" src="https://airtable.com/embed/shrGC2dYzvDSgJfXa?backgroundColor=purple" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
   </div>
    <div class="col col-md-2"></div>
  </div>

!!! danger
    Jobs exceeding CPU or RAM limits may be automatically terminated to preserve system integrity.


The Yens are a shared cluster with:

- Legacy Yens: `yen1` with **32 CPUs**, **1.5 TB RAM**

- Next Gen Yens: `yen[2-5]` with **256 CPUs**, **1 TB RAM**


## Best Practices for Sharing Computational Resources

- **Understand the footprint of your code**: Avoid excessive resource usage and remember to free up any unused RAM. 

- **Be mindful of resource use**: Limit CPU and RAM usage within community guidelines shown in the table above.

- **Clean up**: Delete temporary files regularly.

- **Monitor large jobs**: Periodically check on their status. Use tools like `top`, `htop` and `userload` to monitor system processes, especially CPU and RAM usage. If your job misbehaves, halt and fix it.

- **Use `gsbquota`**: Ensure you stay within your disk quota.
  ```bash title="Terminal Input"
  gsbquota
  ```
  You will see the space used in your home directory:
  ```{.yaml .no-copy title="Terminal Outpt"}
  /home/users/$USER: currently using X% (XG) of 50G available
  ```

- **Use platform-specific tools**: Optimize resource usage.

- **Use language-specific packages**: Use packages opimized for your language or software (i.e. Python multithreading).

!!! tip
    If unsure, [email](mailto:gsb_darcresearch@stanford.edu) or [Slack](https://circlerss.slack.com/archives/C01JXJ6U4E5) us for help!


## Example
You write Python code to use 10 cores, start running the program, and watch it run with `htop` to make sure it is actually using 10 cores:

![htop output for well-behaved code](/assets/images/proc_monitoring.png)

# User Limits

## Interactive Compute Limits

The Yens are designed to enable considerable computational usage on our "login" or "interactive" nodes.

Jupyter and Interactive Node Limits

- **Jupyter Limits**: Jupyter notebooks are subject to the same CPU and RAM limits as the interactive nodes, but may also be affected by inactivity policy.
- **Interactive Node Usage**: Users can have both Jupyter notebooks and other scripts running on the same interactive node (e.g., `yen2`). The CPU and RAM limits are counted **separately** for JupyterHub and scripts started interactively, even if both are using the same node. This means resource usage for Jupyter does not count against the limits for your other interactive work, and vice versa.

As such, we have imposed guidelines for users to follow on these shared systems, depending on the resources of the underlying machine:

Danger

Jobs exceeding CPU or RAM limits may be **automatically terminated** to preserve system integrity.

## Slurm Resource Limits

Jobs submitted to [Yen Slurm](/_user_guide/slurm/) have the following limits, by partition:

| Partition | CPU Limit Per User | Memory Limit (MB) | Memory Limit (GB) | Time Limit (default) |
| --------- | ------------------ | ----------------- | ----------------- | -------------------- |
| normal    | 512                | 3072000           | 3000              | 2 days (2 hours)     |
| long      | 256                | 3072000           | 3000              | 7 days (2 hours)     |
| dev       | 2                  | 48000             | 46                | 2 hours (1 hour)     |
| gpu       | 64                 | 256000            | 250               | 1 day (2 hours)      |

The maximum job array size is set to **512** on Yen-Slurm.

Note

We set these limits to best meet the needs of the community within the constraints of our current system configuration. If you believe these need to be adjusted, please [let us know](mailto:gsb_darcresearch@stanford.edu).

## Storage Limits

Home directories have a limit of 80G, and are designed to store personal files, not project work. Learn more about [storage on the Yens](/_user_guide/storage/#yen-file-system).

Do NOT exceed your quota!

If you exceed your home directory quota, you cannot access Jupyter or perform many basic system tasks.

The `gsbquota` command is available for you to check your current disk usage.

Terminal Input

```
gsbquota
```

You will see the space used in your home directory:

Terminal Output

```
/home/users/$USER:
  using X% (XGiB) of soft quota 80GiB
  hard quota: 300GiB
  time until lockout: no block scheduled
```

### Identifying Large Files

Unsure what's taking up space? The `gsbbrowser` command scans your home directory and provides a visual representation of your directories and files and their associated sizes.

## Best Practices for Sharing Computational Resources

- **Understand the footprint of your code**: Avoid excessive resource usage and remember to free up any unused RAM.
- **Be mindful of resource use**: Limit CPU and RAM usage within community guidelines shown in the table above.
- **Clean up**: Delete temporary files regularly.
- **Use effective language-specific packages**: Use packages optimized for your language or software (i.e. [Dask for merging large data sets in Python](/blog/2023/02/09/merging-big-data-sets-with-python-dask/), or `data.table` in R).
- **Monitor your jobs**: Use tools like `top`, `htop` and `userload` to [monitor system processes](/_user_guide/monitor_usage/), especially CPU and RAM usage. If your job misbehaves, halt and fix it.

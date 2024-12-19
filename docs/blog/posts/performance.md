---
date:
  created: 2021-01-20 
categories:
    - Performant Code
    - Parallelization 
    - Code Optimization Tips 
---

# Optimizing Performance on the Yens

As you migrate your code from a local machine to the Yen servers, you may notice some differences in performance. Due to the shared nature of our architecture, adapting your code can help maximize efficiency and take full advantage of the available resources.

## Tips for Improving Performance
### Minimize Disk Writes
One of the slowest operations is writing data to disk. On the Yens, storage is shared across systems, which means writing to disk can be significantly slower than on a local SSD. To improve performance:

- Batch disk writes whenever possible. 
- Minimize writing a large number of small files, especially in the same directory.
- Use flash storage local to each node for writing/reading files that are needed only during the run
- Use a database. If you find yourself managing too many files, consider using a database like SQLite to store your data.

### Implement Checkpoints
Unexpected crashes can waste hours of processing time. Design your code so that it can resume from intermediate checkpoints:

- **Save your progress regularly**. Write intermediate results to disk to avoid having to restart from scratch.
- **Log your output**. Keep detailed logs to track what has already been processed.

### Utilize RAM Efficiently
Memory reads are much faster than disk reads, and the Yens have substantial RAM (in the terabyte range). You can scale up significantly in memory compared to your local machine. Here are some guidelines:

- **Scale up your in-memory processing**. Utilize the ample RAM to handle larger datasets. 
- **Track memory usage**. Make sure you understand the memory footprint of your code to avoid running out of RAM, which can lead to crashes.


### Leverage Multiple Processors
One major advantage of the Yens is parallel processing. While individual processors may not be the fastest, having many of them allows you to scale out effectively:

- **Design for parallelism**. If possible, structure your code to be "embarrassingly parallel," where tasks can run independently.
- **Understand parallel overhead**. There is a cost to parallelization, so find the right balance in your pipeline. Larger tasks tend to be more efficient in parallel execution compared to many small tasks. If you have 10 tasks that each run for an hour, there's a lot less overhead than 36,000 tasks that each run for one second.


### Choose the Right Libraries 
Many numerical operations can be significantly accelerated by optimized libraries:

- Explore optimized libraries. Libraries like Intel's Math Kernel Library (MKL) or Microsoft's optimized numerical libraries may be much faster than standard versions. Before embarking on large computations, it’s worth testing these options.
 
### Profile Your Code

Understanding which parts of your code are slowing things down can save significant time:

- Use profiling tools. Most programming languages have profiling libraries that help identify bottlenecks.
- Target specific optimizations. Profiling allows you to focus on optimizing the parts of your code that are most computationally expensive.

### Be Aware of Shared Resources
The Yens are a shared environment, and sometimes resources may be in high demand. JupyterHub and the interactive yens are both entirely shared resources - if lots of users are running code, the CPUs will have to be shared among those users.

- Check system load. If your code runs slowly, it could be due to high usage by other users. Tools like top or htop can help you determine if CPUs are being heavily used.
- Use Yen-Slurm for dedicated resources. If you need guaranteed CPU or memory, submit your jobs with Slurm to the scheduled Yens. Keep in mind that this may mean waiting for resources to become available, so it's a good idea to prototype interactively before batch submission.


### Leverage Shell Commands 

For data processing pipelines, Linux shell commands can be incredibly fast:

- **Learn basic utilities**. Commands like `grep`, `head`, `tail`, `wc`, `cut`, and `sort` can be combined to create powerful one-liners for common tasks.
  - `grep` to do a regular expression search in a file
  - `head` and `tail` to extract segments from a file
  - `wc` to get the length of a file
  - `cut` to extract a subset of columns from a delimited file
  - `sort` to sort the contents of a stream

Example command:
```bash
cut schema.csv -d ',' -f 4 | grep "int" | wc -l
```

This command quickly answers the question: "How many rows contain 'int' in the fourth column of `schema.csv`?"

### Summary
Adapting your code to make full use of the Yens' resources can dramatically improve performance. By minimizing disk writes, leveraging RAM, optimizing for parallelism, using the right libraries, and profiling your code, you can ensure that your computations run as efficiently as possible. Don't forget to use Slurm for dedicated resources and take advantage of Linux command-line tools for fast data processing.

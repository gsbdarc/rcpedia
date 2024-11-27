---
date:
  created: 2023-02-09
categories:
    - Python
    - Dask
    - Merging data sets
authors:
    - nrapstin
---

# Merging Big Data Sets with Python Dask 

If you're running out of memory on your desktop for data processing tasks, consider using the Yen servers. Both the interactive Yen servers and the Yen-Slurm nodes have at least 1 TB of RAM per node. However, per the [Yen User Limits](/_policies/user_limits){:target="_blank"}, you should limit your memory usage to 192 GB on most interactive Yen servers.

<!-- more -->

## `dask` Python Package 

The Python package [`dask`](https://dask.org){:target="_blank"} is a powerful tool for parallel data analytics, offering faster and more memory-efficient performance than `pandas`. It follows `pandas` syntax and can accelerate common data processing tasks like merging large datasets.  

## Virtual Environment
First, we'll prepare a virtual environment called `venv` inside a ZFS directory where you have write permissions. 
Create a virtual environment:
```bash title="Terminal Input"
/usr/bin/python3 -m venv venv
source venv/bin/activate
```

Create a file called `requirements.txt` with Python packages listed for the virtual environment:

```title="requirements.txt"
requests
pandas
numpy
dask
dask[dataframe]
memory-profiler
```

Install the requirements into the active virtual environment:
```
pip install -r requirements.txt
```

## Data Download
We are going to use public EDGAR data from 2013. We will merge two data sets - EDGAR log files and financial statements. The Edgar log files are downloaded by grabbing a list of URLs for each log file from [the SEC website](https://www.sec.gov/files/edgar_logfiledata_thru_jun2013.html){:target="_blank"}. 

Save the following to a file called `download_logs.py`.
```python title="download_logs.py"
import os
import requests
import time

# Define the dates for 2013
dates = [
    '20130217',
    '20130225',
    '20130605',
    '20130606',
    '20130712',
    '20130804',
    '20130812',
    '20130907',
    '20130915',
    '20131020'
]

# Create the directory to store the downloaded files
data_dir = 'data/raw_edgar_logs2013'
os.makedirs(data_dir, exist_ok=True)

# Function to download the EDGAR log files
def download_logs(dates):
    for date in dates:
        date = date.strip()
        if len(date) != 8 or not date.isdigit():
            print(f'Invalid date format: "{date}". Skipping.')
            continue

        # Extract the month and calculate the quarter
        month = int(date[4:6])
        quarter = (month - 1) // 3 + 1

        # Construct the URL
        url = f'https://www.sec.gov/dera/data/Public-EDGAR-log-file-data/2013/Qtr{quarter}/log{date}.zip'
        local_filename = os.path.join(data_dir, f'log{date}.zip')

        if not os.path.exists(local_filename):
            print(f'Downloading {url}...')

            # Include headers to avoid 403 Forbidden errors
            headers = {
                'User-Agent': 'Your Name (your.email@stanford.edu) - For academic research purposes',
                'Accept-Encoding': 'gzip, deflate',
                'Host': 'www.sec.gov'
            }

            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()  # Check for HTTP errors

                with open(local_filename, 'wb') as f:
                    f.write(response.content)

                print(f'Saved to {local_filename}')

                # Be polite and wait 1 second between requests
                time.sleep(1)

            except requests.HTTPError as errh:
                print(f'HTTP Error: {errh}')
            except requests.ConnectionError as errc:
                print(f'Error Connecting: {errc}')
            except requests.Timeout as errt:
                print(f'Timeout Error: {errt}')
            except requests.RequestException as err:
                print(f'An error occurred: {err}')
        else:
            print(f'File {local_filename} already exists. Skipping download.')

# Run the download function
download_logs(dates)
```

Then, run the saved script to download 10 zip log files:

```title="Terminal Input"
python download_logs.py
```

Now you should have 10 zip files downloaded in `data/raw_edgar_logs2013` directory:

```bash title="Terminal Input"
ls -ltrh data/raw_edgar_logs2013/
```

You should see:
```{.yaml .no-copy title="Terminal Output"}
total 1.1G
-rw-rw---- 1 nrapstin gsb-rc_sysadmins  97M Nov 12 10:44 log20130217.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 106M Nov 12 10:44 log20130225.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 122M Nov 12 10:44 log20130605.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 120M Nov 12 10:44 log20130606.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 143M Nov 12 10:44 log20130712.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins  88M Nov 12 10:44 log20130804.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 136M Nov 12 10:44 log20130812.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins  76M Nov 12 10:44 log20130907.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins  77M Nov 12 10:44 log20130915.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins  79M Nov 12 10:44 log20131020.zip
```

Next, we will combine all 10 logs into one big CSV file. Save the following into a new script `combine_logs.py`.

```python title="combine_logs.py"
import os
import pandas as pd
import numpy as np
from zipfile import ZipFile
import glob

def process_your_file(f):
    '''
    Helper function to read in zip file and
    return a pandas df
    '''
    zip_file = ZipFile(f)

    # Get file name without extension
    filename, extension = os.path.splitext(os.path.basename(zip_file.filename))

    # read in csv
    df = pd.read_csv(zip_file.open(filename + '.csv'))
    return df

# combine all 2013 logs into one df
files = glob.glob('data/raw_edgar_logs2013/log2013*.zip')

# make a list of df's to combine
frames = [ process_your_file(f) for f in files ]

# combine all df's in the list
result = pd.concat(frames)

# write out 10 2013 csv files into one csv
# results in a 7.8 G df
result.to_csv('data/logs2013-10logs.csv')
```

The second dataset is financial statments from 2013 that can be downloaded from the [SEC website](https://www.sec.gov/dera/data/financial-statement-data-sets.html){:target="_blank"}. 
We will also combine them into one CSV file.

Save the following script, `download_financials_2013.py`:

```python title="download_financials_2013.py" 
import os
import requests
import time

# Create the directory to store the downloads
data_dir = 'data/financial2013'
os.makedirs(data_dir, exist_ok=True)

# Base URL for the financial statement datasets
base_url = 'https://www.sec.gov/files/dera/data/financial-statement-data-sets/'

# Quarters for 2013
quarters = ['q1', 'q2', 'q3', 'q4']

# Function to download the datasets
def download_financials(year, quarters):
    for quarter in quarters:
        filename = f'{year}{quarter}.zip'
        url = f'{base_url}{filename}'
        local_filename = os.path.join(data_dir, filename)

        if not os.path.exists(local_filename):
            print(f'Downloading {url}...')
            headers = {
                'User-Agent': 'Your Name (your.email@example.com) - For academic research purposes',
                'Accept-Encoding': 'gzip, deflate',
                'Host': 'www.sec.gov'
            }
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                with open(local_filename, 'wb') as f:
                    f.write(response.content)
                print(f'Saved to {local_filename}')
                time.sleep(1)  # Wait 1 second between requests
            except requests.HTTPError as errh:
                print(f'HTTP Error: {errh}')
            except requests.ConnectionError as errc:
                print(f'Error Connecting: {errc}')
            except requests.Timeout as errt:
                print(f'Timeout Error: {errt}')
            except requests.RequestException as err:
                print(f'An error occurred: {err}')
        else:
            print(f'File {local_filename} already exists. Skipping download.')

# Run the download function
download_financials('2013', quarters)
```

Now you should have 4 zip files downloaded in `data/financial2013` directory:

```bash title="Terminal Input"
ls -ltrh data/financial2013
```

You should see:
```{.yaml .no-copy title="Terminal Output"}
total 84M
total 196M
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 52M Nov 12 10:56 2013q1.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 50M Nov 12 10:56 2013q2.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 47M Nov 12 10:56 2013q3.zip
-rw-rw---- 1 nrapstin gsb-rc_sysadmins 48M Nov 12 10:56 2013q4.zip
```

Next, we will combine the 4 zip files into one CSV file. Save the following into a new script `combine_financials.py`.

```python title="combine_financials.py"
# Python script to combine EDGAR finacial files from 2013 into one csv file
import pandas as pd
import numpy as np
from zipfile import ZipFile
import glob

# combine all 2013 financial statements into one df
files = glob.glob('data/financial2013/*.zip')

def process_your_file(f):
    zip_file = ZipFile(f)

    # read in sub.txt for each quarter
    df = pd.read_csv(zip_file.open('sub.txt'), sep='\t')
    return df


# make a list of df's to combine
frames = [ process_your_file(f) for f in files ]

# combine all df's in the list
result = pd.concat(frames)

# write out 2013 finanical data
result.to_csv('data/finance2013.csv')
```

Now we should have two data sets that we are going to merge using `pandas` and `dask` Python packages - `logs2013-10logs.csv` and `finance2013.csv` inside `data` directory.

## Profiling Memory

We will use the [`memory_profiler`](https://pypi.org/project/memory-profiler/){:target="_blank"} Python package to compare the memory usage of `pandas` versus `dask` in our code. This tool provides a line-by-line memory consumption report.
 
### Steps to Profile Memory
1. Annotate Your Code:

    Add the `@profile` decorator to the function you want to profile.

    ```python title="memory profile a function"
    from memory_profiler import profile
  
    @profile
    def process_data():
        # Your data processing code using pandas or dask
        pass
    ```

2. Run the Profiler:

    Execute the profiler by running your script with the `memory_profiler` module.
  
    ```bash title="Terminal Input"
    python -m memory_profiler your_script.py
    ```

    !!! note
        If you want to profile the entire script, encapsulate your code within a single function and decorate it with `@profile`.

3. View the Memory Report:

    After running, `memory_profiler` will output a detailed report showing memory usage for each line within the profiled function. This allows you to identify memory-intensive parts of your code and compare the efficiency between `pandas` and `dask`.


### Example 
We will compare the memory consumption of merging two datasets using `pandas` and `dask`. The profiling will be run on the yen-slurm servers.

1.  Create Profiling Scripts

    **a. Profiling with `pandas`**

    Save the following script as `pandas_mem_profile.py`:
    
    ```python title="pandas_mem_profile.py"
    #########################################
    # Merge example using pandas
    #########################################
    from memory_profiler import profile
    import pandas as pd
    
    @profile
    def profile_func():
        # Read in two datasets to merge
        logdata = pd.read_csv('data/logs2013-10logs.csv')
    
        # Convert 'cik' to int to ensure correct merge
        logdata['cik'] = logdata['cik'].astype(int)
    
        findata = pd.read_csv('data/finance2013.csv')
    
        # Merge using pandas
        merged = logdata.merge(right=findata, on='cik')
    
        # Write the merged data out
        merged.to_csv('data/mem-merged_df.csv', index=False)
    
    if __name__ == '__main__':
        profile_func()
    ```
    
    **b. Profiling with `dask`**

    Substitute [dask dataframes](https://docs.dask.org/en/latest/dataframe.html){:target="_blank"} where we previously used `pandas` dataframes. Save the following script as `dask_mem_profile.py`:

    ```python title="dask_mem_profile.py"
    #########################################
    # Merge example using dask
    #########################################
    from memory_profiler import profile
    import dask.dataframe as dd
    
    @profile
    def profile_func():
        # Read in two datasets to merge
        logdata = dd.read_csv('data/logs2013-10logs.csv', dtype={'browser': 'object'})
    
        # Convert 'cik' to int to ensure correct merge
        logdata['cik'] = logdata['cik'].astype(int)
        findata = dd.read_csv('data/finance2013.csv', dtype={'zipba': 'object', 'zipma': 'object'})
    
        # Merge using dask
        merged_dd = logdata.merge(right=findata, on='cik')
    
        # Write the merged data out
        merged_dd.to_csv('data/mem-merged_dd.csv', single_file=True)
    
    if __name__ == '__main__':
        profile_func()
    ```

2. Create Slurm Submission Script

    Save the following as `memory_profile.slurm`:
    ```bash title="memory_profile.slurm"
    #!/bin/bash
    
    #SBATCH -J mem-profile
    #SBATCH -o mem-profile-%j.out
    #SBATCH --time=5:00:00
    #SBATCH --mem=200G
    #SBATCH --cpus-per-task=12
    #SBATCH --mail-type=ALL
    #SBATCH --mail-user=YOUR_EMAIL@stanford.edu
    
    source venv/bin/activate 
    
    # Run memory profiling
    python -m memory_profiler pandas_mem_profile.py
    python -m memory_profiler dask_mem_profile.py
    ```
  
    !!! important
        Replace `YOUR_EMAIL@stanford.edu` with your actual email address to receive job notifications.

3. Submit the Profiling Job

    Once you have your scripts ready, submit the Slurm job with the following command:
    ```bash title="Terminal Input"
    sbatch memory_profile.slurm
    ```
  
    **Monitor Your Job**

    You can monitor the status of your job using:
    ```bash title="Terminal Input"
    squeue -u $USER 
    ```
    Replace `$USER` with your actual username on the yen servers.
  
    You should see your job running:
  
    ```{.yaml .no-copy title="Terminal Output"}
    JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    21749    normal mem-prof     user  R       0:07      1 yen11
    ```
    !!! note
        The job will take a couple hours to complete.

4. Viewing Profiling Results
    

    Once the job finishes, the output file (`mem-profile-<JOBID>.out`) will contain the memory profiling results. To view the results: 

    ```bash title="Terminal Input"
    cat mem-profile-<JOBID>.out
    ```
    where `<JOBID>` is the `JOBID` of the slurm job that has finished.
 
    After running the profiling scripts, your output file will include memory usage details for both `pandas` and `dask` profiles. Here's an example of what the output might look like:


    ```{.yaml .no-copy title="Contents of mem-profile-JOBID.out"}
    Filename: pandas-mem-profile.py

    Line #    Mem usage    Increment  Occurrences   Line Contents
    =============================================================
         7     94.0 MiB     94.0 MiB           1   @profile
         8                                         def profile_func():
         9                                             # Read in two datasets to merge
        10  21891.0 MiB  21797.0 MiB           1       logdata = pd.read_csv('data/logs2013-10logs.csv')
        11
        12                                             # Convert 'cik' to int to ensure correct merge
        13  21891.0 MiB      0.0 MiB           1       logdata['cik'] = logdata['cik'].astype(int)
        14
        15  21901.0 MiB     10.0 MiB           1       findata = pd.read_csv('data/finance2013.csv')
        16
        17                                             # Merge using pandas
        18  85372.6 MiB  63471.5 MiB           1       merged = logdata.merge(right=findata, on='cik')
        19
        20                                             # Write the merged data out
        21  85372.6 MiB      0.0 MiB           1       merged.to_csv('data/mem-merged_df.csv', index=False)
    
    
    Filename: dask_mem_profile.py
    
    Line #    Mem usage    Increment  Occurrences   Line Contents
    =============================================================
         7    118.0 MiB    118.0 MiB           1   @profile
         8                                         def profile_func():
         9                                             # Read in two datasets to merge
        10    124.0 MiB      6.0 MiB           1       logdata = dd.read_csv('data/logs2013-10logs.csv', dtype={'browser': 'object'})
        11
        12                                             # Convert 'cik' to int to ensure correct merge
        13    124.0 MiB      0.0 MiB           1       logdata['cik'] = logdata['cik'].astype(int)
        14    122.9 MiB     -1.1 MiB           1       findata = dd.read_csv('data/finance2013.csv', dtype={'zipba': 'object', 'zipma': 'object'})
        15
        16                                             # Merge using dask
        17    124.9 MiB      2.0 MiB           1       merged_dd = logdata.merge(right=findata, on='cik')
        18
        19                                             # Write the merged data out
        20   5641.3 MiB   5516.4 MiB           1       merged_dd.to_csv('data/mem-merged_dd.csv', single_file=True)
    ```

    The memory profiling output includes three columns:

    - `Line #`: The line number in the Python script.

    - `Mem usage`: Total RAM used up to that line.

    - `Increment`: Additional memory consumed by that specific line.

    By comparing the `Increment` values between the `pandas` and `dask` scripts, we can observe that the `dask` version uses 6% of the memory used by the `pandas` version. Additionally, `dask` delays loading datasets into memory until necessary, such as during the `to_csv` call.

    !!! note
        The `pandas` script consumed nearly 85 GB of RAM, whereas the `dask` version used under 6 GB for the same dataset merge.


## Profiling Speed
To measure how long each part of your script takes, we'll use Python's `time` package to manually time data loading, merging, and writing operations. Additionally, Python offers excellent profiling visualization tools like [SnakeViz](https://jiffyclub.github.io/snakeviz){:target="_blank"}, which allows you to visualize and interact with profiling data in your browser. While we won't use SnakeViz in this example, it's a valuable tool for future projects to identify and optimize slow parts of your code.

### Example

**Profiling speed with `pandas`** 

We'll use `pandas` to handle data loading, merging, and writing. Below is the `pandas_speed_profile.py` script:

```python title="pandas_speed_profile.py"
#########################################
# Merge example using pandas
#########################################
# packages
import numpy as np
import pandas as pd
import time

# read in two data sets to merge
print('loading log data in pandas...')
tmp = time.time()
logdata = pd.read_csv('data/logs2013-10logs.csv')
print(f"log data loading took: {time.time() - tmp:.2f} seconds")

# need to convert cik to int - otherwise get wrong merged results
logdata['cik'] = logdata['cik'].astype('int')

print('loading finance data in pandas...')
tmp = time.time()
findata = pd.read_csv('data/finance2013.csv')
print(f"finance data loading took: {time.time() - tmp:.2f} seconds")

# merge in pandas
print('merge data sets in pandas...')
tmp = time.time()
merged = logdata.merge(right=findata, on=['cik'])
print(f"merging datasets took: {time.time() - tmp:.2f} seconds")

# write out the merged df
print('writing data sets in pandas...')
tmp = time.time()
merged.to_csv('data/merged_df.csv')
print(f"writing merged dataset took: {time.time() - tmp:.2f} seconds")
```

**Profiling speed with `dask`** 

Similarly, we'll use `dask` to perform the same operations. Save the following script as `dask_speed_profile.py`:

```python title="dask_speed_profile.py"
#########################################
# Merge example using dask
#########################################
# packages
import numpy as np
import dask.dataframe as dd
import time

# read in two data sets to merge
print('loading log data in dask...')
tmp = time.time()
logdata = dd.read_csv('data/logs2013-10logs.csv', dtype={'browser': 'object'})
print(f"log data loading took: {time.time() - tmp:.2f} seconds")

# need to convert cik to int - otherwise get wrong merged results
logdata['cik'] = logdata['cik'].astype('int')

print('loading finance data in dask...')
tmp = time.time()
findata = dd.read_csv('data/finance2013.csv', dtype={'zipba': 'object', 'zipma': 'object'})
print(f"finance data loading took: {time.time() - tmp:.2f} seconds")

# merge in dask
print('merge data sets in dask...')
tmp = time.time()
merged_dd = logdata.merge(right=findata, on=['cik'])
print(f"merging datasets took: {time.time() - tmp:.2f} seconds")

# write out the merged df
print('writing data sets in dask...')
tmp = time.time()
merged_dd.to_csv('data/merged_dd.csv', single_file=True)
print(f"writing merged dataset took: {time.time() - tmp:.2f} seconds")
```

We are going to run both speed profile scripts using the same virtual environment and the following
 slurm submission script (save it to `speed_profile.slurm`):

```bash title="speed_profile.slurm"
#!/bin/bash

#SBATCH -J speed-profile
#SBATCH -o speed-profile-%j.out
#SBATCH --time=5:00:00
#SBATCH --mem=200G
#SBATCH --cpus-per-task=12
#SBATCH --mail-type=ALL
#SBATCH --mail-user=YOUR_EMAIL@stanford.edu

source venv/bin/activate

# Run speed profiling
python pandas_speed_profile.py
python dask_speed_profile.py
```

To submit, run:

```bash title="Terminal Input"
sbatch speed_profile.slurm
```

Then monitor your job with:

```bash title="Terminal Input"
squeue -u $USER  
```
Replace `$USER` with your actual username on the yen servers.


You should see your job running:
```{.yaml .no-copy title="Terminal Output"}
JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
24591    normal speed-pr     user  R    1:19:16      1 yen11
```

Once the job finishes, display the out file to see the results of profiling. The name of the out file
will have the `JOBID` that you saw in the output from `squeue` command.

```bash title="Terminal Input"
cat speed-profile-<JOBID>.out
```

You should see something like:
```{.yaml .no-copy title="Contents of speed-profile-JOBID.out file"}

loading log data in pandas...
log data loading took: 222.10 seconds
loading finance data in pandas...
finance data loading took: 0.38 seconds
merge data sets in pandas...
merging datasets took: 186.82 seconds
writing data sets in pandas...
writing merged dataset took: 4231.74 seconds
loading log data in dask...
log data loading took: 0.09 seconds
loading finance data in dask...
finance data loading took: 0.05 seconds
merge data sets in dask...
merging datasets took: 0.07 seconds
writing data sets in dask...
writing merged dataset took: 4057.86 seconds
```

Finally, we can summarize both output files in a table below which shows the efficiency of `dask` over `pandas`
in both speed and memory utilization:

| `pandas`                   | Memory it took  | Time it took    |
| :---                       |    :----:       |           ----:|
| Loading log data           |        22 GB    |        222 sec  |
| Loading finance data       |        10 MB    |       0.28 sec  |
| Merge data sets            |        63 GB    |        187 sec  |
| Writing merged data to disk|         0 MB    |       4231 sec  |

In comparision:

| `dask`                     | Memory it took  | Time it took    |
| :---                       |    :----:       |           ----:|
| Loading log data           |         6 MB    |       0.09 sec  |
| Loading finance data       |        -1 MB    |       0.05 sec  |
| Merge data sets            |         2 MB    |       0.07 sec  |
| Writing merged data to disk|       5.5 GB    |       4058 sec  |

`dask` impressive performance over `pandas` in both memory efficiency and speed is largely due to its *lazy evaluation* approach. Unlike `pandas`, which immediately processes data when an operation is called, `dask` builds a task graph and delays actual computation until explicitly requested — usually at the last step, such as writing data to disk. This explains why `dask` uses significantly less memory and time for operations like loading and merging data, only fully utilizing resources during the final write step where computation is triggered. This lazy evaluation strategy allows `dask` to optimize memory usage and parallelize tasks, leading to more efficient data processing overall.

!!! note
    We made the `pandas` and `dask` scripts save the merged dataset as one CSV file. That is not optimal for `dask` performance because `dask` really excels at working on chunks of the dataset in parallel and it would improve the perfomance for `dask` to save the dataset in multiple chunks. So, for real projects, `dask` can be optimized even further to save big on memory and speed.

Finally, we would like to acknowledge Sara Malik and Professor Jung Ho Choi that inspired this `dask` vs. `pandas` comparison example.

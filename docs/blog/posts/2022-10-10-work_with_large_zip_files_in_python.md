---
date:
  created: 2022-10-10
categories:
    - zip
authors:
    - jeffotter
subtitle: Working with Large Zip Files in Python
---

# Working with Large Zip Files in Python

## How to work with large zip files **without** unzipping them

### Problem
You need to access data from a zip file, but you don’t want to copy the zip file to your home/project directory and unzip it. How can you access this data efficiently?

Here is an example of a directory containing zip files and other files. It includes two notebooks, a sample zip file, and its unzipped contents stored in the `zipcontents` folder.

<!-- more -->

```bash title="Terminal Command"
tree
```

```{.yaml .no-copy title="Terminal Output"}
.
├── 2022_04_notes.zip
├── edgar-xbrl.ipynb
├── Jeff_test.ipynb
└── zipcontents
    ├── cal.tsv
    ├── dim.tsv
    ├── notes-metadata.json
    ├── num.tsv
    ├── pre.tsv
    ├── readme.htm
    ├── ren.tsv
    ├── sub.tsv
    ├── tag.tsv
    └── txt.tsv
```

### Size Comparison
Let’s examine the size differences between the original zip file, `2022_04_notes.zip`, and its unzipped version, `zipcontents`. The `du` command helps us understand how much disk space each file type uses.


```bash title="Terminal Command"
du -sh 2022_04_notes.zip
```

```{.yaml .no-copy title="Terminal Output"}
189M    2022_04_notes.zip
```

```bash title="Terminal Command"
du -sh zipcontents
```

```{.yaml .no-copy title="Terminal Output"}
367M    zipcontents
```

The unzipped folder is nearly twice the size of the zip file. Extracting an entire zipped folder with a large directory of files not only takes up more memory but also requires significant time. If you only need data from one or a few files within the zip file, extracting everything is inefficient.

Below, we demonstrate how to use Python’s `zipfile` library to selectively access specific data without unzipping the entire archive. 

Let us look at this example where we want to extract a subset of files from a directory of [EDGAR](https://www.sec.gov/dera/data/financial-statement-data-sets.html){target="_blank"} zip files.
 
## Solution: Use `ZipFile`

The powerful Python package [`zipfile`](https://docs.python.org/3/library/zipfile.html){target="_blank"} allows you to work efficiently with zip files by extracting the files you need without unzipping them.

### Installation
To use the library, install it as shown below:
``` bash title="Terminal Command"
pip install zipfile
```

### Viewing the Contents of a Zip File
You can inspect the contents of a zip file without unzipping it:

```python title="Python Code"
import pandas as pd
import os
from zipfile import ZipFile

file_name='2022_04_notes.zip'
with ZipFile(file_name, 'r') as edgar:
    edgar.printdir()
```

```{.yaml .no-copy title="Output"}
File Name                                             Modified             Size
sub.tsv                                        2022-05-01 15:35:42      2177048
tag.tsv                                        2022-05-01 15:35:42     59022625
dim.tsv                                        2022-05-01 15:35:44     25304351
ren.tsv                                        2022-05-01 15:35:44     33408100
cal.tsv                                        2022-05-01 15:35:46     27885932
pre.tsv                                        2022-05-01 15:35:46    204826805
num.tsv                                        2022-05-01 15:35:52    325109088
txt.tsv                                        2022-05-01 15:36:08    325066949
readme.htm                                     2022-05-01 15:36:22       267323
notes-metadata.json                            2022-05-01 15:36:22        67978
```

### Extracting Specific Data Without Unzipping
Suppose you have a directory of zip files like the one below, and you want to extract only the first line from the `txt.tsv` file in each zip file. You can use the `zipfile` library to achieve this:

```python title="Python Code"
#This path is representative of whichever data directory you would like to read from
print(os.listdir('/zfs/data/Edgar_xbrl/'))
```

```{ .yaml .no-copy title="Output"}
['2014q3_notes.zip', '2014q2_notes.zip', '2016q4_notes.zip', '2019q4_notes.zip', '2014q1_notes.zip', '2009q4_notes.zip', '2009q3_notes.zip', '2019q2_notes.zip', '2022_08_notes.zip', '2016q2_notes.zip', '2009q2_notes.zip', '2016q3_notes.zip', '2022_09_notes.zip', '2019q3_notes.zip', '2021_08_notes.zip', '2009q1_notes.zip', '2021_09_notes.zip', '2014q4_notes.zip', '2019q1_notes.zip', '2016q1_notes.zip', '2012q4_notes.zip', '2021_07_notes.zip', '2020q3_notes.zip', '2022_05_notes.zip', '2010q1_notes.zip', '2021_06_notes.zip', '2020q2_notes.zip', '2022_04_notes.zip', '2020q1_notes.zip', '2021_05_notes.zip', '2010q3_notes.zip', '2022_07_notes.zip', '2021_04_notes.zip', '2010q2_notes.zip', '2022_06_notes.zip', '2022_01_notes.zip', '2021_03_notes.zip', '2010q4_notes.zip', '2012q1_notes.zip', '2021_02_notes.zip', '2022_03_notes.zip', '2021_01_notes.zip', '2012q2_notes.zip', '2022_02_notes.zip', '2012q3_notes.zip', '2011q2_notes.zip', '2021_12_notes.zip', '2011q3_notes.zip', '2020_12_notes.zip', '2021_10_notes.zip', '2020_11_notes.zip', '2021_11_notes.zip', '2011q1_notes.zip', '2013q4_notes.zip', '2020_10_notes.zip', '2013q3_notes.zip', '2013q2_notes.zip', '2013q1_notes.zip', '2011q4_notes.zip', '2015q1_notes.zip', '2018q4_notes.zip', '2017q4_notes.zip', '2015q2_notes.zip', '2015q3_notes.zip', '2017q1_notes.zip', '2018q1_notes.zip', '2015q4_notes.zip', '2018q3_notes.zip', '2017q3_notes.zip', '2017q2_notes.zip', '2018q2_notes.zip']
```

```python title="Python Code"
firstline=[]
for i in os.listdir('/zfs/data/Edgar_xbrl/'):
    with ZipFile(file_name, 'r') as edgar:
        with edgar.open('txt.tsv','r') as tab_file:
            column_headers=tab_file.readline().decode('utf-8').split('\t') # column names
            first=tab_file.readline().decode('utf-8').split('\t') # first row
            firstline.append(first)

data=pd.DataFrame(firstline,columns=column_headers)
data.head()
```

The resulting DataFrame will contain the extracted first lines of the `txt.tsv` files from all zip files:

![Resulting DataFrame](/assets/images/Finalzip.jpg)

## Summary
Using the zipfile library, you can efficiently extract specific data from zip files without unzipping them entirely. This method saves disk space and time by utilizing transient RAM for temporary operations.

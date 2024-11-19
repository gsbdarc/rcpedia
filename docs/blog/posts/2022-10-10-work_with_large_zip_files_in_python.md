[request one for them](https://uit.stanford.edu/service/sponsorship){:target="_blank"}

---
title: Working with Large Zip Files in Python
layout: indexPages/topicGuides
subHeader: Data, Analytics, and Research Computing.
keywords: zipfiles, python,
category: topicGuides
parent: topicGuides
order: 1
updateDate: 2022-10-10
---



# {{ page.title }}


### How to work with large zip files **without** unzipping them, using the `zipfile` python library
<br>
## Problem
You want to access some data in the zip files, but you do not want to copy the zip file over to your home/project directory and unzip it. How would you go about accessing this data?

This is our current working directory of files. It contains two notebooks, a sample zip file, and that file unzipped in `zipcontents`.
<br>


``` bash 
$ tree
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


Let us first look at the size differences. The `du` command can help us understand how much memory each file type is using. Below, we check the sizes of the orginal zip file `2022_04_notes.zip` and its unzipped version `zipcontents` 


``` bash 
$ du -sh 2022_04_notes.zip
189M    2022_04_notes.zip
```
<br>

```bash 
$ du -sh zipcontents
367M    zipcontents
```

When we look at the disk usage of the unzipped file compared with the zipped file, the difference is a little under 2X. 
Extracting an entire zipped folder with an extensive directory of files can take not only more memory but also a significant amount of time. If you only need data from one or a handful of the files in the zipped file, it is an inefficient use of time and storage to extract everything. 
Below, we illustrate how you can use the `zipfile` Python package to selectively extract data from any zip file without extracting all the contents. Let us look at this example where we want to extract a subset of files from a directory 
of [EDGAR](https://www.sec.gov/dera/data/financial-statement-data-sets.html) zip files. 
 
### Using `ZipFile`

The powerful python package [`zipfile`](https://docs.python.org/3/library/zipfile.html) allows you to work efficiently with zip files by extracting the files you need without unzipping them.

<br>
``` bash
$ pip install zipfile
```

First, we can use `zipfile` to observe what the zip file contains without unzipping it.


```python
import pandas as pd
import os
from zipfile import ZipFile

file_name='2022_04_notes.zip'
with ZipFile(file_name, 'r') as edgar:
    edgar.printdir()
```

```
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
Above, we could look at the zip file's contents without explicitly unzipping it. Now what if we have a large corpus of zip files (shown below) whose contents are similar to the above file?
What if you would like to extract the first line from each txt.tsv file in these zip files? Using the `zipfile` library, we can loop through every zip file in the directory, open it, and take the headers and first line of txt.tsv without using the unzip command.

``` python 
#This path is representative of whichever data directory you would like to read from
print(os.listdir('/zfs/data/Edgar_xbrl/'))
```
```
['2014q3_notes.zip', '2014q2_notes.zip', '2016q4_notes.zip', '2019q4_notes.zip', '2014q1_notes.zip', '2009q4_notes.zip', '2009q3_notes.zip', '2019q2_notes.zip', '2022_08_notes.zip', '2016q2_notes.zip', '2009q2_notes.zip', '2016q3_notes.zip', '2022_09_notes.zip', '2019q3_notes.zip', '2021_08_notes.zip', '2009q1_notes.zip', '2021_09_notes.zip', '2014q4_notes.zip', '2019q1_notes.zip', '2016q1_notes.zip', '2012q4_notes.zip', '2021_07_notes.zip', '2020q3_notes.zip', '2022_05_notes.zip', '2010q1_notes.zip', '2021_06_notes.zip', '2020q2_notes.zip', '2022_04_notes.zip', '2020q1_notes.zip', '2021_05_notes.zip', '2010q3_notes.zip', '2022_07_notes.zip', '2021_04_notes.zip', '2010q2_notes.zip', '2022_06_notes.zip', '2022_01_notes.zip', '2021_03_notes.zip', '2010q4_notes.zip', '2012q1_notes.zip', '2021_02_notes.zip', '2022_03_notes.zip', '2021_01_notes.zip', '2012q2_notes.zip', '2022_02_notes.zip', '2012q3_notes.zip', '2011q2_notes.zip', '2021_12_notes.zip', '2011q3_notes.zip', '2020_12_notes.zip', '2021_10_notes.zip', '2020_11_notes.zip', '2021_11_notes.zip', '2011q1_notes.zip', '2013q4_notes.zip', '2020_10_notes.zip', '2013q3_notes.zip', '2013q2_notes.zip', '2013q1_notes.zip', '2011q4_notes.zip', '2015q1_notes.zip', '2018q4_notes.zip', '2017q4_notes.zip', '2015q2_notes.zip', '2015q3_notes.zip', '2017q1_notes.zip', '2018q1_notes.zip', '2015q4_notes.zip', '2018q3_notes.zip', '2017q3_notes.zip', '2017q2_notes.zip', '2018q2_notes.zip']
```
``` python 
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

![image.png](/images/Finalzip.jpg)
<br>
As you can see, with only a few lines of code, we were able to pull any data from this directory of zip files. 
This allows us to utilize the transitory RAM rather than unzipping the full contents of each file to disk.

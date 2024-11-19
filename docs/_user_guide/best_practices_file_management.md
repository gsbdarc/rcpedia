# File Management

A research project’s working directory can quickly become cluttered and disorganized if files are not managed carefully. Without proper naming conventions or organization, you might find yourself dealing with thousands of cryptically named files like `1.csv`, `2.csv`, `10.csv`, `100.csv`, and so on, all stored in one directory without any meaningful index or metadata to describe their contents. This issue is especially common when running automated tasks that rapidly generate data. Such disorganization can lead to confusion for researchers and introduce risks, such as errors in processes that monitor the file system or difficulties during audits.

To prevent these challenges, here are some best practices for managing files in a project directory.

## Limit the Number of Files in One Directory

One of the most common pitfalls in file management is storing tens of thousands of files in a single folder. While this may initially seem harmless—since most operating systems do not warn against it—it can severely degrade the performance of the file system and the tools that interact with it. For example, simple operations like listing directory contents (`ls`) can become painfully slow or even unresponsive. Additionally, tools designed for disaster recovery, such as those that create backup copies of files, can struggle to process such directories, potentially failing and impacting all users. To avoid these issues, it’s far more effective to organize files into multiple subdirectories, each containing only a few thousand files at most. This approach ensures smoother system performance and more reliable tool operation.

!!! Tips 
    If running `ls` on a directory takes more than a few seconds to complete, then you should consider splitting up the files in that directory into multiple folders.

## Build a Directory Structure

In addition to addressing performance issues, organizing files into multiple directories enhances the intuitive structure of your data, making it easier to navigate and manage. For instance, imagine you're collecting text from over 100,000 news articles, where each article has a unique identifier composed of the publication date and an additional number, such as `20111009-91`. Instead of dumping all the resulting text files into a single folder, you can leverage the information in the identifier to create a logical and efficient directory hierarchy. Here's an example:

```{.yaml .no-copy}
data
│   README.md
│   index.csv    
│
└───2010
│   └───01
│       │   20100105-10.txt
│       │   20100106-12.txt
│       │   ...
│   │   ...
│   └───10
│       │   20101002-100.txt
│       │   ...  
└───2011
│   └───03
│       │   20110312-5.txt
│       │   20110315-200.txt
│       │   ...
│...
```
In this structure, the `data` directory is organized first by year and then by month, based on the article's identifier. If you anticipate that the number of articles for a single month could exceed several thousand, you can further subdivide by day to distribute the files more evenly and maintain folder performance. This approach not only improves file system efficiency but also ensures your data is more comprehensible and accessible to users.

## Create an Index File
A common justification for placing all data files in a single directory is the perceived simplicity of processing them with a script. In this approach, a user can provide a single path to the script, which then lists the directory contents to process the files. While this may seem convenient, there's a much more efficient and scalable solution: creating an index file.

An index file is a structured list of all files in your directory hierarchy, often generated while populating the directories with data. This file can be fed to your processing script just as easily as a directory path, but it offers several key advantages. Loading an index file is much faster than querying a directory bloated with thousands of files. Additionally, an index file can store valuable metadata about the data files, such as information that isn’t evident from their filenames or directory structure.

For example, consider the following CSV index file for the aforementioned news articles:

| filename | filepath | year | month | day | title | processed? |
| -------- | -------- | ---- | ----- | ---- | ----- | ---------- |
| 20100105-10.txt | data/2010/01/ | 2010 | 1 | 5 | Incumbent Mayor Loses Election | True 
| 20100106-12.txt | data/2010/01/ | 2010 | 1 | 6 | Mayor Elect: "Changes Coming Soon" | False
| 20101002-100.txt | data/2010/10/ | 2010 | 10 | 2 | New Program Tested at Local Middle School | False
| 20110312-5.txt | data/2011/03/ | 2011 | 3 | 12 | 39-year Veteran Officer Passes Away | True
| 20110315-200.txt | data/2011/03/ | 2011 | 3 | 15 | Crab Fest This Weekend! | True

In this example, the `title` column provides meaningful metadata about each article, while the `processed?` column tracks whether a file has already been processed by the script. This feature not only improves data management but also facilitates advanced workflows, such as parallel processing or integration with job submission systems.

By adopting index files, you combine the ease of data processing with the flexibility and efficiency of a well-organized directory structure. This approach ensures your project remains scalable and maintainable as your dataset grows.

## Compress or Remove Large, Unused Directories
Large directories from completed projects are often forgotten and left behind, creating unnecessary burdens on backup and auditing tools and complicating future file transfers to other systems. To prevent these issues, it’s essential to take deliberate action once you’ve finished with a project:

- **If you’re certain you won’t need the files again**, delete the large directories to free up valuable storage space for other researchers or team members.

- **If there’s a chance you might need the files in the future, but not anytime soon**, compress your files to reduce their storage footprint. This practice not only conserves space but also makes it easier to transfer or archive your data when necessary.

For detailed instructions on archiving a project directory, refer to this [guide](/_user_guide/best_practices_archive){:target="_blank"}. By following these steps, you can contribute to a cleaner, more efficient storage system while ensuring your data remains accessible if needed.

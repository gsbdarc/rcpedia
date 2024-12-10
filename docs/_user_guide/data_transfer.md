# Data Transfer on the Yens

Data transfer is an essential part of working with the Yens. You may need to transfer data to and from the Yens for various reasons, such as uploading datasets, downloading results, or sharing files with collaborators. There are several methods for transferring data to and from the Yens, each with its own advantages and use cases. It's important to understand that storage on the interactive Yens is shared therefore you may access data from storage on any Yen.

The Yen HPC environment is a shared resource with limited storage capacity and network bandwidth. To minimize the impact of data transfers on other users, we strongly recommend using the dedicated data transfer node, accessible at ```yen-transfer.stanford.edu```. This node is specifically designed for efficient and less disruptive data movement to and from the Yen systems.

This page will cover some of the best practices for transferring data to and from the Yens.

!!! Warning
	Remember you only have 50GB of space in your home folder.


## Uploading files via JupyterHub

If you’re working with smaller files, the most straightforward method is to upload them directly through JupyterHub. To do this, open JupyterHub in your web browser, navigate to the directory where you want the files to reside, and then click the "Upload" button. From there, select the files on your local machine to begin the transfer. Keep in mind that this method is limited to files of approximately 100 MB, and can be slow and inefficient for larger files, it will also discontinue if you close the browser tab.



![Uploading files via JupyterHub](/assets/images/data_transfer_jupyterhub_upload.png){:target="_blank"}


!!! Warning
    Uploading large files through JupyterHub can be slow and may cause performance issues for other users. For large files, it is recommended to use the Data Transfer Node or other methods described below.

## SCP

The `scp` (Secure Copy) command allows you to securely transfer files between your local machine and the Yen servers. It uses `ssh` for authentication and encryption. To use `scp`, you specify a source path and a destination path:

```title="Local Terminal Command"
scp <source_path> <destination_path>
```

!!! Tip 
    Yen path either source or destination is usually |SUNET|@yen-transfer.stanford.edu:|FOLDER PATH|
- **Local to Remote:** When transferring files from your local machine to the Yen servers, the `<source_path>` is a path on your local machine, and the `<destination_path>` is a path on the Yen servers.
- **Remote to Local:** When copying files from the Yen servers to your local machine, reverse this: the `<source_path>` refers to a path on the Yen servers, and the `<destination_path>` is a path on your local machine.

!!! Note
    You will need to authenticate when initiating transfers using scp.

#### SCP Example: Single File

To transfer a single file named `mydata.txt` from your local machine to your project space on the Yen servers, run:

```title="Local Terminal Command"
scp mydata.txt <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```
In this example, replace <SUNetID> with your actual SUNet ID and <my_project_dir> with the name of your project directory on the Yen file system.

#### SCP Example: Multiple Files

To transfer multiple files in one go (for example, all `.csv` files in your current directory)

```title="Local Terminal Command"
scp *.csv <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```

#### Transferring Folders to Yen Servers
To transfer an entire folder (directory) from your local machine to the Yen servers, use the `-r` flag (which stands for “recursive”). First, navigate (`cd`) on your local machine to the parent directory of the folder you want to transfer. Then run:

```title="Local Terminal Command"
scp -r my_folder/ <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```

Let's illustrate this with an example. We'll create an empty folder called `test_from_local` and transfer it to the home directory on Yen servers:

```title="Local Terminal Command"
mkdir test_from_local
scp -r test_from_local/ <SUNetID>@yen-transfer.stanford.edu:~
```
Here, `~` refers to your home directory on the Yen servers.

#### Transferring Files from Yen Servers
To copy files from the Yen servers to your local machine, the `<source_path>` will refer to files/folders on the Yen servers, and `<destination_path>` will be a path on your local machine.

1. Open a terminal on your local machine (do not ssh into the Yen servers).
2. Use the cd command locally to navigate to the directory where you want the files to be saved.
3. Run:
    
```title="Local Terminal Command"
scp -r <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>/results .
```

In this command, `.` represents the current local directory. This will copy the results folder from your project directory on the Yen servers to your current local directory. If you’re transferring individual files rather than entire directories, you can omit the `-r` flag. To transfer multiple files matching a pattern, use the `*` wildcard.


!!! Tip 
    The Yen servers have a dedicated data transfer node, `yen-transfer.stanford.edu`, which is optimized for efficient data transfer. Use this node for faster and more reliable data transfers.

## Rsync

`rsync` is another excellent option for efficient and reliable file transfers. Unlike `scp`, `rsync` only copies the differences between source and destination files, greatly speeding up re-transfers of partially completed uploads or downloads. It operates over `ssh` and thus requires the same authentication process as `scp`.


Key flags commonly used with `rsync`:

- `-a:` Archive mode, which includes recursive copying and preserves permissions, timestamps, and symbolic links. This is essentially a combination of several other flags.
- `-P:` Shows progress during the transfer and enables resuming interrupted transfers.
- `-n:` Dry-run mode, which simulates the transfer without actually copying files. This is useful for previewing the changes that `rsync` will make. Usually paired with `-v` (verbose) to see the list of files that would be transferred.


#### Transferring Files to Yen Servers
To transfer a file (e.g., `myfile.csv`) from your local machine, use:

```title="Local Terminal Command"
rsync -aP myfile.csv <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```
You will be prompted to authenticate.

#### Transferring Folders to Yen Servers
To transfer a folder, the `-a` (archive mode) flag is a comprehensive option that preserves file permissions, timestamps, and will provide recursive behavior similar to the `-r` flag. The `-P` flag shows the progress of the transfer and allows you to resume interrupted transfers. 

```title="Local Terminal Command"
rsync -aP myfolder/ <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>/myfolder
```

#### Transferring Files from Yen Servers
To copy a file (e.g., `my_remote_file.csv`) from Yen servers to your local machine, use:

```title="Yen Terminal Command"
rsync -aP <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>/my_remote_file.csv .
```
To copy a folder, use the following command:


```title="Local Terminal Command"
rsync -aP <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>/my_remote_folder/ myfolder/
```

The above command will copy a folder named `my_remote_folder` on ZFS in `/zfs/projects/students/<my_project_dir>` to the current working directory on your local machine and name the folder `myfolder`.


## Globus
[Globus](https://www.globus.org/) is a high-performance, secure file transfer service that allows you to transfer large amounts of data to and from the Yens. It is particularly useful for transferring large datasets, as it can optimize transfer settings for large files and handle network interruptions gracefully.

#### Transferring data to the Yens

1. Login to [Globus Web App](https://app.globus.org/) to setup a transfer to the Yens.

    ![The Globus login homepage](/assets/images/globus-login.png)

2. Once you login with your Stanford account, you can set up a transfer by using the File Manager tab.

    ![The Globus File manager page](/assets/images/file-manager.png)

3. On the right-hand side, search for `GSB-Yen` Collection to transfer to. If successful, your yen
home directory will be listed and you can navigate to the folder to which you want to transfer the data.

    ![The Yen endpoint](/assets/images/gsb-yen-endpoint.png)

4. On the left-hand side, search for endpoint to transfer data from. For example, if another institution shared a Globus
endpoint with you, search for it under Collection. If you are transferring data from your laptop, use your Globus Connect Personal
 endpoint.  
 
5. Lastly, hit the Start button to commence the data transfer. You will get an email when transfer is complete. 

6. Under Transfer & Timer Options, you can setup a sync or a repeating transfer as needed for your use case. 

7. In Activity Tab, you can see how the transfer is going and if there are any errors. 

#### Setting up globus on your laptop 

To setup a data transfer from your personal computer to the Yens, first download [globus Connect Personal](https://app.globus.org/file-manager/gcp){:target="_blank"}
for your operating system and install it on your computer.

If installed correctly, you should see your personal Globus endpoint under Collections in the globus web app.

![Personal Globus Endpoint](/assets/images/personal-globus.png)

You can now search for your personal endpoint when setting up a file transfer to the Yens.

## LFTP

**FTP (File Transfer Protocol)** is a standard network protocol used to transfer files between a client and a server over the internet or a local network. People use it to upload, download, or manage files, especially for website maintenance or large data transfers.  Due to security concerns, the Yen servers cannot host a FTP server – you can, however, use an FTP client to connect to an external server that is hosting data. We recommend using **lftp**, a powerful command-line FTP client that supports advanced features like secure transfers, parallel downloads, resumable transfers, and scripting, making it a preferred choice for efficient and reliable file transfers.


## Rclone
Rclone is a command-line program used to manage files on cloud storage. It supports various cloud storage providers and allows users to transfer, sync, and backup data efficiently. Rclone is particularly useful for archiving data to cloud storage providers like Google Drive and Amazon S3.

Check out the our [**rclone blog**](/blog/2023/09/18/rclone-files-from-yens-to-google-drive/) post for more information on how to use rclone to transfer data to and from the Yens.

## Summary of Best Practices
| **File Size/Transfer Scenario**            | **Recommended Methods**                                                                 | **Explanation**                                                                                                                                                                |
|--------------------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Files less than 100 MB**                   | Upload via JupyterHub or use `scp`.                                                    | For small files, simple methods like uploading directly through JupyterHub or using `scp` (Secure Copy Protocol) are quick, straightforward, and efficient.                   |
| **Files between 100 MB and 10 GB**           | Use `scp` over the Data Transfer Node (`yen-transfer`).                                 | Transferring directly to the Data Transfer Node ensures faster speeds and reduces load on the interactive nodes. `scp` remains effective for these moderately sized files, **provided you have stable internet connection**.     |
| **Files between 10 GB and 50 GB**          | Use `rsync` over the Data Transfer Node or `scp` with the `-C` (compression) option.    | `rsync` is more efficient for larger datasets because it can resume interrupted transfers and only copies changed parts of files. Using `scp -C` enables compression.          |
| **Files between 50 GB and 1 TB**           | Use Globus or `rsync` over the Data Transfer Node.                                      | Globus is designed for transferring large datasets reliably and efficiently. It handles network interruptions gracefully and optimizes transfer settings for large files.       |
| **Files larger than 1 TB**                 | Use Globus.                                                                            | For very large datasets, Globus provides high-performance, secure transfers with features like parallelism and checkpoints, which are essential for handling transfers of this scale. |
| **Cloud Transfers**                        | Use RClone with a cloud "remote" (e.g Google drive)                                   | RClone efficiently syncs data to cloud storage providers, making it suitable for working with a cloud provider|                                                                                                                                                                          |
| **Transferring Data from FTP Servers**     | Use LFTP.                                                                              | LFTP is a sophisticated file transfer program that supports various protocols, including FTP and SFTP, making it ideal for transfers from FTP servers.                         |

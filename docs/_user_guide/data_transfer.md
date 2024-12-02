# Data Transfer on the Yens

The yens are shared systems with a finite amount of storage, and more importantly, **a finite amount of bandwidth**.  This means that we need to be careful about how we transfer data to and from the yens. The best and least disruptive way to transfer data on the yens is through use of the data transfer node on the yens. This node can be access by ssh from any yen with the following command.

```title="Yen Terminal Command"
<SUNetID>@yen-transfer.stanford.edu
```

This page will cover some of the best practices for transferring data to and from the yens.

!!! Warning
	Remember you only have 50GB of space in your home folder.


## Uploading files via JupyterHub

The simplest way to transfer files to the Yens is to upload them directly through JupyterHub. To upload files, open JupyterHub in your web browser and navigate to the directory where you want to upload the files. Click the "Upload" button and select the files you want to upload from your local machine.



![Uploading files via JupyterHub](/assets/images/data_transfer_jupyterhub_upload.png){:target="_blank"}


!!! Warning
    Uploading large files through JupyterHub can be slow and may cause performance issues for other users. For large files, it is recommended to use the Data Transfer Node or other methods described below.

## SCP

To transfer one or more files, you can use the `scp` command. The `scp` command takes two arguments, the source path (what files or directories you are copying) and the destination path (where the files/directories will be copied to). 

```title="Terminal Command"
$ scp <source_path> <destination_path>
```

When transferring data to the Yens from your local machine, the `<source_path>` is the path to the file(s) on your local computer while the `<destination_path>` is the path on the Yens where the files from your local machine will be transferred to. 

For instance, to transfer a file named `mydata.txt` to your project space on Yen servers, execute:

```title="Local Terminal Command"
scp mydata.txt <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```
The `scp` command uses `ssh` for file transfer, so you'll be prompted for your password and Duo authentication.

If you want to transfer all CSV files from a particular directory, use the following:

```title="Terminal Command"
scp *.csv <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```

!!! Tip 
    `scp` command above uses `yen.stanford.edu` which means the transfer will go through the interactive yens. For faster transfers, we can use `yen-transfer` node.

To use the Yen Data Transfer Node, we can modify the `scp` command as follows:


```title="Terminal Command"
scp *.csv <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```

#### SCP Example
Let's transfer a `my_file.txt` from your local machine to the Yen servers.
On your local machine, in a terminal, run:

```title="Local Terminal Command"
touch my_file.txt
scp my_file.txt <SUNetID>@yen.stanford.edu:~
```
where `~` is your Yen home directory shortcut. Enter your SUNet ID password and Duo authenticate for the file transfer to complete.

#### Transferring Folders to Yen Servers
On your local machine, open a new terminal and navigate to the parent directory of the folder that 
you want to transfer to the Yens with the `cd` command.

Once you are in the parent directory of the folder you want to transfer, run the following to copy the folder to the Yens:

```title="Local Terminal Command"
scp -r my_folder/ <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```
The `-r` flag is used to copy folders (**r**ecursively copy files). Replace `<SUNetID>` with your SUNet ID and `<my_project_dir>` with the destination path on the Yen's file system, ZFS. 

Let's illustrate this with an example. We'll create an empty folder called `test_from_local` and transfer it to the home directory on Yen servers:

```title="Local Terminal Command"
mkdir test_from_local
scp -r test_from_local/ <SUNetID>@yen.stanford.edu:~
```

#### Transferring Files from Yen Servers
When transferring data from the Yens to your local machine, the `<source_path>` is the path to the file(s) on the Yens while the `<destination_path>` is the path on your local machine where the files from the Yens will be transferred to.

To copy files from Yen servers to your local machine, open a new terminal without connecting to the Yens. Use the `cd` command to navigate to the local directory where you want to copy the files to. Then run: 

```title="Local Terminal Command"
cd my_local_folder
scp -r <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>/results .
```

In this example, we're copying the `results` folder from the Yen's ZFS file system to your local directory ( ++period++ signifies the current directory). If you're copying files (not directories), omit the `-r` flag. To transfer multiple files, use the wildcard `*` to match several files.


## Rsync
Another option for more reliable transfers is `rsync`. `rsync` is a utility for efficiently transferring and synchronizing files between two locations. It is faster than `scp` because it only copies the differences between files. This means that if a file is partially transferred, `rsync` will only copy the remaining part of the file, rather than retransferring the entire file.


#### Transferring Files to Yen Servers
To transfer a file (e.g., `myfile.csv`) from your local machine, use:

```title="Local Terminal Command"
rsync -aP myfile.csv <SUNetID>@yen-transfer.stanford.edu::/zfs/projects/students/<my_project_dir>
```
You'll be prompted to enter your password and complete the two-step authentication process.

#### Transferring Folders to Yen Servers
To transfer a folder, add the recursive flag (`-r`) to `rsync`:

```title="Local Terminal Command"
rsync -aP myfolder/ <SUNetID>@yen-transfer.stanford.edu::/zfs/projects/students/<my_project_dir>/myfolder
```

#### Transferring Files from Yen Servers
To copy a file (e.g., `my_remote_file.csv`) from Yen servers to your local machine, use:

```title="Yen Terminal Command"
rsync -aP <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>/my_remote_file.csv .
```

For transferring folders from Yen servers, include the `-r` flag:

```title="Terminal Command"
rsync -aPr <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>/my_remote_folder/ myfolder/
```

The above command will copy a folder named `my_remote_folder` on ZFS in `/zfs/projects/students/<my_project_dir>` to the current working directory on your local machine and name the folder `myfolder`.


## Globus
[Globus](https://www.globus.org/) is a high-performance, secure file transfer service that allows you to transfer large amounts of data to and from the Yens. It is particularly useful for transferring large datasets, as it can optimize transfer settings for large files and handle network interruptions gracefully.

#### Transferring data to the Yens

1. Login to [Globus Web App](https://app.globus.org/) to setup a transfer to the yens.

    ![The Globus login homepage](/assets/images/globus-login.png)

2. Once you login with your Stanford account, you can set up a transfer by using the File Manager tab.

    ![The Globus File manager page](/assets/images/file-manager.png)

3. On the right-hand side, search for `GSB-Yen` Collection to transfer to. If successful, your yen
home directory will be listed and you can navigate to the folder to you want to transfer the data to.

    ![The Yen endpoint](/assets/images/gsb-yen-endpoint.png)

4. On the left-hand side, search for endpoint to transfer data from. For example, if another institution shared a Globus
endpoint with you, search for it under Collection. If you are transferring data from your laptop, use your globus Connect Personal
 endpoint.  
 
5. Lastly, hit the Start button to commence the data transfer. You will get an email when transfer is complete. 

6. Under Transfer & Timer Options, you can setup a sync or a repeating transfer as needed for your use case. 

7. In Activity Tab, you can see how the transfer is going and if there are any errors. 

#### Setting up globus on your laptop 

To setup a data transfer from your personal computer to the yens, first download [globus Connect Personal](https://app.globus.org/file-manager/gcp){:target="_blank"}
for your operating system and install it on your computer.

If installed correctly, you should see your personal Globus endpoint under Collections in the globus web app.

![Personal Globus Endpoint](/assets/images/personal-globus.png)

You can now search for your personal endpoint when setting up a file transfer to the yens.

## LFTP

FTP (File Transfer Protocol) is a standard network protocol used to transfer files between a client and a server over the internet or a local network. People use it to upload, download, or manage files, especially for website maintenance or large data transfers.  Due to security concerns, the Yen servers cannot host a FTP server – you can, however, use an FTP client to connect to an external server that is hosting data. We recommend using lftp, a powerful command-line FTP client that supports advanced features like secure transfers, parallel downloads, resumable transfers, and scripting, making it a preferred choice for efficient and reliable file transfers.

### SSH into the Server
```title="Terminal Command"
ssh yen.stanford.edu
```

---
### Change Directory download or upload directory (this is on your receiving machine)

```title="Terminal Command"
cd /zfs/projects/faculty/hello-world/PROVIDER
```

---
!!! Tip
     Enter into a [screen](/_user_guide/best_practices_screen/){:target="_blank"} to run jobs in the background

### Connect to provider FTP Server
```title="Terminal Command"
lftp sftp://userName@someFTPserver.com:22
```

At the password prompt enter in the password
```title="Terminal Command"
someEpicPassword
```
---

### Download files from provider
Navigate to the download folder.
```title="LFTP Terminal Command"
cd /foo/bar
```

To see files in a folder
```title="LFTP Terminal Command"
ls
```

To download a single file
```title="LFTP Terminal Command"
get filename.bla
```

To download a batch of files
```title="LFTP Terminal Command"
mget *.csv
```
---
### Upload to the provider
Navigate to the upload folder.
```title="LFTP Terminal Command"
cd ToTU
```

To upload a single file
```title="LFTP Terminal Command"
put filename.bla
```

To upload a batch of files
```title="LFTP Terminal Command"
mput *.csv
```

## Rclone
Rclone is a command-line program used to manage files on cloud storage. It supports various cloud storage providers and allows users to transfer, sync, and backup data efficiently. Rclone is particularly useful for archiving data to cloud storage providers like Google Drive and Amazon S3.

Check out the our [**rclone blog**](/blog/2023/09/18/rclone-files-from-yens-to-google-drive/) post for more information on how to use rclone to transfer data to and from the yens.

## General Guidelines
| **File Size/Transfer Scenario**            | **Recommended Methods**                                                                 | **Explanation**                                                                                                                                                                |
|--------------------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Files less than 1 GB**                   | Upload via JupyterHub or use `scp`.                                                    | For small files, simple methods like uploading directly through JupyterHub or using `scp` (Secure Copy Protocol) are quick, straightforward, and efficient.                   |
| **Files between 1 GB and 10 GB**           | Use `scp` over the Data Transfer Node (`yen-transfer`).                                 | Transferring directly to the Data Transfer Node ensures faster speeds and reduces load on the interactive nodes. `scp` remains effective for these moderately sized files.     |
| **Files between 10 GB and 50 GB**          | Use `rsync` over the Data Transfer Node or `scp` with the `-C` (compression) option.    | `rsync` is more efficient for larger datasets because it can resume interrupted transfers and only copies changed parts of files. Using `scp -C` enables compression.          |
| **Files between 50 GB and 1 TB**           | Use Globus or `rsync` over the Data Transfer Node.                                      | Globus is designed for transferring large datasets reliably and efficiently. It handles network interruptions gracefully and optimizes transfer settings for large files.       |
| **Files larger than 1 TB**                 | Use Globus.                                                                            | For very large datasets, Globus provides high-performance, secure transfers with features like parallelism and checkpointing, which are essential for handling transfers of this scale. |
| **Cloud Transfers**                        | Use RClone with Google Drive for archiving                                      | RClone efficiently syncs data to cloud storage providers, making it suitable for archiving or cloud backups|                                                                                                                                                                          |
| **Transferring Data from FTP Servers**     | Use LFTP.                                                                              | LFTP is a sophisticated file transfer program that supports various protocols, including FTP and SFTP, making it ideal for transfers from FTP servers.                         |

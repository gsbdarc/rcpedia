# Data Transfer on the Yens

The yens are a shared systems with a finite amount of storage, and more importantly, **a finite amount of bandwidth**.  This means that we need to be careful about how we transfer data to and from the yens.  This page will cover some of the best practices for transferring data to and from the yens.

### General Guidelines
1. **Files less than 1 GB**:

    * *Recommended Methods*: Upload via JupyterHub or use scp.
    * *Explanation*: For small files, simple methods like uploading directly through JupyterHub or using scp (Secure Copy Protocol) are quick, straightforward, and efficient.

2. **Files between 1 GB and 10 GB**:
    - *Recommended Methods*: Use scp over the Data Transfer Node (yen-transfer).
    - *Explanation*: As file sizes increase, transferring directly to the Data Transfer Node ensures faster speeds and reduces load on the interactive nodes. scp remains effective for these moderately sized files.

3. **Files between 10 GB and 100 GB**:
    - *Recommended Methods*: Use rsync over the Data Transfer Node or scp with the -C (compression) option.
    - *Explanation*: rsync is more efficient for larger datasets because it can resume interrupted transfers and only copies changed parts of files. Using scp -C enables compression during transfer, speeding up the process.
4. **Files between 100 GB and 1 TB**:

    - *Recommended Methods*: Use Globus or rsync over the Data Transfer Node.
    - *Explanation*: Globus is designed for transferring large datasets reliably and efficiently. It handles network interruptions gracefully and can optimize transfer settings for large files.
5. **Files larger than 1 TB**:

    - *Recommended Methods*: Use Globus.
    - *Explanation*: For very large datasets, Globus provides high-performance, secure transfers with features like parallelism and checkpointing, which are essential for handling transfers of this scale.
6. **Archiving Data or Cloud Transfers**:
    - *Recommended Methods*:
        - Use RClone with Google Drive for archiving.
        - Use AWS CLI or RClone for transfers to AWS S3.
        - Explanation: RClone efficiently syncs data to cloud storage providers, making it suitable for archiving or cloud backups. AWS CLI is specifically tailored for interactions with AWS services.
7. **Transferring Data from FTP Servers**:
    - *Recommended Methods*: Use LFTP.
    - *Explanation*: LFTP is a sophisticated file transfer program that supports various protocols, including FTP and SFTP, making it ideal for transfers from FTP servers.


# Globus

[Globus](https://www.globus.org/) lets you transfer large amounts of data to the Yens from different endpoints 
such as your laptop, other institutions or the cloud in a fast and secure manner.


### Transferring data to the Yens

1. Login to [Globus Web App](https://app.globus.org/) to setup a transfer to the yens.

    ![](/images/globus-login.png)

2. Once you login with your Stanford account, you can set up a transfer by using the File Manager tab.

    ![](/images/file-manager.png)

3. On the right-hand side, search for `GSB-Yen` Collection to transfer to. If successful, your yen
home directory will be listed and you can navigate to the folder to you want to transfer the data to.

    ![](/images/gsb-yen-endpoint.png)

4. On the left-hand side, search for endpoint to transfer data from. For example, if another institution shared a Globus
endpoint with you, search for it under Collection. If you are transferring data from your laptop, use your globus Connect Personal
 endpoint.  
 
5. Lastly, hit the Start button to commence the data transfer. You will get an email when transfer is complete. 

6. Under Transfer & Timer Options, you can setup a sync or a repeating transfer as needed for your use case. 

7. In Activity Tab, you can see how the transfer is going and if there are any errors. 

#### Setting up globus on your laptop 

To setup a data transfer from your personal computer to the yens, first download [globus Connect Personal](https://app.globus.org/file-manager/gcp)
for your operating system and install it on your computer.

If installed correctly, you should see your personal Globus endpoint under Collections in the globus web app.

![](/images/personal-globus.png)

You can now search for your personal endpoint when setting up a file transfer to the yens.


# LFTP

### SSH into the Server
```bash
ssh yen.stanford.edu
```

---
### CHANGE DIRECTORY TO DOWNLOAD OR UPLOAD DIRECTORY (this is on your receiving machine)

```bash
cd /zfs/projects/faculty/hello-world/PROVIDER
```

---
### ENTER INTO A SCREEN TO RUN JOBS IN THE BACKGROUND.
** Note, to use screen, you need to use the same server like yen1.

To create a screen
```bash
screen -S helloWorld
```

To detach from a screen hit ‘CTL-a’ and then press ‘d’. So essentially simultaneously pressing the “Control” key and the “a” key, then releasing and then pressing the “d” key.

To reattach to the screen
```bash
screen -ls
```

Find the PID of the screen you want to reattach to. For example, the PID could be 12345.
```bash
screen -R 12345
```
---
### CONNECT TO THE PROVIDER FTP SERVER
```bash
lftp sftp://userName@someFTPserver.com:22
```

At the password prompt enter in the password
```bash
someEpicPassword
```
---
### DOWNLOAD FILES FROM PROVIDER
Navigate to the download folder.
```bash
cd /foo/bar
```

To see files in a folder
```bash
ls
```

To download a single file
```bash
get filename.bla
```

To download a batch of files
```bash
mget *.csv
```
---
### UPLOAD TO PROVIDER
Navigate to the upload folder.
```bash
cd ToTU
```

To upload a single file
```bash
put filename.bla
```

To upload a batch of files
```bash
mput *.csv
```

---
### UNCOMPRESS FILES
Within the folder that holds the zip files.
For one file.
```bash
unzip fileName.zip
```

For multiple files use quote around the wildcard filename.
```bash
unzip "*.zip"
```


# How Do I Transfer Data between Yens and AWS?

If you need to use AWS services from the command line, you will need programmatic access to AWS by way of **keys**.  These will be generated for you by the DARC team, and should be thought of as a username and password.  Anyone with these keys will have access to the resources they grant, so we try to limit the privileges a set of keys has, as well as where they will be effective.

## Your Credentials

Your credentials will have two parts, an Access Key and a Secret Key, like the following:

    AWS Access Key ID: AKIAI44QH8DHBEXAMPLE
    AWS Secret Access Key: je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY

To use them, you will need to follow the setup instructions for the [AWS Command Line Interface (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) or [Boto](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html).

## An example

If we provided keys to you, such as `your.creds`, you can use them in the CLI by setting up a new profile.  Note that you may have multiple profiles to access different resources in AWS, which can be selected from the command line using the `--profile` option.  I can edit my AWS configuration to reflect two different settings, a default set of credentials and one for a new profile, called `athenacopy`.
 
 `~/.aws/config`
```
[default]
region = us-west-2

[profile athenacopy]
region = us-west-2
```

 `~/.aws/credentials`
```
[default]
aws_access_key_id = AK****
aws_secret_access_key = xb*********************

[athenacopy]
aws_access_key_id = AK****
aws_secret_access_key = fB*********************
```

I can then list the S3 buckets that are available to me with my `athenacopy` profile as follows:

```
aws s3 ls --profile athenacopy
```

You can read more about the [s3 API](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#cli-aws-s3) on the AWS CLI documentation.


# Archive Data to Google Drive

Archiving your data to Google Drive (GDrive) using RClone is a free, fast, and secure way to free up on-premises storage. Google Drive can be used with high-risk data following Stanford's [Minimum Security Standards](https://uit.stanford.edu/guide/securitystandards). Our ZFS storage solution is finite, measuring roughly one-half petabyte of space, which means that space is limited to researchers in perpetuity.

{% include note.html content="Google Drive currently limits 750 GB upload/download per user per day.  If you experience an upload stoppage, wait 24 hours and execute the same commands below under \"RClone Common Operations\" to resume the upload/download" %}


## Configuring RClone for Google Drive
You must take the following steps to configure Rclone for your Stanford Google Drive account.  These configuration steps only need to be taken once, and then you can use your new "remote" as a target for copying data.
- Log in using your Stanford credentials. Login instructions can be found [here](/gettingStarted/4_login.html).
- Type `module load rclone && rclone config` The following menu will appear. 

![Config Setup](../images/rclone1.png)

- Select `n` to create a new remote connection to google drive.
When prompted, give it a name; in this example, I'll use `smancusoGoogleDrive`
- The next screen will display all the possible connections with the version of RClone installed on the machine.  This menu changes between versions, so be sure to select the number corresponding to the "Google Drive." 

{% include warning.html content="Additionally, you may see \"Google Cloud Storage\" this is NOT \"Google Drive\", do not select this option." %}

 
![Prompt Map](../images/rclone2.png)

- When prompted for the next two options, leave them blank and hit return/enter.
    - `Google Application Client Id - leave blank normally.`
    - `Google Application Client Secret - leave blank normally.`

- Choose "N" on this prompt "Say N if you are working on a remote or headless machine or Y didn't work." Since the Yen cluster is headless, we must be given a unique URL to validate the connection. 
- On the next prompt, RClone provides you with a unique URL that you need to paste into a browser. After logging in with your Stanford credentials, Google Drive will give a code to paste back into the terminal window.

![Prompt Map](../images/rclone3.png)

- Finally, to finish the configuration in the terminal window setup, click "Y" and "enter" to complete the process if you believe everything is properly setup. In the last prompt, hit "q" to quit. You have setup RClone successfully on your Google Drive.


## RClone Common Operations
### Initiaitaing a current version of RClone
``` bash
ml rclone
```
** OR **  
``` bash
moudle load rclone
```
Note: this needs to be run once per server per terminal session. After you have initiated `module load rclone,` you will only need to call `rclone` as normally from the command line. 

### To list connection points
``` bash
rclone listremotes
```

***Create a remote folder on Google Drive using Rclone. Note this will make the folder within your Google Drive base folder.***
``` bash
rclone mkdir smancusoGoogleDrive:GoogleDriveFolderName
```

***To upload contents of a directory to Google Drive using copy and Rclone.***
``` bash
rclone copy /Path/To/Folder/ smancusoGoogleDrive:GoogleDriveFolderName/
```

***List contents of remote folder on Google Drive***
``` bash
rclone ls smancusoGoogleDrive:GoogleDriveFolderName
```

***Download from remote Google Drive.***
``` bash
rclone copy smancusoGoogleDrive:GoogleDriveFolderName /Path/To/Local/Download/Folder
```

# Transferring Files to and from Yen Servers

In the course of your data processing pipeline, you will often need to transfer data to Yen servers for analysis and subsequently move the resulting files back to your local machine.

## Using `scp` for File Transfers 

### Transferring Files to Yens Servers

To transfer one or more files, you can use the `scp` command. The `scp` command takes two arguments, the source path (what files or directories you are copying) and the destination path (where the files/directories will be copied to). 

```bash
$ scp <source_path> <destination_path>
```

When transferring data to the Yens from your local machine, the `<source_path>` is the path to the file(s) on your local computer while the `<destination_path>` is the path on the Yens where the files from your local machine will be transferred to. 

For instance, to transfer a file named `mydata.txt` to your project space on Yen servers, execute:

```bash
$ scp mydata.txt <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```
The `scp` command uses `ssh` for file transfer, so you'll be prompted for your password and Duo authentication.

If you want to transfer all CSV files from a particular directory, use the following:

```bash
$ scp *.csv <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```

{% include tip.html content="`scp` command above uses `yen.stanford.edu` which means the transfer will go through the interactive yens. For faster transfers, we can use `yen-transfer` node." %}

To use the Yen Data Transfer Node, we can modify the `scp` command as follows:


```bash
$ scp *.csv <SUNetID>@yen-transfer.stanford.edu:/zfs/projects/students/<my_project_dir>
```

#### Example
Let's transfer an <a href="/gettingStarted/2_local_example.html" target="_blank">R script</a> from your local machine to the Yen servers.
On your local machine, in a terminal, run:

```bash
$ cd ~/Desktop/intro-to-yens
$ scp investment-npv-parallel.R <SUNetID>@yen.stanford.edu:~
```
where `~` is your Yen home directory shortcut. Enter your SUNet ID password and Duo authenticate for the file transfer to complete.

### Transferring Folders to Yen Servers
On your local machine, open a new terminal and navigate to the parent directory of the folder that 
you want to transfer to the Yens with the `cd` command.

Once you are in the parent directory of the folder you want to transfer, run the following to copy the folder to the Yens:

```bash
$ scp -r my_folder/ <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>
```
The `-r` flag is used to copy folders (**r**ecursively copy files). Replace `<SUNetID>` with your SUNet ID and `<my_project_dir>` with the destination path on the Yen's file system, ZFS. 

Let's illustrate this with an example. We'll create an empty folder called `test_from_local` and transfer it to the home directory on Yen servers:

```bash
$ mkdir test_from_local
$ scp -r test_from_local/ <SUNetID>@yen.stanford.edu:~
```

### Transferring Files from Yen Servers
When transferring data from the Yens to your local machine, the `<source_path>` is the path to the file(s) on the Yens while the `<destination_path>` is the path on your local machine where the files from the Yens will be transferred to.

To copy files from Yen servers to your local machine, open a new terminal without connecting to the Yens. Use the `cd` command to navigate to the local directory where you want to copy the files to. Then run: 

```bash
$ cd my_local_folder
$ scp -r <SUNetID>@yen.stanford.edu:/zfs/projects/students/<my_project_dir>/results .
```

In this example, we're copying the `results` folder from the Yen's ZFS file system to your local directory (`.` signifies the current directory). If you're copying files (not directories), omit the `-r` flag. To transfer multiple files, use the wildcard `*` to match several files.

### Using Other Transfer Tools
See <a href="/faqs/rclone.html" target="_blank">rclone</a> and <a href="/faqs/rclone.html" target="_blank">rsync</a> pages to learn two additional transfer tools. 

---
<a href="/gettingStarted/6_filesystem.html"><span class="glyphicon glyphicon-menu-left fa-lg" style="float: left;"/></a> <a href="/gettingStarted/8_jupyterhub.html"><span class="glyphicon glyphicon-menu-right fa-lg" style="float: right;"/></a>

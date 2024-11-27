---
date:
  created: 2023-09-18
categories:
    - File Transfer
    - rclone
    - Google Drive
authors:
    - nrapstin
---
# `rclone` files from Yens to Google Drive
[`rclone`](https://rclone.org/){:target="_blank"} is a versatile and convenient tool for executing data transfers in and out of the Yens as it supports various sources/destinations, including Google Drive, Amazon S3, Dropbox, SFTP endpoints, etc. In this post, we will illustrate how to use `rclone` to transfer files from the Yens to Google Drive.


<!-- more -->

#### Loading `rclone` on the Yens
To utilize `rclone` on the Yens, first load the `rclone` module:

```title="Terminal Command"
ml rclone
```

Verify the loaded module by typing the command `ml`:
```{.yaml .no-copy title="Terminal Output"}
Currently Loaded Modules:
  1) rclone/1.63.1
```

#### Configuring `rclone`
Before we can push data from the Yens to Google Drive, we need to add our Google Drive destination to our instance of `rclone`. For each endpoint, this only needs to be done once.
```title="Terminal Command"
rclone config
```

The configuration menu will then be presented:
```{.yaml .no-copy title="Terminal Output"}
No remotes found - make a new one
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
name> nrapstinGoogleDrive
```
Select `n` to make a new remote and give it a name when prompted. For example, `$USERGoogleDrive` where
`$USER` is your SUNet ID.

Next, select the number corresponding to Google Drive (the menu changes with each `rclone` version so be careful to select
the right remote).

```{.yaml .no-copy title="Terminal Output"}
18 / Google Drive
   \ (drive)

Storage> 18
```

When prompted for the next two options, leave them blank and press Enter.

Then the next menu asks to select permissions you want to give `rclone`. Choose `1` for full read-write
access.

```{.yaml .no-copy title="Terminal Output"}
scope> 1
```

Then leave the next prompt blank and press Enter.

Choose `n` to not edit advanced config:

```{.yaml .no-copy title="Terminal Output"}
Edit advanced config? (y/n)
y) Yes
n) No (default)
y/n> n
```

Choose `n` again since we are working on the remote Yen server:

```{.yaml .no-copy title="Terminal Output"}
Remote config
Use auto config?
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine
y) Yes (default)
n) No
y/n> n
```

Next, we need to finish configuring Google Drive using a local machine, such as a personal laptop. For that, we will need to [install rclone locally](https://rclone.org/downloads/){:target="_blank"} and then in our local terminal, run

```title="Terminal Command"
rclone authorize "drive" "xxxxxxxxxxxxxxxxxxxxxxx"
```
where "xxxxxxxxxxxxxxxxxxxxxxx" is the config token that we see in the Yen terminal from the previous step.

This will open up a local web browser in which you can authenticate into your Google Drive using your Stanford account.

 Once you authorize `rclone` for access, Google Drive will give a code to paste back into the Yen terminal. Copy the code
and paste it back into the Yen terminal after `config_token>`.

Next, you will be asked if you want to configure this as a team drive. Press `y` if you are connecting
to a shared Google Drive or press `n` if you are connecting to your Google Drive.

```{.yaml .no-copy title="Terminal Output"}
Configure this as a team drive?
y) Yes
n) No (default)
```

Finally, press Enter to complete the config.

```{.yaml .no-copy title="Terminal Output"}
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d>
```

In the last prompt, hit `q` to quit. Now, `rclone` should be set up to push files from the yens to your
Google Drive.

#### Using `rclone`

Here are common `rclone` commands for transferring files between Yen servers and Google Drive:

* list remote connections:

```title="Terminal Command"
rclone listremotes
```

* Create a remote folder on Google Drive (within your Google Drive base folder):

```title="Terminal Command"
rclone mkdir $USERGoogleDrive:GoogleDriveFolderName
```

Alternatively, you can specify the path to the new folder on Google Drive:

```title="Terminal Command"
rclone mkdir $USERGoogleDrive:myFolder/subfolder/data
```
where I already had `myFolder` directory on my Google drive and within `myFolder` I
have already created `subfolder`. This `rclone` command will make a new folder -- `data`.

* List contents of a remote folder on Google Drive:

```title="Terminal Command"
rclone ls $USERGoogleDrive:GoogleDriveFolderName
```

* Upload a directory to Google Drive from Yen Servers:

```title="Terminal Command"
rclone copy /Yen_Path/To/Folder/ $USERGoogleDrive:GoogleDriveFolderName/
```

where `/Yen_Path/To/Folder/` is the path on the yens to the directory you want to upload.

!!! important
    If you expect to transfer a large amount of data in/out of the Yens, you should limit the number of concurrent transfers (`--transfers 1`) and the transfer bandwidth (`--bwlimit 50M`) in your `rclone` process. These flags can be added directly to your `rclone` command. This will slow down your transfer, but will ensure that other Yen users will not experience slowdowns with the filesystem. For very large data transfers, you should also consider using [Globus](/_user_guide/data_transfer/){:target="_blank"}.

* Download from Google Drive to Yen Servers:

```title="Terminal Command"
rclone copy $USERGoogleDrive:GoogleDriveFolderName /Yen_Path/To/Folder/
```
where `/Yen_Path/To/Folder/` is the path on the yens where you want to copy files to.

Explore more details in the official [rclone documentation](https://rclone.org/docs/){:target="_blank"}.

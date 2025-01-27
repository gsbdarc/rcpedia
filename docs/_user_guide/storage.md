# Storage Solutions

At Stanford Graduate School of Business, we offer several storage options to support your research. To determine the best storage solution for your research, key factors such as data size, security, access restrictions, and computing needs must be considered. Below is a brief overview of each storage option available.

!!! Important "Check Data License and Platform"
    Before transferring data to any platform, make sure the data is licensed for your use and that the storage platform meets the [security requirements](/_policies/security/){:target="_blank"} for that data. 

## Preferred Platforms:
- **ZFS:** The GSB's 1 PB high-performance storage solution. Currently, all Yen users and project directories reside on ZFS. Snapshots are taken of the data and are easily recoverable. ZFS is the ideal solution if you are performing your analysis or computational work on the Yens.
- **Google Drive:** Available to all users at Stanford. [Google Drive](https://uit.stanford.edu/service/gsuite/drive){:target="_blank"} is approved for low, medium and high risk data. It supports up to 400,000 files and has a daily upload limit of 750 GB, making it ideal for storing audio, video, PDFs, images, and flat files. Google Drive is great for sharing with external collaborators and is also suitable for [archiving research data](/_user_guide/best_practices_archive/){:target="_blank"}
 - **Oak:** Similar to ZFS, [Oak](https://uit.stanford.edu/service/oak-storage){:target="_blank"} is a High-Performance Computing (HPC) storage system available to research groups and projects at Stanford for research data.  The monthly cost is approximately $45 per 10 TB. Oak does not provide local or remote data backup by default, and should be considered as a single copy. However, [backups](https://docs.oak.stanford.edu/backups/){:target="_blank"} are available for an additional fee. Oak is the preferred storage location for [Sherlock](/_policies/sherlock/){:target="_blank"}, but can be mounted on the Yen cluster by request using an [NFS gateway](https://docs.oak.stanford.edu/gateways/nfs/){:target="_blank"}.
 - **Redivis:** [Redivis](https://redivis.com/){:target="_blank"} allows users to deploy datasets in a web-based environment (GCP backend) and provides a powerful query GUI for users who don't have a strong background in SQL.

## Other Stanford Platforms

The following storage platforms are currently supported but users are discouraged from relying on them for continuing research:

 - **AFS:** [Andrew File System](https://uit.stanford.edu/service/afs){:target="_blank"} is a distributed, networked file system that allows users to access and share files. UIT no longer automatically provisions new faculty and staff members with AFS user volumes as the service is being sunsetted by the university.
 - **Box:** Stanford University [Box](https://uit.stanford.edu/service/box){:target="_blank"} provided basic document management and collaboration through Box.com. As of February 28, 2023, university IT
 retired the Box service and has taken steps to [migrate Box content](https://uit.stanford.edu/project/box-migration){:target="_blank"} to a new folder on Google Drive or Microsoft OneDrive.

## Cloud Platforms

Storing data in the cloud is an effective way to inexpensively archive data, serve files publicly, and integrate with cloud-native query and compute tools. With the growing number of cloud storage options and security risks, we advise caution when choosing to store your data on any cloud platform. If you are considering cloud solutions for storage, please contact [DARC](mailto:gsb_darcresearch@stanford.edu) to discuss your needs.

## The Yen Cluster File System

The GSB offers nearly 1 PB of high-performance storage via the Yen servers, accessible at the ```/zfs``` path. Currently, all user directories (``` ~/```) reside on ZFS. In addition to home directories, Stanford GSB faculty and students (see below) — can request additional project space on ZFS.

!!! danger "Not for High Risk Data" 
    The Yen servers are **not** approved for high risk data. ZFS is mounted **only** from the Yen servers. You cannot access it from Sherlock, FarmShare or any other system.

### Home Directory

Every user on the Yen servers has a home directory. The home directory has a quota of 50 GB.

When you log into the Yen servers, you will automatically land in your home directory, which is located at ```/home/users/<SUNet ID>``` or with the shortcut `~`. You are able to access your former AFS home directory by following the ```afs-home``` symlink inside your home directory.

Check the absolute path with:

```title="Terminal Command"
pwd
```

This will print your working directory (where `<SUNetID>` is your SUNet ID):

```{ .yaml .no-copy title="Terminal Output" }
/home/users/<SUNetID>
```

To see this schematically, here is a visualization of the home directory on the file system:

![visualization of home directory absolute path](/assets/images/home-dir.png)

The squares with `...` in them indicate more directories that are not shown in the graph.

The path to your home directory is stored in `$HOME` environment variable. To see it, run:

```title="Terminal Command"
echo $HOME
```

The `echo` command prints out the environment variable `$HOME` which stores the path to your home directory (where `<SUNetID>` is your SUNet ID):

```{ .yaml .no-copy title="Terminal Output" }
/home/users/<SUNetID>
```

!!! Important "Do NOT Store Large Files in Home"
    The home directory is **not** for storing or outputting large files while working on a project. It is a good place to store small files like scripts and text files. Your home directory storage space is capped at 50 GB. If your home directory is full, you won't be able to access [JupyterHub](/_getting_started/jupyter/){:target="_blank"}.  

### Project Directory

If you are a GSB researcher that is interested in starting a new project on the Yens,
you can complete and submit DARC’s [project space request form](http://darc.stanford.edu/yenstorage){:target="_blank"}. This form allows you to estimate disk usage, and specify any collaborators that should be added to the shared access list. ZFS project access is granted by [workgroups](/_policies/workgroups/){:target="_blank"}.

Schematically, we can visualize the path to the project directory as follows:

![](/assets/images/project-dir.png)

The absolute path to your project space would look something like this:

```{ .yaml .no-copy title="Terminal Output" }
/zfs/projects/students/<your-project-dir>
```

where `<your-project-dir>` is the name of your project directory, consisting of your SUNet ID and a descriptive name that distinguishes this project from others. The project path and corresponding workgroup are created for you by the DARC team, in collaboration with the system administrator, after you submit the new project space request form. If you are a faculty, your new project will live in `/zfs/projects/faculty` directory. If you are a student, your new project will live in `/zfs/projects/students` directory.

The project directories come with much larger quotas than your home directory. However, please help maintain the shared resources by being a responsible steward of the commons by:

- Archiving projects or infrequently accessed files when you can (see [here](/_user_guide/best_practices_archive/#why-should-i-archive){:target="_blank"})
- Deleting intermediate files that you no longer need to use

This will help ensure efficient use of storage resources across the system.

**GSB Faculty**

All GSB faculty can request project space on ZFS. DARC will collaborate with system administrators to create this space and set up a corresponding Stanford workgroup, allowing you to manage collaborators by adding or removing them as needed. Quotas for faculty ZFS directories are set at 1 TB. If this is insufficient, additional storage can be provided upon request.

**GSB Students**

While ZFS is primarily a resource for Stanford GSB faculty, under certain conditions Stanford GSB graduate students may also be granted project space in ZFS. If you feel you are in need of student project space on ZFS (as distinct from a faculty led project), please contact [DARC](mailto:gsb_darcresearch@stanford.edu). The default size for student project space is 200 GB, but let us know if you need more space for your student project.

!!! note "Request a New Storage Space"
    To create a new faculty or student project space, please complete the project space request form [here](http://darc.stanford.edu/yenstorage/){:target="_blank"}. If you would like to discuss specific storage solutions for your project, Please email the [DARC](mailto:gsb_darcresearch@stanford.edu){:target=_blank} team to discuss further.

### Scratch Space

There is a large ZFS based scratch space, accessible from any Yen server, at ```/scratch/shared```, which is 100 TB in size. Reads and writes to this space are slower than to local disk.

### Local Disk

On each Yen machine, there is a local disk space mounted at ```/tmp```, which is over 1 TB in size. Reading and writing from ```/tmp``` is a lot faster because I/O operations do not have to go via the slow network. All Yen users are free to make use of this space. Much like a hard drive on your laptop, this can be accessed only from that single Yen machine. Be careful not to fill up `/tmp` completely as jobs running on that Yen node may crash in unexpected ways. Be a good citizen and delete the files you no longer need. 

!!! Warning "Move Results Off `/scratch` and `/tmp`"
    Note that ```/scratch``` and ```/tmp``` spaces on the Yen servers are cleared during system reboots, and are subject to **intermittent purging** as needed by the admins. Therefore, local ```/tmp``` or ```/scratch``` spaces are best used only for temporary files. Additionally, ensure that files in ```/tmp`` have the correct permissions set to prevent unauthorized access or manipulation.

### AFS Volumes

You may have a personal AFS volume that is named according to your SUNet ID. For example If your SUNet ID is johndoe13, then the path to your AFS directory is: ```/afs/ir/users/j/o/johndoe13```. The two individual letters are the first two letters of the SUNet ID.

You may have access to other AFS volumes set up for specific projects, or other people may give you access to a specific directory in their AFS volume. To access other AFS volumes, you need to know what the path is. For example, the path might be something like ```/afs/ir/data/gsb/nameofyourdirectory```.

**How to access an AFS volume**

You can transfer files to and from AFS using [OpenAFS](https://uit.stanford.edu/software/afs){:target="_blank"} using your desktop, a free download available from Stanford. This software will mount your AFS directory so that you can access it using an Explorer (Windows) or Finder (Mac) window as you do with other files.

!!! Note "AFS is NOT Mounted on the Yen Servers"
    AFS is no longer mounted. If you still wish to access your AFS space (afs-home), you can SSH into SRC's [rice nodes](https://srcc.stanford.edu/farmshare/connecting){:target="_blank"}. These nodes are part of the University's FarmShare system and you can access them with `ssh <SUnetID>@rice.stanford.edu`.

    WebAFS has been retired and is no longer available to use. For its alternatives, visit this [page](https://uit.stanford.edu/service/afs){:target="_blank"}.

## How to Check ZFS Space Quota

To determine how much of your quota you have used in your home direcotry `/home/users/<SUNet ID>/`, you can simply type:

```title="Terminal Command"
gsbquota
```

The resulting output will display the actual percentage and gigabytes used, as shwon below:

```{ .yaml .no-copy title="Terminal Output" }
/home/users/<SUNet ID>: currently using 50% (25G) of 50G available
```

You can also check size of your project space by passing in a full path to your project space to `gsbquota` command:

```{ .yaml .no-copy title="Terminal Output" }
gsbquota /zfs/projects/students/<my-project-dir>/
/zfs/projects/students/<my-project-dir>/: currently using 39% (78G) of 200G available
```

!!! Tip "Email Us If You Encounter Issues"
    Please report any issues with `gsbquota` to the [DARC team](mailto:gsb_darcresearch@stanford.edu){:target="_blank"}.

## How to Recover ZFS Files

Files on ZFS are backed up in **snapshots** for some amount of time, so if you need to recover something you accidentally deleted, luckily you can still access it! Please email the [DARC](mailto:gsb_darcresearch@stanford.edu) team for help.

Here is an example of something that might happen:

- You are working in the directory `/zfs/projects/faculty/hello-world/` and have a couple of files named `results.csv` and `results_temp.csv` that you made yesterday. The latter file was clearly temporary and so you want to remove it to clean things up:

```title="Terminal Command"
rm /zfs/projects/faculty/hello-world/results.csv
```

- Oops, you accidentally deleted the file you wanted to keep! Only `results_temp.csv` remains. Luckily, since you made the files yesterday, there are likely snapshots available.

Note that snapshots are retained according to specific intervals. The current snapshot retainment policy is as follows:

* <u>Hourly</u> --- retain 1 day of hourly snapshots
* <u>Daily</u> --- retain 1 week of daily snapshots
* <u>Weekly</u> --- retain 2 months of weekly snapshots
* <u>Monthly</u> --- retain 1 year of monthly snapshots

!!! important "Email Us to Recover Files"
    Please email [DARC](mailto:gsb_darcresearch@stanford.edu) for help recovering files from snapshots.


# Storage Solutions
GSB researchers work with datasets that often exceed the capacity of personal machines. To support this work, Stanford provides several storage platforms optimized for performance and collaboration. This page summarizes the storage options available and when to use each one.

!!! warning "Check Data License and Platform"
    Before transferring data to any platform, make sure the data is licensed for your use and that the storage platform meets the [security requirements](/_policies/security/){:target="_blank"} for that data. 

## New Storage System: VAST
!!! tip "High-Performance Storage for the Yen Cluster" 
    The Yen cluster now runs on a new 1 PB all-flash VAST Data storage system, replacing the legacy ZFS backend. This upgrade significantly improves performance, reliability, and scalability for data-intensive research.

Designed for data-intensive research, VAST provides:

- All-flash performance for fast reads/writes

- Scalability for multi-TB and multi-user workloads

- User-accessible snapshots for self-service file recovery

!!! danger "Not for High Risk Data"
    The Yen servers are **not** approved for high risk data. VAST is mounted **only** from the Yen servers. You cannot access it from Sherlock, FarmShare or any other system.


All home directories and project spaces on the Yens now live on VAST. 

Use VAST when:

- You are running analyses or workflows on the Yen cluster

- You need fast access to large datasets

- You want a shared project directory for collaboration

!!! note "ZFS Paths"
    Although VAST now provides the underlying storage, the existing `/zfs/...` paths remain in place. You do not need to change your workflows, scripts, or file paths — everything continues to function exactly as before.

### Home Directory

Every Yen user receives a personal home directory:
```{ .yaml .no-copy title="Terminal Output for pwd Command" }
/home/users/<SUNetID>
```

Your home directory is your private working space on the Yens. It’s best used for small scripts and utilities.

!!! Danger "Do NOT Store Large Files in Home"
    Home directories have a strict **50 GB** limit. They are not intended for large datasets, large outputs, or collaborative projects. 
    If your home directory is full, you won't be able to access [JupyterHub](/_getting_started/jupyter/){:target="_blank"}.
 

### Project Directory
!!! tip "Requesting New Project Space"
    To create a new project directory, submit the [Project Space Request Form](http://darc.stanford.edu/yenstorage){:target="_blank"}. This form allows you to estimate disk usage, and specify any collaborators that should be added to the shared access list. Access to the directory is controlled through Stanford [workgroups](/_policies/workgroups/){:target="_blank"}.

Project directories on the Yens provide shared, scalable storage for research conducted on the Yens.
Every faculty project space is created by the DARC team in collaboration with the system administrators and mounted at a path:
```{ .yaml .no-copy title="Terminal Output" }
/zfs/projects/faculty/<your-project-dir>
```
or for a student-lead project:
```
/zfs/projects/students/<your-project-dir>
```

Project directories are ideal for:

- Large datasets

- Analysis outputs and intermediate files

- Collaborative research with multiple users

- Long-running or compute-intensive workflows


!!! note "Default Quotas"
    - Faculty led projects: **1 TB**
    - Student led projects: **200 GB**

    Additional space can be requested if needed.


!!! warning "Help Keep Shared Storage Healthy"
    Please [archive](/_user_guide/archiving/#why-should-i-archive){:target="_blank"} inactive data and delete unused intermediate files. Yen storage is a shared resource for the entire research community.

If you would like to discuss specific storage solutions for your project, please email the [DARC](mailto:gsb_darcresearch@stanford.edu){:target=_blank} team to discuss further.

### Temporary Storage

Some workflows require fast, short-term storage for intermediate results or temporary files. The Yen cluster provides two such locations: node-local temporary storage and shared scratch space. These areas are not intended for permanent data and will be purged intermittently.

**`/tmp` - Node-Local Storage**

Each Yen compute node has a local disk available at `/tmp` path, which is over **1 TB** in size. 

Use `/tmp` when you need:

 - Very fast read/write performance

- Temporary files used only by a job running on a single node

Characteristics:

- Accessible only from the node where your job is running

- Cleared when the node reboots

- Not backed up

!!! warning "Avoid Filling /tmp"
    Jobs running on the same node may fail if `/tmp` fills up.
    Always clean up temporary files after your job finishes.

**`/scratch/shared` — Cluster-Wide Scratch**

There is a large scratch space, accessible from any Yen server, at ```/scratch/shared```, which is **100 TB** in size. Reads and writes to this space are slower than to local to the node `/tmp` storage.

!!! warning "Not for Long-Term Storage"
    `/scratch/shared` is not backed up and may be periodically cleared by administrators. Move any important results to your project directory as soon as possible.

## How to Check Home and Project Space Quota

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

## How to Recover Deleted Files

Files on the Yens are backed up in **snapshots**, so if you need to recover something you accidentally deleted, luckily you can still access it! Please email the [DARC](mailto:gsb_darcresearch@stanford.edu) team for help.

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


## Other Storage Options
In addition to VAST, several other storage platforms support research workflows at Stanford GSB. The best option depends on your dataset size, security requirements, compute needs, and level of collaboration. 

### Redivis
[Redivis](https://redivis.com/){:target="_blank"} allows users to deploy datasets in a web-based environment (GCP backend) and provides a powerful query GUI for users who don't have a strong background in SQL.
 
### Google Drive
Available to all users at Stanford. [Google Drive](https://uit.stanford.edu/service/gsuite/drive){:target="_blank"} is approved for low, medium and high risk data. It supports up to 400,000 files and has a daily upload limit of 750 GB, making it ideal for storing audio, video, PDFs, images, and flat files. Google Drive is great for sharing with external collaborators and is also suitable for [archiving research data](/_user_guide/archiving/){:target="_blank"}.

### Oak 
[Oak](https://uit.stanford.edu/service/oak-storage){:target="_blank"} is a High-Performance Computing (HPC) storage system available to research groups and projects at Stanford for research data.  The monthly cost is approximately $45 per 10 TB. Oak does not provide local or remote data backup by default, and should be considered as a single copy. However, [backups](https://docs.oak.stanford.edu/backups/){:target="_blank"} are available for an additional fee. Oak is the preferred storage location for [Sherlock](/_user_guide/sherlock/){:target="_blank"}, but can be mounted on the Yen cluster by request using an [NFS gateway](https://docs.oak.stanford.edu/gateways/nfs/){:target="_blank"}.

## Cloud Platforms

Storing data in the cloud is an effective way to inexpensively archive data, serve files publicly, and integrate with cloud-native query and compute tools. With the growing number of cloud storage options and security risks, we advise caution when choosing to store your data on any cloud platform. If you are considering cloud solutions for storage, please contact [DARC](mailto:gsb_darcresearch@stanford.edu) to discuss your needs.


## Legacy Stanford Platforms

The following storage platforms are currently supported but users are discouraged from relying on them for continuing research:

 - **AFS:** [Andrew File System](https://uit.stanford.edu/service/afs){:target="_blank"} is a distributed, networked file system that allows users to access and share files. UIT no longer automatically provisions new faculty and staff members with AFS user volumes as the service is being sunsetted by the university.
 - **Box:** Stanford University [Box](https://uit.stanford.edu/service/box){:target="_blank"} provided basic document management and collaboration through Box.com. As of February 28, 2023, university IT
 retired the Box service and has taken steps to [migrate Box content](https://uit.stanford.edu/project/box-migration){:target="_blank"} to a new folder on Google Drive or Microsoft OneDrive.



### AFS Volumes

You may have a personal AFS volume that is named according to your SUNet ID. For example If your SUNet ID is johndoe13, then the path to your AFS directory is: ```/afs/ir/users/j/o/johndoe13```. The two individual letters are the first two letters of the SUNet ID.

You may have access to other AFS volumes set up for specific projects, or other people may give you access to a specific directory in their AFS volume. To access other AFS volumes, you need to know what the path is. For example, the path might be something like ```/afs/ir/data/gsb/nameofyourdirectory```.

**How to access an AFS volume**

You can transfer files to and from AFS using [OpenAFS](https://uit.stanford.edu/software/afs){:target="_blank"} using your desktop, a free download available from Stanford. This software will mount your AFS directory so that you can access it using an Explorer (Windows) or Finder (Mac) window as you do with other files.

!!! Note "AFS is NOT Mounted on the Yen Servers"
    AFS is no longer mounted. If you still wish to access your AFS space (afs-home), you can SSH into SRC's [rice nodes](https://srcc.stanford.edu/farmshare/connecting){:target="_blank"}. These nodes are part of the University's FarmShare system and you can access them with `ssh <SUnetID>@rice.stanford.edu`.

    WebAFS has been retired and is no longer available to use. For its alternatives, visit this [page](https://uit.stanford.edu/service/afs){:target="_blank"}.


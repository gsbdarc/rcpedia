---
date:
  created: 2023-08-18
categories:
    - zip
authors:
    - nrapstin
---

# How Do I Extract Compressed Files?

Compressed files are commonly used to save storage space and simplify file transfers, especially when dealing with large datasets or collections of files. Knowing how to uncompress these files is essential for quick and efficient access to your data. This guide will walk you through the process of uncompressing files on the Yens, covering several common compression formats. By following the examples below, you'll be able to handle compressed files effectively, whether for transfer or long-term storage.

<!-- more -->


!!! tip "Best Practices: Archiving Projects"
    See [this page](/_user_guide/best_practices_archive/?h=archive){:target="_blank"} to learn more about archiving your projects for long-term storage or transfer.

## .zip
As one of the most common compression formats, `.zip` files can be easily extracted using the `unzip` command:

```title="Terminal Command"
unzip bigfile.zip
```
Additional options for this command can be found [**here**](https://linuxize.com/post/how-to-unzip-files-in-linux/){:target="_blank"}.

## .tar
The tar command is a Unix utility used to archive files into a single file, commonly called a tarball. The name "tar" comes from "tape archive," as it was originally used to archive file objects for storage on tape.

To extract files from a .tar archive, you can use the following command:

- **x**: Extracts the files.
- **v**: Provides verbose output, listing the files as they are extracted.
- **f**: Specifies the name of the tarball to process.

```title="Terminal Command"
tar -xvf bigfile.tar
```
For additional options and detailed explanations of the flags, refer to [**this blog**](https://www.geeksforgeeks.org/tar-command-linux-examples/){:target="_blank"}.

## .gz
This compression format is created by a GNU zip compression algorithm. You can use `gunzip`:
```title="Terminal Command"
gunzip bigfile.csv.gz
```
Additional options for this command can be found [**here**](https://www.geeksforgeeks.org/gunzip-command-in-linux-with-examples/){:target="_blank"}.

## .tar.gz and .tgz

Tarballs are often further compressed using gzip (resulting in a .tar.gz or .tgz extension) or bzip2 (resulting in a .tar.bz2 extension). To extract files from a gzip-compressed tarball, you can use the tar command with the appropriate options.

- **z**: Indicates the file is compressed with gzip.
- **x**: Extracts the files.
- **v**: Provides verbose output, listing the files as they are extracted.
- **f**: Specifies the name of the file to process.

Here’s the command to extract a .tar.gz or .tgz file:

```title="Terminal Command"
tar -zxvf bigfile.tar.gz  
```

## .rar
For RAR files, you can just use `unrar`:

- **e**: Extracts the files to the current directory.

```title="Terminal Command"
unrar e bigfile.rar
```

For additional details and options, refer to [**this blog**](https://www.tecmint.com/how-to-open-extract-and-create-rar-files-in-linux/){:target="_blank"}.

## .7z
The `.7z` format is a less common compression format but offers high compression ratios. You can extract files from a `.7z` archive using the `7z` command with the following options:

- **e**: Extracts the files to the current directory.

```title="Terminal Command"
7z e bigfile.7z
```
For additional options and detailed explanations of the 7z command, refer to [**this blog**](https://itsfoss.com/use-7zip-ubuntu-linux/){:target="_blank"}.
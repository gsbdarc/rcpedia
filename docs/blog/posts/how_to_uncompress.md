---
date:
  created: 2023-08-18
---

# How do I extract compressed files?


Large collections of files will often be compressed in order to make them more friendly for transfer or long-term storage. Below are examples on how to uncompress a few common compression file types on the Yens.

!!! tip
    See [this page](/gettingStarted/17_archive.html) to learn more about archiving your projects for long-term storage or transfer.

## .zip
Perhaps one of the more common compression types, you can simply use `unzip`:
```
$ unzip bigfile.zip
```
Additional options for this command can be found [here](https://linuxize.com/post/how-to-unzip-files-in-linux/).

## .tar
`tar` is a Unix utility for collecting files together into one archive file (commonly called a tarball).
The name tar comes from "tape archive" and was used to archive a series of file objects together (as one collection or archive).

To untar the tarball (use options `x` to extract, `v` for verbose and `f` to give the name of the tarball you want to untar), run:
```
$ tar -xvf bigfile.tar
```
Additional options for this command and an explanation of the flags can be found [here](https://www.geeksforgeeks.org/tar-command-linux-examples/).

## .gz
This compression format is created by a GNU zip compression algorithm. You can use `gunzip`:
```
$ gunzip bigfile.csv.gz
```
Additional options for this command can be found [here](https://www.geeksforgeeks.org/gunzip-command-in-linux-with-examples/).

## .tar.gz and .tgz
Commonly, the tarball may also be compressed with gunzip (having an extension `.tar.gz` or `.tgz`) or bzip2 (with `.bz2` extension).
Then to untar, add the unzip option as well (`-z`). 

```bash
$ tar -zxvf bigfile.tar.gz 
```

## .rar
For RAR files, you can just use `unrar`:
```
$ unrar e bigfile.rar
```
Additional explanation for this can be found [here](https://www.tecmint.com/how-to-open-extract-and-create-rar-files-in-linux/).

## .7z
A less common compression format, you can use `7z` for this:
```
$ 7z e bigfile.7z
```
Additional options for this command can be found [here](https://itsfoss.com/use-7zip-ubuntu-linux/).
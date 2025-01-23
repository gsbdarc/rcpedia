---
date:
  created: 2024-11-21
categories:
    - File Transferring
    - Downloading
authors:
    - nrapstin 
subtitle: Download Files Directly to the Yens Server
---

# Download Files Directly to the Yens Server

Instead of downloading the file to your local machine and transferring it to the Yens, you can streamline the process by downloading it directly to the Yens server using the `wget` command.

<!-- more -->

## General Process

- **Navigate to the Desired Directory**: Use the `cd` command to move to the directory where you want to save the downloaded files.

- **Use `wget` to Download the Files**: Download a single file or multiple files to the desired directory.

- **Verify the Download by Listing the Files**: Use the `ls` command.

## Example 1: Downloading a Single File

Suppose you want to download the YOLOv5 small model weights (`yolov5s.pt`) from the official [Ultralytics YOLOv5 repository](https://github.com/ultralytics/yolov5){target="_blank"}. Here's how to do it:

- Navigate to the desired directory:
```bash title="Terminal Command"
cd /path/to/your/directory
```

- Use the `wget` command with the file URL:
```bash title="Terminal Command"
wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.pt
```

- If successful, you’ll see the output similar to this:
```{.yaml .no-copy title="Terminal Output"}
--2024-11-21 15:20:25--  https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.pt
Resolving github.com (github.com)... 140.82.116.4
Connecting to github.com (github.com)|140.82.116.4|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/381bd8a8-8910-4e9e-b0dd-2752951ef78c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241121%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241121T232025Z&X-Amz-Expires=300&X-Amz-Signature=a433e86330069677c4af618dfa3dbf5d5078e6145c5b109fc3fd77bad1bf4697&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5s.pt&response-content-type=application%2Foctet-stream [following]
--2024-11-21 15:20:25--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/381bd8a8-8910-4e9e-b0dd-2752951ef78c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241121%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241121T232025Z&X-Amz-Expires=300&X-Amz-Signature=a433e86330069677c4af618dfa3dbf5d5078e6145c5b109fc3fd77bad1bf4697&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5s.pt&response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 14808437 (14M) [application/octet-stream]
Saving to: ‘yolov5s.pt’

yolov5s.pt                               100%[==================================================================================>]  14.12M  84.2MB/s    in 0.2s    

2024-11-21 15:20:26 (84.2 MB/s) - ‘yolov5s.pt’ saved [14808437/14808437]
```

- Verify the download by listing the files:
```bash title="Terminal Command"
ls
```
`yolov5s.pt` should be in your directory.

## Example 2: Downloading Multiple Files

Now suppose you need to download multiple YOLOv5 model weights (e.g., `yolov5s.pt`, `yolov5m.pt`, and `yolov5l.pt`). Here's how you can do it efficiently:

- Navigate to the desired directory:
```bash title="Terminal Command"
cd /path/to/your/directory
```

- Create a file to store the list of URLs:
```bash title="Terminal Command"
touch file_list.txt
```

- Add the URLs to the `file_list.txt` file:
```bash title="Terminal Command"
echo "https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.pt" >> file_list.txt
echo "https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5m.pt" >> file_list.txt
echo "https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5l.pt" >> file_list.txt
```

- Verify the contents of `file_list.txt`:
```bash title="Terminal Command"
cat file_list.txt
```
The output should look like this:
```{.yaml .no-copy title="Terminal Output"}
https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.pt
https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5m.pt
https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5l.pt
```

- Use the `wget` command with the `-i` option to download all tthe files listed in the `file_list.txt`:
```bash title="Terminal Command"
wget -i file_list.txt
```

- If successful, you’ll see the download progress for each file, similar to this:
```{.yaml .no-copy title="Terminal Output"}
--2024-11-21 16:22:12--  https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.pt
Resolving github.com (github.com)... 140.82.114.4
Connecting to github.com (github.com)|140.82.114.4|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/381bd8a8-8910-4e9e-b0dd-2752951ef78c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002212Z&X-Amz-Expires=300&X-Amz-Signature=8ef596a593fbe2a25e34942d0d007273a1082b6182691bad5a7c6aa6478180bd&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5s.pt&response-content-type=application%2Foctet-stream [following]
--2024-11-21 16:22:12--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/381bd8a8-8910-4e9e-b0dd-2752951ef78c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002212Z&X-Amz-Expires=300&X-Amz-Signature=8ef596a593fbe2a25e34942d0d007273a1082b6182691bad5a7c6aa6478180bd&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5s.pt&response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 14808437 (14M) [application/octet-stream]
Saving to: ‘yolov5s.pt’

yolov5s.pt                                            100%[========================================================================================================================>]  14.12M  --.-KB/s    in 0.1s    

2024-11-21 16:22:13 (117 MB/s) - ‘yolov5s.pt’ saved [14808437/14808437]

--2024-11-21 16:22:13--  https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5m.pt
Connecting to github.com (github.com)|140.82.114.4|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/7acc87ed-9e1f-4d4a-8bdc-0912393948df?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002213Z&X-Amz-Expires=300&X-Amz-Signature=024eb9d6418da5993180d4f805ac237d9a6548c6346283ac123932b9d78d5311&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5m.pt&response-content-type=application%2Foctet-stream [following]
--2024-11-21 16:22:13--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/7acc87ed-9e1f-4d4a-8bdc-0912393948df?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002213Z&X-Amz-Expires=300&X-Amz-Signature=024eb9d6418da5993180d4f805ac237d9a6548c6346283ac123932b9d78d5311&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5m.pt&response-content-type=application%2Foctet-stream
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 42806829 (41M) [application/octet-stream]
Saving to: ‘yolov5m.pt’

yolov5m.pt                                            100%[========================================================================================================================>]  40.82M  95.5MB/s    in 0.4s    

2024-11-21 16:22:14 (95.5 MB/s) - ‘yolov5m.pt’ saved [42806829/42806829]

--2024-11-21 16:22:14--  https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5l.pt
Connecting to github.com (github.com)|140.82.114.4|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/638b4816-c501-4617-9384-54fd42a62e3a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002215Z&X-Amz-Expires=300&X-Amz-Signature=9ac43aa748f4ca5616c710f70b62cd3076f1871d4e50e81004c22d1c20bc0b7d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5l.pt&response-content-type=application%2Foctet-stream [following]
--2024-11-21 16:22:15--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/264818686/638b4816-c501-4617-9384-54fd42a62e3a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241122%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241122T002215Z&X-Amz-Expires=300&X-Amz-Signature=9ac43aa748f4ca5616c710f70b62cd3076f1871d4e50e81004c22d1c20bc0b7d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dyolov5l.pt&response-content-type=application%2Foctet-stream
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 93622629 (89M) [application/octet-stream]
Saving to: ‘yolov5l.pt’

yolov5l.pt                                            100%[========================================================================================================================>]  89.29M  83.6MB/s    in 1.1s    

2024-11-21 16:22:16 (83.6 MB/s) - ‘yolov5l.pt’ saved [93622629/93622629]

FINISHED --2024-11-21 16:22:16--
Total wall clock time: 4.0s
Downloaded: 3 files, 144M in 1.6s (89.2 MB/s)
```

- Verify the download by listing the files:
```bash title="Terminal Command"
ls
```
`yolov5s.pt`,  `yolov5m.pt`, and `yolov5l.pt`  should be in your directory.

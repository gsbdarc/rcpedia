---
date:
  created: 2023-09-20
categories:
    - File Editing
authors:
    - nrapstin 
---

# Editing Files on the Command Line

When working within JupyterHub, one can utilize the built-in Text Editor to [directly edit scripts on the Yens](/_getting_started/jupyter/#text-file-editor){:target="_blank"}. 
However, it is sometimes more convenient and faster to edit files directly from the command line, for instance if you are logged into a terminal and need to make small changes to your Slurm script prior to submission.

In this post, we will illustrate how you can do this using the Vim text editor that comes with Linux distributions and can be used on any HPC system or server. As a specific example, we will make small changes to a Python script from the command line.

<!-- more -->
To start, Vim has several modes:

- **Command mode**: This is the mode you will be in when you first enter Vim. The user issues commands such as search, replace, block deletion and so on, but cannot type new content directly. It is in this mode where you can also save the edited file.
- **Insert mode**: The user types in content edits to files. We can switch from **Command mode** to this mode by pressing the `i` key. When you are in **Insert mode**, the bottom of the editor displays `-- INSERT --`. Switch back to **Command mode** by pressing the `esc` key. 


Let's open up a test file and edit it:

```title="Terminal Command"
vi test.py
```

On the bottom of the editor, we see:

```{.yaml .no-copy title="Terminal Output"}
"test.py" [New File]   
```
which presents the name of the file we are editing and signals that we are in **Command mode** (default mode when opening a file).


Now if we want to start typing content edits, we press the ++i++ key and make sure the bottom of the editor now says:

```{.yaml .no-copy title="Terminal Output"}
-- INSERT --     
```
which indicates that **Insert mode** is activated.
 
We then add in a line with a test Python command:

```python title="Python Code"
print("hello world!")
```

To change the position of the position cursor, we use the arrow keys or `h`, `j`, `k`, `l` keys. This will allow us to jump to a different line or position the cursor within a line.

Let's now save and quit the Vim editor. First, we press `esc` to go back to **Command mode** (the bottom of the editor should no longer show `-- INSERT --`). Then type `:wq` to write and quit Vim. This should save the file and return you back to the command line.

After you are back on the command line, let's make sure the file is saved correctly:

```title="Terminal Command"
cat test.py
```
You should see the file's content that we created:

```{.yaml .no-copy title="Terminal Output"}
print("hello world!")
```

In summary, use:

- `i` : switch to **Insert mode** from **Command mode**
- `esc`: switch back to **Command mode** from **Insert mode**
- `:wq` : save file and quit out of Vim (must be in **Command mode**)

Finally, you can download a [short list of useful Vim commands](https://drive.google.com/file/d/1sBbdrk_UcfX_tfy1jgxBaomwhDWKli2T/view?usp=sharing){:target="_blank"} to reference while using the editor
and [learn Vim while playing a game](https://vim-adventures.com){:target="_blank"}.

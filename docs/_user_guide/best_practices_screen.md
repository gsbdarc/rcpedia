# Run a Job That Continues After Logging Out

Generally speaking, you can use the `screen` command, described in more detail below, to continue having your scripts run on the Yens after logging out, but a very important first question to ask is:

## "Am I accessing anything stored in AFS (`/afs/***` or `/afs-home/***`) space?"

If the answer to that question is "Yes", then you will likely run into authentication issues. Although [AFS space](https://uit.stanford.edu/service/afs){:target="_blank"} is frequently used within the computing infrastructure of the rest of the University, the biggest issue is that it requires Kerberos authentication tokens in order to access files and they time out after 25 hours. See [here](https://uit.stanford.edu/service/afs/learningmore/faq#8){:target="_blank"} for UIT's explanation. If you have jobs that access AFS space and expect to run for longer than that period of time, you will run into a slew of cryptic errors that are very likely related to your token expiring.

!!! Important 
	Furthermore, please note that AFS is currently being phased out by the university, and will eventually be retired completely. Adequate notice will be provided by University IT prior to any portions of AFS being brought offline.

On the Yen servers, the best storage space for your scripts and data is **ZFS**.

## Screen
[`screen`](https://www.gnu.org/software/screen/manual/screen.html){:target="_blank"} allows you to set up multiple virtual sessions within your terminal session. This can be useful for running multiple processes at the same time, but it can also be used to leave processes running after you log out of any Yens server.

To set up a screen, `ssh` in to the Yens through a terminal window and then type:
```title="Terminal Command"
screen -S <session_name>
```
where `<session_name>` is any name of your choice.

!!! Warning
	Do not initiate a screen in a terminal on JupyterHub. The screen will time out and you will not be able to access it later. Please only initiate screens through a SSH connection to the Yens outside of JupyterHub.

This will take you to a new terminal with a blank view and a command prompt at the top of the page. Here, you can start issuing commands as usual and in particular, you can start a script that you expect to run for a long time.

!!! Note 
	Screens are not tied to your user, but rather to the specific Yen that you started the screen in. So do not expect your screen session on `yen1` to appear in `yen2`.

Once your script is going, you can exit out of this screen session with the keyboard shortcut `ctrl + a + d`, which will return you to your original terminal. At this point, you can list out any screen sessions that you are running on the particular Yen server you are logged onto by typing:
```title="Terminal Command"
screen -ls
```

If you exit out of the server here, you can be assured that the scripts in your screen sessions will continue to run, granted they are accessing ZFS space.

To return to any existing screen session, you simply need to type:
```title="Terminal Command"
screen -r <session_name>
```

If you are actively printing to the console in your script, you may notice that you cannot scroll up through the log of print statements when you are in a screen. In order to activate the "scroll mode", you can use the keyboard shortcut `ctrl + a` and then hit `esc`. In this mode, you can peruse through your print statements with the up and down arrow keys. Once you are finished scrolling, you can exit out of the mode by hitting the `q` or `esc` keys.

You may run into a situation where you are disconnected or timed out from the Yens while you are attached to a screen session. When you log back onto the Yens and try to reconnect to that session again, you may find that you cannot re-attach to the screen, since it's already "Attached". In order to return to that session, you can just use this command:
```title="Terminal Command"
screen -d -r <session_name>
```

This detaches the previous connection to that screen session and then returns you to the screen.

Finally, once you are finished with a screen session, all you have to do is type:
```title="Terminal Command"
exit
```

## An actual example

For example, let's name our session `npv`:

```title="Terminal Command"
$ screen -S npv
```

This will take you to a new terminal with a blank view and a command prompt at the top of the page. 
Here, you can start issuing commands as usual and in particular, you can start a script that you expect to run for a long time.

!!! Warning
	Do not initiate a screen in a terminal on JupyterHub. The screen will time out and you will not be able to access it later. Please only initiate screens through a SSH connection to the Yens outside of JupyterHub.

!!! Note 
	Screens are not tied to your user, but rather to the specific Yen that you started the screen in. So do not expect your screen session on `yen1` to appear in `yen2`.

Let's run our serial R script again. This time, we will let it run in a screen (if you had modules loaded, 
starting a screen preserves these in the new terminal started by `screen`). So, we can start our R process:

```title="Terminal Command"
$ Rscript investment-npv-parallel.R
```

Once your script is going, you can exit out of this screen session with the keyboard shortcut `ctrl + a + d`, which will return you to your original terminal. 

You should see that the screen was detached:

```{.yaml .no-copy title="Terminal Output"}
[detached from 3630208.npv]
```

You can list any screen sessions that you are running on the particular Yen server you are logged onto by typing:
```title="Terminal Command"
$ screen -ls
```

You should see something like:
```{.yaml .no-copy title="Terminal Output"}
There is a screen on:
	3630208.npv	(09/19/2023 10:33:47 AM)	(Detached)
1 Socket in /run/screen/S-nrapstin.
```

If you exit out of the server here, you can be assured that the scripts in your screen sessions will continue to run, granted they are accessing ZFS space.

To return to any existing screen session, you simply need to type:
```title="Terminal Command"
$ screen -r <session_name>
```

For example, to go back to the screen we detached from earlier:

```title="Terminal Command"
$ screen -r npv
```

If you are actively printing to the console in your script, you may notice that you cannot scroll up through the log of print statements when you are in a screen. 
In order to activate the "scroll mode", you can use the keyboard shortcut `ctrl + a` and then hit `esc`. 
In this mode, you can peruse through your print statements with the up and down arrow keys. Once you are finished scrolling, you can exit out of the mode by hitting the `q` or `esc` keys.

You may run into a situation where you are disconnected or timed out from the Yens while you are attached to a screen session. 
When you log back onto the Yens and try to reconnect to that session again, you may find that you cannot re-attach to the screen, since it's already "attached".
 In order to return to that session, you can just use this command:

```title="Terminal Command"
$ screen -dr <session_name>
```

This detaches the previous connection to that screen session and then returns you to the screen.

Finally, once you are finished with a screen session, all you have to do is type:
```title="Terminal Command"
$ exit
```

Check that you no longer have screen sessions running:
```title="Terminal Command"
$ screen -ls
```

```{.yaml .no-copy title="Terminal Output"}
No Sockets found in /run/screen/S-nrapstin.
```
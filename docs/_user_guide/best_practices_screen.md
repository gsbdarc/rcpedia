# Run a Job That Continues After Logging Out

We highly recommend that you consider using the [Slurm scheduler](/_user_guide/slurm){:target="_blank"} to submit and run jobs that persist after you log out. 
Slurm offers several clear benefits over interactive jobs, including:

* better resource management
* job prioritization
* job queueing 
* enhanced monitoring
* scaling across nodes

However, you can also run a job that continues after logging out by using `screen`.

## How to use `screen`

[`screen`](https://www.gnu.org/software/screen/manual/screen.html){:target="_blank"} allows you to set up multiple virtual sessions within your terminal session. This can be useful for running multiple processes at the same time, but it can also be used to leave processes running after you log out of any Yen server.

To set up a screen, `ssh` in to the Yens through a terminal window and then type:
```title="Terminal Command"
screen -S <session_name>
```
where `<session_name>` is any name of your choice.

!!! Warning "Do Not Initiate a Screen in a Terminal on JupyterHub"
	The screen will time out and you will not be able to access it later. Please only initiate screens through a SSH connection to the Yens outside of JupyterHub.

!!! Note 
	Screen sessions are tied to the specific Yen server where they were started, not to your user account. For example, a screen session started on `yen1` will not appear on `yen2`. Ensure you reconnect to the same server to access your screen session.






For example, let's name our session `npv`:

```title="Terminal Command"
screen -S npv
```

This will take you to a new terminal with a blank view and a command prompt at the top of the page. 
Here, you can start issuing commands as usual and in particular, you can start a script that you expect to run for a long time.

Let's run our serial R script again. This time, we will let it run in a screen (if you had modules loaded, 
starting a screen preserves these in the new terminal started by `screen`). So, we can start our R process:

```title="Terminal Command"
Rscript investment-npv-parallel.R
```

Once your script is going, you can exit out of this screen session with the keyboard shortcut ++ctrl+a+d++, which will return you to your original terminal. 

You should see that the screen was detached:

```{.yaml .no-copy title="Terminal Output"}
[detached from 3630208.npv]
```

You can list any screen sessions that you are running on the particular Yen server you are logged onto by typing:
```title="Terminal Command"
screen -ls
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
screen -r <session_name>
```

For example, to go back to the screen we detached from earlier:

```title="Terminal Command"
screen -r npv
```

If you are actively printing to the console in your script, you may notice that you cannot scroll up through the log of print statements when you are in a screen. 
In order to activate the "scroll mode", you can use the keyboard shortcut ++ctrl+a++ and then hit ++esc++. 
In this mode, you can peruse through your print statements with the up and down arrow keys. Once you are finished scrolling, you can exit out of the mode by hitting the ++q++ or ++esc++ keys.

## Potential technical issues

You may run into a situation where you are disconnected or timed out from the Yens while you are attached to a screen session. 
When you log back onto the Yens and try to reconnect to that session again, you may find that you cannot re-attach to the screen, since it's already "attached".
 In order to return to that session, you can just use this command:

```title="Terminal Command"
screen -dr <session_name>
```
This detaches the previous connection to that screen session and then returns you to the screen.

## How to exit `screen`

Finally, once you are finished with a screen session, all you have to do is type:
```title="Terminal Command"
exit
```

Check that you no longer have screen sessions running:
```title="Terminal Command"
screen -ls
```

```{.yaml .no-copy title="Terminal Output"}
No Sockets found in /run/screen/S-nrapstin.
```
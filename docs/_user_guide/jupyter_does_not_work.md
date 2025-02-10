There are several common reasons why JupyterHub might not be working for you.

## Are You Using Safari?
JupyterHub on the Yens has known issues with Safari. Please try a different browser, such as Chrome or Firefox.

## Do You Have Access to the Yen Servers?
To access JupyterHub, you must have access to the Yen servers. If you're not a member of the GSB, you must have an active SUNet ID and obtain sponsorship. More information on sponsorship is available [**here**](/_policies/collaborators/){:target="_blank"}.

## Do You Have Full SUNet Sponsorship?
A full SUNet ID is required for JupyterHub access. Please see the [UIT sponsorship page](https://uit.stanford.edu/service/sponsorship){:target="_blank"} for details on sponsorship levels.

## Have You Logged Into the Yens via the Terminal at Least Once?
JupyterHub uses your home directory to store configuration.  Because your home directory is created on first login, you need to login to the Yens via `ssh` at least once before you can use JupyterHub.  You can find login instructions [**here**](/_getting_started/how_access_yens/#log-in-to-the-yens){:target="_blank"}.
 
## Is Your Home Directory Full?
Because JupyterHub uses your home directory, it will not work if your home directory is over quota. Please see [**this page**](/_user_guide/storage/#how-to-check-zfs-space-quota){:target="_blank"} for more information on checking your quota.

## Did You Go to the Right URL?
JupyterHub is available at:
=== "Yen1"
    [https://yen1.stanford.edu](https://yen1.stanford.edu){:target="_blank"}
=== "Yen2"
    [https://yen2.stanford.edu](https://yen2.stanford.edu){:target="_blank"}
=== "Yen3"
    [https://yen3.stanford.edu](https://yen3.stanford.edu){:target="_blank"}
=== "Yen4"
    [https://yen4.stanford.edu](https://yen4.stanford.edu){:target="_blank"}
=== "Yen5"
    [https://yen5.stanford.edu](https://yen5.stanford.edu){:target="_blank"}


## Do You See 504 Bad Gateway Time-Out Error?
To fix the 504 Bad Gateway Time-out error, try refreshing the browser (make sure you are not using Safari) or use a different Yen JupyterHub.


## Is JupyterHub Freezing Because of the Tabs You Have Open?
You can delete your `~/.jupyter/` directory. When you restart JupyterHub, any tabs that automatically opened should no longer be open.  

## Do You Have Write Access to the Directory You're In?
If you cannot write a file to the directory you're in, JupyterHub will have trouble launching notebooks or consoles. If you're unsure, navigate to your home directory and try again.

## Have You Installed Any Libraries Recently Which May Conflict With JupyterHub?
Conflicting libraries can cause errors, such as a 404 error when attempting to access JupyterHub. To troubleshoot:

1. `ssh` into the terminal.
2. Launch JupyterHub manually with `/opt/jupyterhub/bin/jupyter-lab`.

If JupyterHub starts correctly, you should see confirmation of a successful boot in your terminal. However, if there are errors related to specific libraries, uninstall the libraries and try again.

Known problematic libraries:

- [Tornado](https://www.tornadoweb.org/en/stable/){:target="_blank"}


## Still Experiencing Issues?

Please contact [the DARC team](mailto:gsb_darcresearch@stanford.edu), and we can help resolve the issues you are experiencing with JupyterHub on the Yens.

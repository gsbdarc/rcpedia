There are several common reasons why JupyterHub might not be working for you.

## Are you using Safari?
JupyterHub on the Yens has known issues with Safari.  Please use try a different browser, like Chrome or Firefox.

## Do you have access to the Yen servers? 
In order to access JupyterHub, you must have access to the Yen servers.  If you're not a member of the GSB, this means you must have an active SUNetID and get sponsorship via our Yen Access tool.  More information on sponsorship is available [**here**](/_policies/collaborators/)

## Have you logged into the Yens via the terminal at least once?
JupyterHub uses your home directory to store configuration.  Because your home directory is created on first login, you need to login to the Yens via `ssh` at least once before you can use JupyterHub.  You can find login instructions [**here**](/_getting_started/how_access_yens/#log-in-to-the-yens)
 
## Is your home directory full?
Because JupyterHub uses your home directory, it will not work if your home directory is over quota.  Please see [**this page**](/_user_guide/storage/#how-to-check-zfs-space-quota) for more information on checking your quota.

## Did you go to the right URL?
JupyterHub is available at:
=== "Yen1"
    [https://yen1.stanford.edu/jupyter](https://yen1.stanford.edu/jupyter)
=== "Yen2"
    [https://yen2.stanford.edu/jupyter](https://yen2.stanford.edu/jupyter)
=== "Yen3"
    [https://yen3.stanford.edu/jupyter](https://yen3.stanford.edu/jupyter)
=== "Yen4"
    [https://yen4.stanford.edu/jupyter](https://yen4.stanford.edu/jupyter)
=== "Yen5"
    [https://yen5.stanford.edu/jupyter](https://yen5.stanford.edu/jupyter)

!!! Warning
    if you get an "nginx" message, you went to *https://yen2.stanford.edu*

## Do you see 504 Bad Gateway Time-out error?
To fix 504 Bad Gateway Time-out error, try to refresh the browser (make sure you are not using Safari) or try a different yen JupyterHub.

## Do you have full SUNet Sponsorship?
A full SUNet is required for JupyterHub access.  Please see the [UIT sponsorship page](https://uit.stanford.edu/service/sponsorship) for details on sponsorship levels.

## Is JupyterHub freezing because of the tabs you have open?
You can delete your `~/.jupyter/` directory, and when you restart JupyterHub, any tabs that automatically opened should no longer be open.  

## Do you have write access to the directory you're in?
If you cannot write a file to the directory you're in, then JupyterHub will have trouble launching notebooks or consoles.  If you're unsure, navigate to your home directory and try again!

## Have you installed any libraries recently which may conflict with JupyterHub? 
This can present as a 404 error.  ssh into the terminal and Launch JupyterHub with `/opt/jupyterhub/bin/jupyter-lab` to check this. If everything is running correctly, you should get an indication of a successful boot in your terminal. If there are errors reguarding specific libraries, you may want to uninstall those libraries.
Known libraries to cause issues: [Tornado](https://www.tornadoweb.org/en/stable/)


## Still experiencing issues?

Please contact [the DARC team](mailto:gsb_darcresearch@stanford.edu), and we can help resolve the issues you are experiencing with JupyterHub on the Yens.

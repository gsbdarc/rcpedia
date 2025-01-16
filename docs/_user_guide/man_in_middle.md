# What is a "man-in-the-middle" warning?

## Understanding the warning

When you try to connect to a server using SSH, you might see a warning message like the one below.

This warning indicates that the server's host key—the unique identifier SSH uses to recognize the server—has changed since your last connection. This could happen due to legitimate reasons like server maintenance, upgrades, or reconfigurations. However, it could also signal a security threat, such as a man-in-the-middle attack where an unauthorized party is intercepting your connection. Hence the scary warning message.

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
```

You can resolve this by removing the mismatched host key in your `known_hosts` file.

The known_hosts file, located in your ~/.ssh/ directory, stores the host keys of servers you've connected to previously. SSH uses this file to verify the server's identity during connection attempts.


 The following loop can be run in your local terminal to run  `ssh-keygen` for all of the yens, which will clear out the entries in your `known_hosts` file:

```bash
mach=( "yen1" "yen2" "yen3" "yen4" )
for m in "${mach[@]}" ; do 
    ssh-keygen -R ${m}
    ssh-keygen -R ${m}.stanford.edu
done
```

## Reconnecting to the Yens

After removing the old host key, attempt to reconnect:

```bash
ssh your_username@yen1.stanford.edu
```

You will be prompted to accept the new host key:

```vbnet
The authenticity of host 'yen1.stanford.edu (XX.XX.XX.XX)' can't be established.
RSA key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```

Type `yes` to continue. The new host key will be added to your known_hosts file, and the connection will proceed.

Learn more about connecting to the Yens [here](../_getting_started/how_access_yens.md).

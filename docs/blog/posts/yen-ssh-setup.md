---
date:
  created: 2026-03-17 
categories:
    - Yen
authors:
    - nrapstin
---

# Passwordless SSH Between Interactive Yen Nodes
When working on the Yen cluster, you may occasionally want to connect from one Yen node to another—for example, to check a running process or run a command on a different node.

You can avoid entering your password each time by setting up **SSH key authentication**.

<!-- more -->

To follow the steps below, first open a terminal on an [interactive Yen node](/_getting_started/yen-servers/#how-to-connect){target="_blank"}.

## Step 1 — Create a Dedicated SSH Key
Create a key specifically for connecting between Yen nodes.

```bash title="Create a new SSH key for Yen nodes"
ssh-keygen -t ed25519 -f ~/.ssh/yen_ed25519 -C "$USER@yens"
```

This creates:
```{ .yaml .no-copy title="SSH key files created"}
~/.ssh/yen_ed25519
~/.ssh/yen_ed25519.pub
```

## Step 2 — Add the Key to `authorized_keys`

Allow this key to authenticate your account:

```bash title="Add your public key to authorized_keys"
cat ~/.ssh/yen_ed25519.pub >> ~/.ssh/authorized_keys
```


## Step 3 — Configure SSH for Yen Nodes

Create an SSH configuration so the correct key is automatically used.

```bash title="Configure SSH for yen1–yen5"
cat > ~/.ssh/config <<EOF
Host yen1 yen2 yen3 yen4 yen5
    IdentityFile ~/.ssh/yen_ed25519
    IdentitiesOnly yes
    GSSAPIAuthentication no
EOF
```

## Step 4 — Test the Connection

Try connecting to another Yen node:

```bash title="Test passwordless SSH"
ssh yen3
```

If the setup is successful, you should connect without being prompted for a password.

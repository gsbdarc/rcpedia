# How to Access the Yens

## Access Eligibility  

By default, GSB faculty, staff, PhD students, and research fellows have access. Others require sponsored access from a GSB faculty member. More info on [sponsored access](/_policies/collaborators){ :target="_blank" }. 

---

## Log In to the Yens

!!! important
    You need a SUNet ID and password to log into the Yens.

1. Open a shell. 
2. Run the following command:

    ```bash title="Terminal Command"
    ssh <SUNetID>@yen.stanford.edu
    ```

3. Authenticate using your SUNet ID password. You will not see your password being typed. Then, complete the two-factor authentication process with [Duo](https://uit.stanford.edu/service/authentication/twostep/smartphone){ :target="_blank" }.

If the login is successful, you will see something similar to the following:

![](/assets/images/ssh_yens.png)

## Log In to a Specific Yen

To log into a specific server (yen1, yen2, yen3, yen4 or yen5), use yenX in the `ssh` command. 
For example, to login to yen3, do:

```bash title="Terminal Command"
ssh <SUNetID>@yen3.stanford.edu
```

## Common Access Questions
### What Shell Should I Use?

#### Mac Users
Access the shell through the **Terminal** app (pre-installed).

#### Windows Users

- **Windows 10+ Users:**  
  Install Windows Subsystem for Linux (WSL) by running in Windows powershell:

    ```bash title="Powershell Command"
    wsl --install
    ```

  After installing and restarting your computer, search for **Ubuntu** and follow the setup instructions.  
  Tip: To enable copy and paste, click the top-left Ubuntu icon, go to Settings, and enable copy/paste.

- **Windows <10 Users:**  
  Use **Git Bash**, which comes with [Git for Windows](https://gitforwindows.org){:target="_blank"}.

#### Linux Users
Open your default shell app, often named **Shell** or something similar, depending on your OS.


### Graphical User Interface (GUI) Applications Access
For GUI applications such as Stata, use X-forwarding:

- **Mac OS:** Install [XQuartz](https://www.xquartz.org){:target="_blank"}. 

- **Windows 10+:** WSL supports X-forwarding natively so no third-party tool is needed. 

- **Windows <10:** Install [Xming](https://sourceforge.net/projects/xming/){:target="_blank"}.

Then, use:
```bash title="Terminal Command"
ssh -Y <SUNetID>@yen.stanford.edu
```


### Common Access Issues
1. **No Sponsored Yen Access**

    If you're not eligible by default, confirm you have sponsorship from a GSB faculty member.

2. **Access Not Renewed**

    Sponsored access may need periodic renewal. Verify if your access has expired.

3. **Scheduled Maintenance**

    The Yens undergo regular maintenance every two months. Downtime notifications are provided on login, via email and Slack.
    ```
    📅⏰⚠️  --> Next Downtime: March 26, 2020
    ```

4. **Remote Access Issues**

    Ensure you are connected to Stanford’s [VPN](https://uit.stanford.edu/service/vpn){:target="_blank"} when accessing the Yens remotely.

5. **Use Full Server Address**

    If you encounter an error like:
    ```bash title="Terminal Output"
    ssh: Could not resolve hostname yen1: nodename nor servname provided, or not known
    ```

    Ensure you use the full address:
    ```bash title="Terminal Command"
    ssh <SUNetID>@yen1.stanford.edu
    ```

This is a guide for making edits to new RCpedia website, using `git` to push your changes and testing locally first to preview the changes.

If you're doing this for the first time, start by cloning the repo to your local directory:

```
git clone https://github.com/gsbdarc/rcpedia_mockup.git
```

Switch to the QA branch first:

```
git checkout QA
```

Make a new feature branch and switch to it:

```bash
git checkout -b new-branch-name
```

Proceed to make changes. After you edit the page, preview in a local browser before committing the changes.

- Make `venv` that has the packages needed for website build:
```bash
cd rcpedia_mockup
python3 -m venv mkdocs
source mkdocs/bin/activate
pip install -r requirements.txt
```

- Build website:
```
mkdocs serve
```

- Navigate to `http://localhost:8000/` to view the website.

Confirm you have the most recent changes and no merge conflicts:
```
git pull QA <your branch file>
```

If changes look good, push the changes to your branch.

```
git add my_edited_page.md
git commit -m "good commit message"
git push
```

Lastly, make a PR to `QA` branch to merge your feature branch into `QA`. 

After your PR is approved by a team member, merge the PR and view the results at `https://rcpedia-dev.stanford.edu`.


## How to review PR locally:
To review someone’s PR from `<branch_name>` to QA, we want to build the site locally to see their changes:

```
git fetch --all

git checkout <branch_name> 

git pull origin <branch_name> 
```

View the changes locally. Assuming you have a venv described above, activate it and run “mkdocs serve”.



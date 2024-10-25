---
date:
  created: 2024-02-28
categories:
    - Reproducibility
    - Research
---
# Reproducible Research Essentials


This guide includes key components to consider when aiming for reproducible research, specifically focusing on documenting code and
computational environment, making a README file, documenting inputs and expected outputs, and providing clear instructions for replicating results.

<!-- more -->

## Documenting Fixed Inputs and Expected Outputs

* **Input Data**: Describe the data your code expects. Include format, structure, and examples. Mention any pre-processing steps required.
* **Expected Outputs**: Clearly define what outputs your code generates, including their formats and how to interpret them.
* **Data Sources**: If your research relies on specific datasets, provide information on how these can be accessed or obtained.
* **Test Cases**: Include test cases with known outputs to help users verify that the system is working correctly after setup.


## Code Documentation
Thorough documentation of your code is critical. Well-documented code allows researchers to adapt and run it on their systems, 
even if they do not use the same research computing environment (i.e. the Yens).

* **Purpose and Overview**: Begin by explaining the purpose of the code, the problem it solves, and how it fits into the broader research project. 
This gives context to potential users.
* **Dependencies**: List all external libraries or packages that your code depends on. This includes versions to avoid compatibility issues.
* **Code Structure**: Describe the structure of your codebase. If your project contains multiple modules or scripts, explain what each one does.
* **Function Documentation**: For each function or class, provide a short description, its inputs, outputs, and any side effects. Include examples if possible.
* **Version Control**: It is recommended to use version control systems like Git and to host the code repository on platforms like GitHub / GitLab. 

### Making a README File
README files provide a high-level overview, setup instructions, and usage examples. 

* **Installation Instructions**: Step-by-step guide to set up the environment. Include commands for installing dependencies.
* **Usage**: Explain how to run your code, including any command-line arguments or configurations needed.
* **Examples**: Provide examples that demonstrate how to use your project. Include both simple examples and more complex use cases if applicable.
* **License**: State the project's license, making it clear under what terms others can use, modify, or distribute your work.

Be transparent about the memory and compute requirements of your analysis. If the requirements are substantial, it might
 be unrealistic for individuals to replicate the study on a personal machine. In such cases, access to a similar HPC environment 
 would be necessary. <a href="/gettingStarted/3_intro_to_yens.html" target="_blank">Describing</a> the research computing 
 environment such as the Yens in your README can be a big help.
 
## Computational Environment Management
Effective environment management ensures that your research is reproducible by maintaining consistency across 
computational environments. This section covers the best practices for Python and R.

### Python

* **Virtual Environments**: Virtual environments are isolated spaces that allow you to manage project-specific 
dependencies without affecting the global Python setup. Tools like <a href="/topicGuides/pythonEnv.html" target="_blank">`venv`</a> 
are essential for creating these environments. 


It's crucial to save your environment, including all packages and their versions. This step is essential for anyone
 attempting to replicate your work. Ensuring that your environment is accurately documented and easily recreatable 
 will significantly aid in the replication process. This can also be achieved with a `pip freeze > requirements.txt` 
 command if you didn't explicitly use environments in your code. This `requirements.txt` can be then made into an environment, 
 but it may contain superfluous libraries. 

### R

* **RStudio and R Projects**: RStudio supports project-based management and package installation. Using R projects helps 
isolate workspace settings and library paths.

* **Package Management with `renv`**: The `renv` package in R is designed to create reproducible environments by 
capturing the state of all packages used in a project. `renv` automatically generates a lockfile (`renv.lock`) 
that details package versions and sources, which can be used to recreate the environment. 
Initialize `renv` in your project with:

```R
renv::init()
```
Share your project by including the `renv.lock` file in your code repo, so others can recreate the environment by running `renv::restore()`.

### Best Practices for Environment Management

* Document the setup and management of your environment in a README file, including how to install 
dependencies and any necessary configuration steps. 
* Include environment files like `requirements.txt` or `renv.lock` in your code repository 
to ensure that others can easily set up identical environments.


## Conclusions
In summary, focus on documentation of your code and computational environment, and be clear about the resource requirements. 
Utilizing a resource like GitHub can centralize all this information, allowing you to test the replicability of your work on different computers. 

All in all, reproducing code years later can be challenging, and the steps you take now can significantly enhance the reach and longevity of your paper. 
This approach will not only aid in ensuring the reproducibility of your work but also make it more accessible to others in the academic community. 

### Resources
Here are several valuable resources for researchers interested in making their research more reproducible:
* A <a href="https://experimentology.io/013-management.html" target="_blank">Guide</a> to project management.
It covers strategies for data organization, the sharing of research products (ensuring they adhere to the FAIR principles), 
and discusses the potential ethical constraints on sharing research materials. 

* Software Carpentry Guide to <a href="https://swcarpentry.github.io/git-novice/aio.html" target="_blank">Git</a>: the
class on version control using Git covering basic Git topics, setup and more advanced details. 

* The <a href="https://dataverse.org" target="_blank">Dataverse Project</a>: is an open-source research data repository 
software aimed at enhancing research data management and sharing. It offers researchers full control over their data, 
promotes increased visibility and citation counts, and supports the fulfillment of data management plans. 

## Advanced Topics 
* Consider more comprehensive documentation with specialized tools like Sphinx for Python projects 
to generate detailed documentation websites from docstrings in the code, making it easier for others to understand and use your work.
* Continuous Integration (CI) and Testing: CI services, like GitHub Actions or GitLab CI, automatically run tests and enforce code quality checks upon each commit or pull request. 
This automated workflow helps maintain high standards of code quality and ensures that contributions do not introduce errors.
* Publishing and Sharing: Obtaining a Digital Object Identifier (DOI) for your research software through platforms like Zenodo makes your software easily citable, 
enhancing its visibility and academic impact. This practice acknowledges software as a critical output of research efforts.
* Data Management: consider integrating Data Version Control (DVC) into your project.
* Open Access Repositories: platforms like arXiv, and Zenodo allow researchers to share preprints, datasets, and software, promoting open access to research findings. 
* Preregister your study: platforms like <a href="https://www.cos.io/initiatives/prereg" target="_blank">Center for Open Science</a> allow you to preregister 
your experiment before you conduct the analysis. 
* Containers: using containers like Podman, Docker and Singularity helps to encapsulate the 
entire runtime environment required for an application or analysis, including the software, libraries, and dependencies, 
in a way that is portable and consistent across different computing environments.



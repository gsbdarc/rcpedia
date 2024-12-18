---
date:
  created: 2024-02-28
categories:
    - Reproducibility
    - Research
authors:
    - nrapstin
subtitle: Reproducible Research Essentials
---

# Reproducible Research Essentials

This guide provides the foundational components needed to ensure reproducibility in your research. It focuses on:

- Documentating fixed inputs and expected outputs
- Making a README file
- Managing computational environments
- Summary with additional resources
- Advanced topics

<!-- more -->

There is also a **Research Computing and Reproducible Research** presentation available in the [Research Hub Training & Workshops](https://gsbresearchhub.stanford.edu/training-workshops?search=reproducible){target="_blank"}. There is a one-hour video, presentation slides, and a code link.

## Documenting Fixed Inputs and Expected Outputs

- **Input Data**:
Clearly describe the data your code expects, including its format, structure, and examples. Highlight any preprocessing steps required.

- **Expected Outputs**:
Define the outputs your code generates, specifying their formats and how they should be interpreted.

- **Data Sources**:
For external datasets, provide details on how to access or obtain them.

- **Test Cases**:
Include sample test cases with known outputs, enabling users to verify the functionality of your system after setup.

## Making a README File
A README file serves as the central guide to your project, offering an overview, setup instructions, and usage examples.

- **Installation Instructions**:
Provide step-by-step setup instructions, including commands for installing dependencies.

- **Usage**:
Explain how to run your code, detailing command-line arguments or configuration files as needed.

- **Examples**:
Share illustrative examples, ranging from simple cases to complex scenarios.

- **License**:
Clearly state the license governing the use, modification, and distribution of your project.

Additionally, include information about the memory and compute requirements of your analysis. For resource-intensive projects, note the necessity of high-performance computing environments, like the [Yens](/_getting_started/yen-servers){:target="_blank"}, and provide a description of these environments if applicable.

## Managing Computational Environment

Maintaining consistent computational environments is critical for reproducibility.

### Python
- **Virtual Environments**:
Use tools like `venv` to create isolated environments for managing dependencies. Save these configurations using `pip freeze > requirements.txt`.

- **Environment Files**:
Include environment specifications in your repository. While `requirements.txt` may contain superfluous libraries, it provides a starting point for replication.

- For more details, please refer to the [Python Virtual Environment Page](/_user_guide/best_practices_python_env){:target="_blank"}

### R
- **RStudio and Projects**:
Leverage RStudio's project-based setup to isolate workspace settings and library paths.

- **`renv` for Package Management**:
Use the `renv` package to capture project-specific package states. Share the resulting `renv.lock` file to enable seamless environment recreation.<br>
Initialize `renv` in your project with:
```R
renv::init()
```
Share your project by including the `renv.lock` file in your code repo, so others can recreate the environment by running `renv::restore()`.

### Best Practices for Environment Management

- Document the setup and management of your environment in a README file, including how to install 
dependencies and any necessary configuration steps. 
- Include environment files like `requirements.txt` or `renv.lock` in your code repository 
to ensure that others can easily set up identical environments.


## Summary
Investing in thorough documentation and environment management pays off by making your research more accessible and reproducible. Host your work on platforms like GitHub, test replicability on various systems, and include detailed README files to guide users.

Taking these steps ensures your research can be understood, validated, and built upon for years to come, significantly enhancing its impact.

## Additional Resources

- [Guide to Project Management](https://experimentology.io/013-management.html){target="_blank"}: Strategies for data organization, FAIR principles, and ethical constraints in sharing research materials.

- [Software Carpentry Git Guide](https://swcarpentry.github.io/git-novice/aio.html){target="_blank"}: Introductory and advanced topics on version control with Git.

- [The Dataverse Project](https://dataverse.org/){target="_blank"}: Open-source repository software for research data management and sharing.

## Advanced Topics 
- **Comprehensive Documentation**: Use tools like Sphinx for Python projects to create detailed documentation websites from code docstrings.
- **Continuous Integration (CI)**: Automate testing and code quality checks with CI tools like GitHub Actions or GitLab CI.
- **Publishing and Sharing**: Obtain DOIs for your research software on platforms like Zenodo.
- **Data Version Control (DVC)**: Integrate DVC to manage data and model versions.
- **Open Access Repositories**: Share research outputs on platforms like arXiv or Zenodo.
- **Preregistration**: Use platforms like the Center for Open Science to preregister your experiments.
- **Containers**: Employ Docker, Podman, or Singularity to encapsulate your runtime environment, ensuring portability across systems.

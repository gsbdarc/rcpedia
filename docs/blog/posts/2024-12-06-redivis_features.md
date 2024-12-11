---
date:
  created: 2024-12-06
categories:
    - redivis
    - data
    - big data
authors:
    - mason
subtitle: Introduction to Using Redivis

---

# Introduction to Using Redivis

[Redivis](https://redivis.com/){:target="_blank"} is a powerful data querying and analysis platform built specifically with [researchers in mind](https://redivis.com/for-researchers){:target="_blank"}. It is currently the GSB's solution for hosting Big Data (data on the scale of TBs) for researchers at the school. At the time of this post, the **StanfordGSBLibrary** Redivis organization hosts more than 50 datasets consisting of over 100 TB of data with 300 organization members.

If you are a researcher who is just starting to use Redivis, or considering using the platform, this blog post will help you get started by covering some common use cases and helpful tips. 

<!-- more -->

!!! note
    For a brief introduction on Redivis and its place within the GSB's research computing offerings, read [this page](/_user_guide/redivis/){:target="_blank"}.

## Use Cases
Redivis is a versatile platform and has many potential use cases. Here are some of the most common.

### Data Querying
One of the most striking features of Redivis is the ability to query data from large tables very easily and quickly. As an example, take this table of numerical data from [XBRL submissions filed by companies to the SEC](https://www.sec.gov/data-research/inline-xbrl){:target="_blank"}:

<iframe width="800" height="500" allowfullscreen src="https://redivis.com/embed/tables/stanfordgsblibrary.edgar_xbrl:6rpv:v3_24.num:qa4v#cells" style="border:0;"></iframe>

The table consists of over 300 million records and is over 60 GB in size. Running the following query in the "Query" tab that filters the data by two fields and then sorts the results takes fewer than 10 seconds.

```sql title="SQL Query"
SELECT * FROM `num:qa4v`
WHERE tag = 'StockholdersEquity' AND 
  ddate >= 20200101 AND 
  ddate<=20211231
ORDER BY adsh, ddate ASC
```

Compare this with what would be involved when working with the [raw source data](https://www.sec.gov/data-research/financial-statement-notes-data-sets){:target="_blank"}, which consists of nearly 100 zipped files each holding `.tsv` files representing the 8 tables in the dataset. There are many ways one could parse through these raw files to run the same query seen above, but running it at a comparable speed would involve custom coding, the use of parallel processing, memory resources, and strong experience with using research computing resources. 

### Data Manipulation
Similar to querying, it is also fast to run data manipulation tasks on Redivis. Using the same table embedded above, let's create two additional fields, extracting **`cik`** as a company identifier from the accession number `adsh` and the end year for the data **`ddate_year`** from `ddate`.

```sql title="SQL Query"
SELECT *,
  REGEXP_EXTRACT(adsh, r'''(\d+)-\d+-\d+''') AS cik,
  EXTRACT(YEAR FROM CAST(CAST(ddate AS STRING) AS DATE FORMAT 'YYYYMMDD')) AS ddate_year
FROM `num:qa4v`
```

This data manipulation takes just over a minute to run and produces the following table.

<iframe width="800" height="500" allowfullscreen src="https://redivis.com/embed/tables/mpjiang.sec_project_example:x9f9.create_cik_and_ddate_year_fields_output:jwcj#cells" style="border:0;"></iframe>

It is now possible to run filtering queries utilizing the two new fields `cik` and `ddate_year`.

### Persistent Workflows
It is very convenient to use the "Query" tab in any dataset table to quickly explore and filter data. However, if you are working on an extensive project that may involve several data pipelines that may need to be tweaked and re-run or need access to non-SQL resources such as Python and R, you can [create a workflow](https://docs.redivis.com/guides/analyze-data-in-a-workflow){:target="_blank"}. Workflows allow you to visually keep track of and save all of your data querying and manipulation work. A few important features of workflows include:

- **Working with Multiple Datasets**

    In a workflow, you can [add multiple datasets](https://docs.redivis.com/reference/workflows/data-sources#datasets-as-a-data-source){:target="_blank"} to a single working space for you to query, manipulate, and merge. For instance, this [example workflow](https://redivis.com/workflows/x9f9-2wm04c5pn){:target="_blank"} brings together the aforementioned [EDGAR XBRL dataset](https://redivis.com/datasets/6rpv-9nmqw5tg2){:target="_blank"} with a separate [EDGAR Filings dataset](https://redivis.com/datasets/dq12-4q4st0kjt){:target="_blank"} to merge together relevant information from both datasets.

- **Building SQL-free Transforms**

    A large selling point for non-technical (and technical) researchers with Redivis is the ability to [construct data querying and manipulation routines with transforms](https://docs.redivis.com/guides/analyze-data-in-a-workflow/reshape-data-in-transforms){:target="_blank"}. Transforms refer to Redivis's SQL-free user interface for building queries that still utilize the powerful backend engine, but conceal the SQL code with buttons and dropdown menus. An expansive array of tasks can be run with transforms and it is best to refer to [Redivis documentation on all of the possibilities](https://docs.redivis.com/reference/workflows/transforms){:target="_blank"}.

- **Launching Notebooks**

    While much can be done with Redivis transforms, certain more complex or software-specific data manipulation routines can sometimes best be accomplished in [Redivis notebooks](https://docs.redivis.com/guides/analyze-data-in-a-workflow/work-with-data-in-notebooks){:target="_blank"}. With notebooks, you can launch a Python, R, or Stata kernel with [an array of compute resources](https://docs.redivis.com/reference/workflows/notebooks/compute-resources){:target="_blank"}. The default free notebook configuration offers:
    
    - 2 vCPUs (Intel Ice Lake or Cascade Lake)
    - 32GB RAM
    - 6 hr max duration
    - 30min idle timeout (no code is being written or executed)

    !!! warning
        Custom notebook compute configurations that stray from the default free configuration will [cost you money](https://docs.redivis.com/reference/your-account/compute-credits-and-billing){:target="_blank"} and can be very expensive, as is typical with cloud resources. If you need consultation on whether purchasing compute resources on Redivis is the right path for your analysis, please [contact the GSB Data, Analytics, and Research Computing team](mailto:gsb_darcresearch@stanford.edu){:target="_blank"}.

    In notebooks, you can create visualizations, utilize software-specific packages, and also generate output files or even [tables that can be used again in your Redivis workflow](https://docs.redivis.com/guides/analyze-data-in-a-workflow/work-with-data-in-notebooks#id-7.-create-an-output-table){:target="_blank"}.

### Collaboration and Sharing
Understanding that research projects are generally built off of collaboration, Redivis has a number of mechanisms in place for access control and sharing. Both [workflows](https://docs.redivis.com/reference/workflows/access-and-privacy){:target="_blank"} and [datasets](https://docs.redivis.com/reference/data-access){:target="_blank"} allow for fine-grained access control. Furthermore, [studies](https://docs.redivis.com/guides/discover-and-access-data/create-a-study){:target="_blank"} can be used to further organize workflows and datasets under a single conceptual topic. When in the stage of publishing your work, Redivis also has [a number of features in mind](https://docs.redivis.com/guides/export-and-publish-your-work){:target="_blank"} that allow you to export your code or build a site with embedded tables.

## Helpful Tips
Here are a few quick tips based on common questions that we have received from researchers.

### Exporting Data
There are [numerous ways to export data from Redivis](https://docs.redivis.com/reference/datasets/exporting-data){:target="_blank"}, but consider the size of the data that you are exporting prior to doing it or [requesting an export approval](https://docs.redivis.com/reference/data-access/usage-rules#requesting-export-approval){:target="_blank"}. Many of the datasets hosted by the GSB on Redivis are hundreds of GBs to several TBs in total size. **It is highly recommended to leverage the powerful backend querying engine of Redivis for as much of your data exploration, filtering, manipulation, and merging work as possible** before exporting data to an external environment for any remaining analysis.

!!! note
    Many of the datasets hosted by the GSB have export restrictions that limit which external environments data can be exported to and how much data can be exported. Many exports also require explicit approval from an administrator of the **StanfordGSBLibrary** Redivis organization. These measures ensure that researchers using these datasets are in compliance with language in data use agreements and that researchers do not frivolously export massive amounts of data outside of Redivis.

### Using the API
Redivis [maintains an API](https://apidocs.redivis.com/){:target="_blank"} that allows users to interface with datasets hosted in Redivis both within Redivis workflow notebooks and in environments external to Redivis. In particular, there are both Python ([`redivis-python`](https://apidocs.redivis.com/client-libraries/redivis-python){:target="_blank"}) and R ([`redivis-r`](https://apidocs.redivis.com/client-libraries/redivis-r){:target="_blank"}) libraries that wrap this API for convenient use in code written in those languages. A few quick notes:

- Authentication is performed [through the OAuth protocol](https://apidocs.redivis.com/client-libraries/redivis-python/getting-started#from-another-environment-oauth){:target="_blank"} by which you will be prompted to login with your Redivis account when you first try to run commands within the language-specific libraries. No API token is necessary.
- For downloading larger tables or exports from Redivis, use the [exports API](https://apidocs.redivis.com/rest-api/exports){:target="_blank"}, which is recommended for data exports larger than several GB and required for exports larger than 100 GB. Export functions are available in both the Python and R Redivis API libraries.
- Issues experienced with the Python and R API libraries can be filed in the [`redivis-python` GitHub repository](https://github.com/redivis/redivis-python/issues){:target="_blank"} and the [`redivis-r` GitHub repository](https://github.com/redivis/redivis-r/issues){:target="_blank"} respectively.

### Importing Data
In addition to using the datasets hosted by the GSB, individual Redivis users have the ability to [import their own datasets](https://docs.redivis.com/guides/create-and-manage-datasets){:target="_blank"} into Redivis that only they have access to. Access to these datasets [can also be configured](https://docs.redivis.com/guides/create-and-manage-datasets/create-and-populate-a-dataset#id-5.-configure-access){:target="_blank"} for other Redivis users by the user who uploaded the dataset.

!!! note
    Each Redivis user has a [10 GB storage limit](https://docs.redivis.com/reference/your-account/compute-credits-and-billing#usage-limits){:target="_blank"} for datasets and files imported into their own Redivis account. If you have a dataset that is critical to your research that you would like in Redivis, but exceeds the 10 GB limit, please [contact the GSB Data, Analytics, and Research Computing team](mailto:gsb_darcresearch@stanford.edu){:target="_blank"} for further consultation.
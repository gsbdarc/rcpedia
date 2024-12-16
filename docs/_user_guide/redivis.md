# Redivis
<a href="https://redivis.com/">
  <img src="/assets/images/redivis_logo.png" alt="Redivis Logo" style="float: right; width: 275px; height: auto;">
</a>

[Redivis](https://redivis.com/){:target="_blank"} is a powerful data querying and analysis platform built specifically with [researchers in mind](https://redivis.com/for-researchers){:target="_blank"}. Redivis is constructed on top of [Google Cloud's BigQuery engine](https://cloud.google.com/bigquery){:target="_blank"}, which makes working with Big Data on the multi-TB scale much faster. Data manipulation and queries that may take many hours to run on computing systems like the Yens, can take seconds on Redivis.

## Why Redivis?

It has always been a major challenge to find a computing and storage solution for Big Data analysis that is intuitive for less technical researchers while still being powerful enough to support intensive data manipulation and queries. There are plenty of potential solutions including locally-hosted database servers and cloud-hosted services (AWS Athena, AWS Redshift, AWS RDS, Google Cloud BigQuery, etc.), but they can be very costly, time consuming to set up, cryptic to manage, unintuitive to use, or some combination of all of the above. The Redivis platform provides the best balance of all of these factors and is our default solution for hosting large datasets for researchers at the GSB.

Furthermore, Redivis has particular points of emphasis on data security and access controls, creating a safe environment for collaborative research work with all types of data. 

### Data Security

Unlike the Yens, which is [only approved for Moderate risk data](/_policies/security/#yen-servers){:target="_blank"}, Redivis is approved for [High risk data](https://uit.stanford.edu/guide/riskclassifications#data-classification-examples){:target="_blank"}. This includes highly-sensitive data such as social security numbers and protected health information (PHI). This is possible, because Redivis has a [number of protective measures](https://redivis.com/security){:target="_blank"} built into the platform. The fact that Redivis has been approved for High risk data makes it a unique data processing platform at Stanford University and serves as a viable hosting option for researchers negotiating with data vendors for sensitive data.

!!!tip
    Visit our [Security page](/_policies/security/){:target="_blank"} to learn more about what data and information security mean at both Stanford GSB and Stanford University.

### Fine-Grained Access Control

Redivis offers fine-grained access control to most facets of its platform, including at the levels of

- [Organization](https://docs.redivis.com/guides/administer-an-organization#id-5.-manage-members-and-studies){:target="_blank"} -- Who is able to access or apply to access to datasets within an organization?
- [Dataset](https://docs.redivis.com/reference/data-access/access-levels){:target="_blank"} -- Who is able to use or edit a particular dataset? How much of a dataset can an individual member see?
- [Export](https://docs.redivis.com/reference/data-access/usage-rules){:target="_blank"} -- Can a subset or derivative of a dataset be exported? If so, to what environment? How much data can an individual export?
- [Worfklow](https://docs.redivis.com/reference/data-access/data-access-in-workflows){:target="_blank"} -- Who is able to see, copy, or edit the work done in a workflow?

These straightforward access controls make the platform flexible for both administrators and researchers alike to manage datasets and research work.

## Getting Access

### Access to Organization

The GSB has their own Redivis organization ([**StanfordGSBLibrary**](https://redivis.com/StanfordGSBLibrary){:target="_blank"}) within the greater [Stanford Data Farm](https://redivis.com/Stanford){:target="_blank"} pool of organizations. To join the GSB's Redivis organization, follow [the directions on this page](https://gsb-research-help.stanford.edu/library/faq/358602){:target="_blank"}. After you join the organization, you can start using the datasets that are already available to you.

Once you have a Redivis account, you can also join the organization hosted by Stanford Libraries ([**SUL**](https://redivis.com/SUL){:target="_blank"}), which features [an array of datasets](https://redivis.com/SUL/datasets){:target="_blank"} that may be of interest to GSB researchers. Note that the set of datasets in this organization is not maintained by the GSB so you should [contact Research Data Services at SUL](https://docs.google.com/forms/d/e/1FAIpQLSetdXE6wmr5e7Qdor31lCfl9OLsKRm50Ph08tWJbRkACl9dWg/viewform){:target="_blank"} instead for support.

### Access to Datasets

There are a [number of datasets hosted in the **StanfordGSBLibrary** organization](https://libguides.stanford.edu/az.php?q=redivis){:target="_blank"} that require additional approval. You will need to apply for access to these datasets individually.

## Where Do I Start?

To start, Redivis has [extensive documentation](https://docs.redivis.com/){:target="_blank"} about their platform, which even includes [example workflows](https://docs.redivis.com/guides/analyze-data-in-a-workflow/example-workflows){:target="_blank"} that discuss specific data pipelines and use cases.

We recommend watching the video below for a quick overview:
<iframe width="560" height="315" src="https://www.youtube.com/embed/u78wHnGibbg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

!!!tip
    Read [our blog post](/blog/2024/12/06/introduction-to-using-redivis/){:target="_blank"} covering key use cases and helpful tips for Redivis based on our experience with the platform and working with other users.

## When Do I Use Redivis?

The Redivis platform is best used when you want to...

- **Initially explore and query datasets hosted in the StanfordGSBLibrary Redivis organization** 
    
    You do not need to start by exporting entire tables within datasets or querying data via the Redivis API.

- **Subset or aggregate large datasets (multi-TB) for further processing elsewhere** 

    Leveraging the BigQuery-backed [data transforms](https://docs.redivis.com/guides/analyze-data-in-a-workflow/reshape-data-in-transforms){:target="_blank"} within Redivis for this type of data processing will be faster and more efficient for you compared with using your laptop or the Yens.

- **Merge small personal datasets, like Excel spreadsheets, with data hosted on Redivis**

    With the ability to [create your own datasets](https://docs.redivis.com/guides/create-and-manage-datasets){:target="_blank"} within your own account and to [upload your own lists](https://docs.redivis.com/reference/workflows/transforms/value-lists){:target="_blank"}, you can perform dataset merging operations within the Redivis platform and forego exporting data outside Redivis.

- **Work with [High risk data](https://uit.stanford.edu/guide/riskclassifications#data-classification-examples){:target="_blank"}**

    Although there are other options at Stanford for working with Big Data that is classified as high risk ([Nero GCP](https://nero-docs.stanford.edu/){:target="_blank"}), Redivis is fully approved and offers performant computing resources out-of-the-box that would otherwise need to be configured on your own.

## Where Do I Ask for Help?

Depending on the nature of your question, there are several places that you can go for help:

- For Redivis platform-specific questions, you can join the [#redivis-users](https://stanford.enterprise.slack.com/archives/C07FT1C7MBM){:target="_blank"} Slack channel hosted for GSB researchers and ask questions there.
- For questions about access to datasets hosted on the **StanfordGSBLibrary** Redivis organization, [email the GSB Research Data Coordination team](mailto:gsb-library_research-data-coordination@stanford.edu){:target="_blank"}.
- For questions about hosting your own large datasets on Redivis, [email the GSB Data, Analytics, and Research Computing (DARC) team](mailto:gsb_darcresearch@stanford.edu){:target="_blank"}.
- For questions about the content of specific datasets hosted on the **StanfordGSBLibrary** Redivis organization, [fill out the GSB Library Ask Us form](https://www.gsb.stanford.edu/library/research-support/ask-us){:target="_blank"}.

!!!note
    The DARC team is happy to perform the technical work to help GSB faculty researchers host datasets on Redivis, but there are [associated storage costs on the Redivis platform](https://docs.redivis.com/reference/organizations/billing){:target="_blank"} that will need to be covered by the researcher.
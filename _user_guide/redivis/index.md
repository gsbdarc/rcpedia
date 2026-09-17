# Redivis

[Redivis](https://redivis.com/) is a powerful data querying and analysis platform built specifically with [researchers in mind](https://redivis.com/for-researchers). Redivis is constructed on top of [Google Cloud's BigQuery engine](https://cloud.google.com/bigquery), which makes working with Big Data on the multi-TB scale much faster. Data manipulation and queries that may take many hours to run on computing systems like the Yen servers, can take seconds on Redivis.

## Why Redivis?

It has always been a major challenge to find a computing and storage solution for Big Data analysis that is intuitive for less technical researchers while still being powerful enough to support intensive data manipulation and queries. There are plenty of potential solutions including locally-hosted database servers and cloud-hosted services (AWS Athena, AWS Redshift, AWS RDS, Google Cloud BigQuery, etc.), but they can be very costly, time consuming to set up, cryptic to manage, unintuitive to use, or some combination of all of the above. The Redivis platform provides the best balance of all of these factors and is our default solution for hosting large datasets for researchers at the GSB.

Furthermore, Redivis has particular points of emphasis on data security and access controls, creating a safe environment for collaborative research work with all types of data.

### Data Security

Unlike the Yen cluster, which is [only approved for Moderate risk data](/_policies/security/#yen-servers), Redivis is approved for [High risk data](https://uit.stanford.edu/guide/riskclassifications#data-classification-examples). This includes highly-sensitive data such as social security numbers and protected health information (PHI). This is possible, because Redivis has a [number of protective measures](https://redivis.com/security) built into the platform. The fact that Redivis has been approved for High risk data makes it a unique data processing platform at Stanford University and serves as a viable hosting option for researchers negotiating with data vendors for sensitive data.

Learn More

Visit our [Security page](/_policies/security/) to learn more about what data and information security mean at both Stanford GSB and Stanford University.

### Fine-Grained Access Control

Redivis offers fine-grained access control to most facets of its platform, including at the levels of

- [Organization](https://docs.redivis.com/guides/administer-an-organization#id-5.-manage-members-and-studies) -- Who is able to access or apply to access to datasets within an organization?
- [Dataset](https://docs.redivis.com/reference/data-access/access-levels) -- Who is able to use or edit a particular dataset? How much of a dataset can an individual member see?
- [Export](https://docs.redivis.com/reference/data-access/usage-rules) -- Can a subset or derivative of a dataset be exported? If so, to what environment? How much data can an individual export?
- [Worfklow](https://docs.redivis.com/reference/data-access/data-access-in-workflows) -- Who is able to see, copy, or edit the work done in a workflow?

These straightforward access controls make the platform flexible for both administrators and researchers alike to manage datasets and research work.

## Getting Access

### Access to Organization

The GSB has their own Redivis organization ([StanfordGSBLibrary](https://redivis.com/StanfordGSBLibrary)) within the greater [Stanford Data Farm](https://redivis.com/Stanford) pool of organizations. To join the GSB's Redivis organization, follow [the directions on this page](https://gsb-research-help.stanford.edu/library/faq/358602). After you join the organization, you can start using the datasets that are already available to you.

Once you have a Redivis account, you can also join the organization hosted by Stanford Libraries ([SUL](https://redivis.com/SUL)), which features [an array of datasets](https://redivis.com/SUL/datasets) that may be of interest to GSB researchers. Note that the set of datasets in this organization is not maintained by the GSB so you should [contact Research Data Services at SUL](mailto:ask-data-services@lists.stanford.edu) instead for support.

### Access to Datasets

There are a [number of datasets hosted in the StanfordGSBLibrary organization](https://libguides.stanford.edu/az.php?q=redivis) that require additional approval. You will need to apply for access to these datasets individually.

## Where Do I Start?

To start, Redivis has [extensive documentation](https://docs.redivis.com/) about their platform, which even includes [example workflows](https://docs.redivis.com/guides/analyze-data-in-a-workflow/example-workflows) that discuss specific data pipelines and use cases.

We recommend watching the video below for a quick overview:

Learn More

Read [our blog post](/blog/2024/12/06/introduction-to-using-redivis/) covering key use cases and helpful tips for Redivis based on our experience with the platform and working with other users.

## When Do I Use Redivis?

The Redivis platform is best used when you want to...

- **Initially explore and query datasets hosted in the StanfordGSBLibrary Redivis organization**

  You do not need to start by exporting entire tables within datasets or querying data via the Redivis API.

- **Subset or aggregate large datasets (multi-TB) for further processing elsewhere**

  Leveraging the BigQuery-backed [data transforms](https://docs.redivis.com/guides/analyze-data-in-a-workflow/reshape-data-in-transforms) within Redivis for this type of data processing will be faster and more efficient for you compared with using your laptop or the Yen cluster.

- **Merge small personal datasets, like Excel spreadsheets, with data hosted on Redivis**

  With the ability to [create your own datasets](https://docs.redivis.com/guides/create-and-manage-datasets) within your own account and to [upload your own lists](https://docs.redivis.com/reference/workflows/transforms/value-lists), you can perform dataset merging operations within the Redivis platform and forego exporting data outside Redivis.

- **Work with [High risk data](https://uit.stanford.edu/guide/riskclassifications#data-classification-examples)**

  Although there are other options at Stanford for working with Big Data that is classified as high risk ([Nero GCP](https://nero-docs.stanford.edu/)), Redivis is fully approved and offers performant computing resources out-of-the-box that would otherwise need to be configured on your own.

## Where Do I Ask for Help?

Depending on the nature of your question, there are several places that you can go for help:

- For Redivis platform-specific questions, you can join the [#redivis-users](https://stanford.enterprise.slack.com/archives/C07FT1C7MBM) Slack channel hosted for GSB researchers and ask questions there.
- For questions about access to datasets hosted on the StanfordGSBLibrary Redivis organization, [email the GSB Research Data Coordination team](mailto:gsb-library_research-data-coordination@stanford.edu).
- For questions about hosting your own large datasets on Redivis, [email the GSB Data, Analytics, and Research Computing (DARC) team](mailto:gsb_darcresearch@stanford.edu).
- For questions about the content of specific datasets hosted on the StanfordGSBLibrary Redivis organization, [fill out the GSB Library Ask Us form](https://www.gsb.stanford.edu/library/research-support/ask-us).

Storage Costs

The DARC team is happy to perform the technical work to help GSB faculty researchers host datasets on Redivis, but there are [associated storage costs on the Redivis platform](https://docs.redivis.com/reference/organizations/billing) that will need to be covered by the researcher.

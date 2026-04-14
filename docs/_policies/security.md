# Security

Stanford is committed to protecting the privacy of its students, alumni, faculty, and staff, as well as protecting the confidentiality, integrity, and availability of information important to the University's mission. 

## Data Classification

The University provides a [simple categorization of data risk levels](http://dataclass.stanford.edu/){:target="_blank"} to clarify the safeguards needed when working with data of different types. The University has developed [minimum security standards](https://uit.stanford.edu/guide/securitystandards){:target="_blank"} for servers that are used for each of these types of data. Presently, the risk categorizations can be summarized as follows:

| Risk Type      | Simplified Description | Example
| ----------- | ----------- | -----------
| Low      | Public data       | SEC Filings
| Moderate   | Private data        | Stanford-licensed dataset
| High   | Protected data  | Medical insurance claims

It is **your** responsibility as a researcher to be a responsible steward of your data. If you're ever unsure the risk categorization of your data, please [contact us](mailto:gsb_darcresearch@stanford.edu){:target="_blank"} to discuss how to best achieve your research goals while being mindful of data security.

!!! danger "The Yen Servers Are **Not** Approved for High Risk Data."
    The Yen cluster is approved for use with Low and Moderate risk data. Other Stanford systems, such as [Nero](https://nero-docs.stanford.edu/){:target="_blank"} and [Carina](https://carinadocs.sites.stanford.edu/){:target="_blank"} are designed for High Risk Data.
If you choose to use your own independent system (e.g., your own machine in the cloud), you are responsible for correctly managing any secure data and credentials necessary.


## Yen Cluster

The Yen servers are approved to handle Moderate and Low Risk data. They are currently stored in a secure, centrally-managed data center on the Stanford Historical Campus. Consistent with minimum security standards, the Yen servers have the following security features:

* Required Single-Sign On with Multi Factor Authentication
* Centralized logging
* Patching and vulnerability scans

While the Yen servers do protect data from unauthorized access, there are no mechanisms in place to control the export of data.

## Managing Collaborators

On the Yens, a shared project space is provisioned for each new project and has a faculty owner, as well as collaborators who can access the shared space. Each project space is assigned a project space workgroup (`gsb-rc:[faculty-SUNet]-[projectname]`).

Adding (and removing) users to your shared project space is self-service and can be managed as described [here](/_policies/workgroups/#addingremoving-users-to-your-workgroup){:target="_blank"}. For GSB faculty members, adding [collaborators external to the GSB](/_policies/collaborators/){:target="_blank"} to your workgroup also grants those people access to the Yens.

Note that it is **your** responsibility to ensure the correct researchers are listed in your project workgroup, that they have the appropriate role (Member or Administrator, discussed [here](/_policies/workgroups/){:target="_blank"}), *and* that they have taken the necessary steps to use any data in your project.

## Contractual Requirements

If you are using licensed data, the storage, processing, sharing and publication of this data may be limited by agreement with the data provider.  It is **your** responsibility to understand the limitations of use for your data, particularly in consideration of:

* collaborations outside of the GSB
* copying data to a new environment
* merging restricted data with other datasets
* leaving the GSB
* using AI tools or Agents

For data licensed by the GSB Library, please refer to this [eResources Guide](https://www.gsb.stanford.edu/library/research-resources/usage-policy) for additional requirements including limitations on scraping, sharing credentials and external distribution.

If you have any questions or concerns about use of your data, please [contact the Research Hub](mailto:gsb-library_research-data-coordination@stanford.edu){:target="_blank"} to discuss your specific situation.

## AI Tooling, Claude Code & Cursor

When working with AI tools, there are additional considerations for researchers.

!!! danger "University Approved Systems"
    Stanford's Information Security Office maintains a list of reviewed and approved (or discouraged) services at the [GenAI Tool Evaluation Matrix](https://uit.stanford.edu/ai/genai-tool-matrix){:target="_blank"}.


### Licensed Data

Data licenses can have specific clauses about where the data can be stored, as well as the degree to which AI can (or can't) be used on that data. When we license these data sets, it's important that we do our best to follow those licenses, which can sometimes require some interpretation or guidance. If you have any questions or concerns about using AI with your data, please [contact the Research Hub](mailto:gsb-library_research-data-coordination@stanford.edu){:target="_blank"}.

### Configuration Matters

Tools like Cursor and Claude Code work by scanning files it has access to. It is imperative that you know which files are being provided to these tools, and that you provide only the files that these tools need. If Cursor inadvertently is granted access to a data directory, for instance, that data may be sent to a third party server and stored and processed in unexpected ways. Consider isolating these tools, potentially including running them in a containerized environment that provides another layer of data isolation. If possible, you may be able to configure these tools to emit verbose logs of the actions they take, so that you can confirm that they are only scanning the files that you intend, and save the logs for any potential auditing in the event that a data provider raises concerns in the future. In addition, you can request that these tools do not store your data -- the configurations vary by tool, but whenever possible you should be providing as little code, data and personal information to these tools.

### Other Tooling can Help

Claude Code and Cursor are complicated tools, but at their core is one or more large language models. You may be able to use a specific model from, e.g., Stanford's managed [AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){:target="_blank"}, which can reduce your exposure risk. These tools have been vetted by Stanford IT for data security, and will give you an API key that is billed directly back to a Stanford account. In general, it is preferred to use Stanford's tools or locally installed tools to expose as little data as possible.

### Data Risk 

Stanford categorizes data risk into three broad categories, low (mostly public data), moderate (mostly private data) and high (data that comes with legal ramifications). High risk data needs to be treated with extreme caution, and if you're using any amount of high risk data, you should avoid using any tools except those explicitly reviewed and approved by Stanford's IT department. Even if you're not using high risk data with Claude Code or Cursor, storing it on the same system means that misconfiguration or accidents could expose the university to legal consequences. 



## Information Security

No matter how secure our research computing servers are, if your own computer is compromised, it compromises the security of our environment.

!!! tip "Protect Your Personal Machine"
    Stanford's Information Security Office has a [full site](https://uit.stanford.edu/security){:target="_blank"} to help protect your data and devices.


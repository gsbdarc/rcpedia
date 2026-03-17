---
date:
  created: 2026-03-06 
categories:
    - LLM
authors:
    - astorer
---

# Stanford's LLM API Tools

If you need to use LLMs via an API, Stanford provides an official [AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){:target="_blank"}. This tool provisions API keys and ties the billing to a Stanford account for simple usage and billing.

<!-- more -->

!!! info "Under Construction"
    The AI API Gateway is a developing service, provided as a result of the hard work of our UIT colleagues. This page describes our observations at the time of this writing, but the latest information will be on the official documentation.


## Security and Compliance

The AI API Gateway is approved for Low and Moderate Risk Data. Much like the Yen Servers, the AI API Gateway is *not* approved for High Risk data.

Before using any AI tools with licensed data, please confirm that your license terms support use with AI tools. You can always reach out to the [Research Hub's Data Acquisition and Governance team](https://gsbresearchhub.stanford.edu/support-units/data-acquisition-and-governance){:target="_blank"} to help with licensing questions at the GSB.

## Requesting a Key

To request an API key, you need to submit a [help ticket](https://stanford.service-now.com/it_services?id=sc_cat_item&sys_id=fd75ec563b90265079a53434c3e45a65){:target="_blank"} with the following information:

* AI Models Requested
* Name for your key
* Business purpose
* Maximum monthly budget
* Estimated daily requests
* Due date
* Stanford Account (PTA)

Models from Anthropic, OpenAI, Google, Meta and DeepSeek are included. You may include as many or as few models as you need.

## Using the Key

Once you have your key, you can use it with the familiar OpenAI interface:

!!! danger "Do Not Hardcode API Keys!"
    For security reasons, do not include plaintext API keys in your code. Store them in environment variables or a `.env` file instead.

```python
import requests

url = "https://aiapi-prod.stanford.edu/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}", # don't hardcode keys!
    "Content-Type": "application/json",
}

payload = {
    "model": "claude-3-7-sonnet",  # any model you requested access to
    "stream": False,               # set to True if you want a streaming response
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
}

response = requests.post(url, headers=headers, json=payload)
```

For structured outputs, we recommend using `pydantic` to define a schema, and the `openai` library to convert this schema to a JSON:

```python
from pydantic import BaseModel
from openai.lib._pydantic import to_strict_json_schema

class SamplePydanticSchema(BaseModel):
    response: str

payload = {
    "model": "claude-3-7-sonnet",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    "response_format": to_strict_json_schema(SamplePydanticSchema)
}
```

## Known Limitations

- **Billing**: You are billed on a monthly basis, and detailed breakdowns of model use and token numbers are not provided. Please verify the [posted rates](https://uit.stanford.edu/service/ai-api-gateway/rates){{:target="_blank"}}
- **Speed**: The AI API Gateway is often significantly slower than using commercially available models.
- **Batch**: The AI API Gateway does not support "batch mode," which many commercial providers offer to enable volume discounts and more efficient processing of large workloads. Users working with large datasets should also account for rate limits and may need to throttle requests or process data in smaller batches.
- **Model Flexibility**: The key you created is scoped to *only* the models you pick at the time of its creation. You need to request a new key to use different models (including newly released models). Furthermore, older models are removed without notice.

## Questions?

If you have further questions, please start with the [official FAQ](https://uit.stanford.edu/service/ai-api-gateway/faqs).
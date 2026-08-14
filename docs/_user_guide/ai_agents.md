# AI Coding Agents on the Yens

Several AI coding agents are available on the Yens as modules, including
[Claude Code](https://docs.claude.com/en/docs/claude-code/overview){target="_blank"},
[Codex CLI](https://developers.openai.com/codex/cli/){target="_blank"}, and
[Gemini CLI](https://google-gemini.github.io/gemini-cli/){target="_blank"}. These are agentic
command-line tools: they read files in your working directory, run commands on your behalf,
and send that context to an external model provider to generate responses.

Because these tools transmit your code and data to third-party services, using them on a
shared research environment carries real data-governance responsibilities. Read the warning
below **before** you load or run any of these tools.

!!! danger "Know What Data You Send to AI Tools"
    It is **your** responsibility to know what data an AI agent can access and transmit on
    your behalf. These tools scan the files they are pointed at and send that content to
    external providers.

    - **Do not** use these tools with any data covered by a signed **Data Use Agreement
      (DUA)** or **NDA**, or with licensed data whose terms restrict AI use.
    - **Do not** feed data licensed by the GSB Library into an external AI tool. The library's
      [eResources Usage Policy](https://www.gsb.stanford.edu/library/research-resources/usage-policy){target="_blank"}
      has an **"AI or LLM usage"** section covering what is and is not permitted with
      licensed content.
    - Even if you are not using restricted data with an agent, storing restricted data on the
      same system means a misconfiguration or accident could expose it. Check Stanford's
      [guidance on which AI services are approved for which data](https://uit.stanford.edu/ai/services/explore){target="_blank"}
      before you begin.
    - If you are unsure whether your data can be used with AI tools, **contact the
      [GSB Data Acquisition and Governance team](https://gsbresearchhub.stanford.edu/support-units/data-acquisition-and-governance){target="_blank"}
      at [gsb-library_research-data-coordination@stanford.edu](mailto:gsb-library_research-data-coordination@stanford.edu){target="_blank"}
      before you use them.**

## Load an Agent Module

On the Yens, the AI agents are available via the `module` command. See all currently
installed versions with:

```title="Terminal Input"
module avail claude-code codex gemini
```

You will see the available agent versions listed:

```{.yaml .no-copy title="Terminal Output"}

------------------------------------------------------------------------ Global Aliases -------------------------------------------------------------------------


-------------------------------------------------------------------- /software/modules/Core ---------------------------------------------------------------------
   claude-code/2.1.220    codex/0.146.0    gemini/0.53.1
```

To use an agent, load its module:

=== "Claude Code"
    ```title="Terminal Input"
    ml claude-code
    ```

=== "Codex"
    ```title="Terminal Input"
    ml codex
    ```

=== "Gemini CLI"
    ```title="Terminal Input"
    ml gemini
    ```

This loads the default version. To pin a specific one:

```title="Terminal Input"
ml claude-code/2.1.220
```

For a refresher on how modules work, see [Modules](/_getting_started/modules/){target="_blank"}.

## Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code/overview){target="_blank"} is
Anthropic's agentic coding tool. With the module loaded, launch it from your project
directory:

```title="Terminal Input"
claude
```

### Authenticating

Claude Code is available to Stanford users through Stanford's
[**Claude for Education**](https://uit.stanford.edu/service/claude){target="_blank"} service,
which covers use of the CLI. When you first run `claude`, follow the prompts to sign
in with your **Stanford account**.

This is the recommended route — your usage falls under Stanford's agreement with Anthropic. To
use Stanford's AI API Gateway instead, see
[Using the AI API Gateway](#using-the-ai-api-gateway) below.

Claude Code works by scanning the files it has access to, starting from the directory where
you launch it. **Be deliberate about which directory you run it in** — launch it from a
project directory that contains only the files the tool needs, never from a directory that
also holds restricted or licensed data. See
[Configuration Matters](/_policies/security/#configuration-matters){target="_blank"} for
guidance on isolating these tools.

## Codex

[Codex CLI](https://developers.openai.com/codex/cli/){target="_blank"} is OpenAI's agentic
coding tool. With the module loaded, launch it:

```title="Terminal Input"
codex
```

### Authenticating

Codex is available to Stanford users through Stanford's
[**ChatGPT Edu**](https://uit.stanford.edu/service/openai-chatgpt-edu){target="_blank"}
service, which covers use of the CLI. When you first run `codex`, sign in with your **Stanford account**.

This is the recommended route — your usage falls under Stanford's agreement with OpenAI. To
use Stanford's AI API Gateway instead, see
[Using the AI API Gateway](#using-the-ai-api-gateway) below.

As with the other agents, run Codex from a directory scoped to only the files the tool needs.

## Gemini

[Gemini CLI](https://google-gemini.github.io/gemini-cli/){target="_blank"} is Google's
agentic coding tool. With the module loaded, launch it:

```title="Terminal Input"
gemini
```

### Authenticating

!!! warning "Gemini CLI Is Not Covered by Stanford's Enterprise Agreement"
    Unlike Claude Code and Codex, the Gemini CLI falls **outside** Stanford's
    [Gemini Enterprise AI](https://uit.stanford.edu/service/gemini-enterprise-ai){target="_blank"}
    service. Stanford's agreements with Anthropic and OpenAI govern how your data is used,
    retained, and whether it trains the vendors' models — **none of that applies here**.
    Anything you send through the Gemini CLI goes to Google outside those protections, so
    treat it as an unapproved external service and keep non-public research data out of it.

The first time you run `gemini`, it asks how you want to authenticate — **Sign in with
Google**, **Use Gemini API Key**, or **Vertex AI**. None of these route through a Stanford
agreement.

The simplest option is a [Gemini API key](https://aistudio.google.com/apikey){target="_blank"}
from Google AI Studio, which has a free tier. Set it before launching and the CLI will detect
it automatically:

```title="Terminal Input"
export GEMINI_API_KEY=<your-api-key>
```

This is a **personal** key, and on Google's
[free tier](https://ai.google.dev/gemini-api/terms){target="_blank"} your prompts and
responses may be read by human reviewers and used to improve Google's models.

If you prefer a browser-based experience with your **Stanford Google account (SUNet ID)**,
you can use
[Gemini Enterprise AI](https://uit.stanford.edu/service/gemini-enterprise-ai){target="_blank"}
or the [Stanford AI Playground](https://uit.stanford.edu/aiplayground){target="_blank"}
directly. See [University IT AI](https://uit.stanford.edu/ai){target="_blank"} for the full
list of Stanford's AI services.

## Using the AI API Gateway

Stanford's [AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){target="_blank"}
is a different way to reach these models: an **OpenAI-compatible API** you call from your own
code, rather than a way to sign in to an agent. See
[Stanford's LLM API Tools](/blog/2026/03/06/stanfords-llm-api-tools/){target="_blank"} for how
to request a key and start making calls.

For the agents on this page, signing in with your Stanford account is simpler and is already
covered by Stanford's agreements. If you do want to route an agent through the Gateway, each
one needs its own configuration — follow Stanford's setup guides for
[Claude Code](https://uit.stanford.edu/service/ai-api-gateway/userguide/claude-cli-setup){target="_blank"}
and
[Codex CLI](https://uit.stanford.edu/service/ai-api-gateway/userguide/openai-codex-cli-setup){target="_blank"}.

## Your Responsibilities

When you use an AI agent, keep the following in mind:

- **Licensed data and DUAs.** Data licenses and Data Use Agreements can have specific clauses
  about where data may be stored and whether AI tools can be used on it. It is **your**
  responsibility to understand the limits of your data before pointing an AI agent at it. If
  you have any questions, contact the
  [GSB Data Acquisition and Governance team](https://gsbresearchhub.stanford.edu/support-units/data-acquisition-and-governance){target="_blank"}
  at [gsb-library_research-data-coordination@stanford.edu](mailto:gsb-library_research-data-coordination@stanford.edu){target="_blank"}.
- **Check what is approved.** Stanford's Information Security Office maintains the
  [GenAI Tool Evaluation Matrix](https://uit.stanford.edu/ai/genai-tool-matrix){target="_blank"}
  of reviewed and approved services.
- **Authenticate with your Stanford account.** Stanford has
  [enterprise agreements](https://uit.stanford.edu/news/new-ai-tools-stanford-arrive-june-30){target="_blank"}
  with vendors — including Anthropic's
  [Claude for Education](https://uit.stanford.edu/service/claude){target="_blank"} and OpenAI's
  [ChatGPT Edu](https://uit.stanford.edu/service/openai-chatgpt-edu){target="_blank"} — that
  cover use of these agents under terms governing data use, retention, and model training (your
  conversations are not used to train the vendors' models). Sign in with your Stanford account
  so your usage falls under these agreements, rather than a personal account.

## See Also

- [Security](/_policies/security/){target="_blank"} — data classification and AI tooling policy.
- [Modules](/_getting_started/modules/){target="_blank"} — how software modules work on the Yens.

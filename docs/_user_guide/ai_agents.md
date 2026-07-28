# AI Coding Agents on the Yens

Several AI coding agents are available on the Yens as modules, including
[Claude Code](https://docs.claude.com/en/docs/claude-code/overview){target="_blank"},
[Gemini CLI](https://google-gemini.github.io/gemini-cli/){target="_blank"}, and
[Codex CLI](https://developers.openai.com/codex/cli/){target="_blank"}. These are agentic
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
      (DUA)** or **NDA**, or with licensed data whose terms restrict AI use. Check Stanford's
      [guidance on which AI services are approved for which data](https://uit.stanford.edu/ai/services/explore){target="_blank"}
      before you begin.
    - Even if you are not using restricted data with an agent, storing restricted data on the
      same system means a misconfiguration or accident could expose it.
    - **Usage of these tools is audited.**
    - If you are unsure whether your data can be used with AI tools, **contact the GSB Library
      and data governance team at
      [gsb-library_research-data-coordination@stanford.edu](mailto:gsb-library_research-data-coordination@stanford.edu){target="_blank"}
      before you use them.**

## Loading the Modules

The AI agents are available via the `module` command like any other software on the Yens.
See the available tools with:

```title="Terminal Input"
module avail claude-code
```

Load an agent with the `module load` command (or the `ml` shorthand):

```title="Terminal Input"
ml claude-code
```

```title="Terminal Input"
ml gemini
```

```title="Terminal Input"
ml codex
```

!!! note "You Will See a Data Responsibility Reminder"
    When you load one of these modules — and when you launch the agent — a reminder about
    your data-governance responsibilities is displayed. This reminder does not replace your
    responsibility to know what data may be shared with AI tools.

For a refresher on how modules work, see [Modules](/_getting_started/modules/){target="_blank"}.

## Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code/overview){target="_blank"} is
Anthropic's agentic coding tool. Load the module and launch it from your project directory:

```title="Terminal Input"
ml claude-code
claude
```

### Authenticating

Claude Code is available to Stanford users through Stanford's
[**Claude for Education**](https://uit.stanford.edu/service/claude){target="_blank"} service,
which covers use of the CLI. When you first run `claude`, follow the prompts to sign
in with your **Stanford account**. Alternatively, you can use an Anthropic API key from
Stanford's [AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){target="_blank"}
by setting an environment variable before launching:

```title="Terminal Input"
export ANTHROPIC_API_KEY=<your-api-key>
```

Claude Code works by scanning the files it has access to, starting from the directory where
you launch it. **Be deliberate about which directory you run it in** — launch it from a
project directory that contains only the files the tool needs, never from a directory that
also holds restricted or licensed data. See
[Configuration Matters](/_policies/security/#configuration-matters){target="_blank"} for
guidance on isolating these tools.

## Gemini

[Gemini CLI](https://google-gemini.github.io/gemini-cli/){target="_blank"} is Google's
agentic coding tool. Load the module and launch it:

```title="Terminal Input"
ml gemini
gemini
```

### Authenticating

Unlike Claude Code and Codex, the Gemini CLI is **not** covered by Stanford's
[Gemini Enterprise AI](https://uit.stanford.edu/service/gemini-enterprise-ai){target="_blank"}
service. To use it on the Yens, you need an API key from Stanford's
[AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){target="_blank"} —
[request a key](https://stanford.service-now.com/it_services?id=sc_cat_item&sys_id=fd75ec563b90265079a53434c3e45a65){target="_blank"}
tied to your Stanford account, and set it before launching:

```title="Terminal Input"
export GEMINI_API_KEY=<your-api-key>
```

If you prefer a browser-based experience with your **Stanford Google account (SUNet ID)**,
you can use
[Gemini Enterprise AI](https://uit.stanford.edu/service/gemini-enterprise-ai){target="_blank"}
or the [Stanford AI Playground](https://uit.stanford.edu/aiplayground){target="_blank"}
directly. See [University IT AI](https://uit.stanford.edu/ai){target="_blank"} for the full
list of Stanford's AI services.

## Codex

[Codex CLI](https://developers.openai.com/codex/cli/){target="_blank"} is OpenAI's agentic
coding tool. Load the module and launch it:

```title="Terminal Input"
ml codex
codex
```

### Authenticating

Codex is available to Stanford users through Stanford's
[**ChatGPT Edu**](https://uit.stanford.edu/service/openai-chatgpt-edu){target="_blank"}
service, which covers use of the CLI. When you first run `codex`, sign in with your **Stanford account**.
Alternatively, you can use an OpenAI API key from Stanford's
[AI API Gateway](https://uit.stanford.edu/service/ai-api-gateway){target="_blank"} by setting
an environment variable before launching:

```title="Terminal Input"
export OPENAI_API_KEY=<your-api-key>
```

As with the other agents, run Codex from a directory scoped to only the files the tool needs.

## Your Responsibilities

When you use an AI agent, keep the following in mind:

- **Licensed data and DUAs.** Data licenses and Data Use Agreements can have specific clauses
  about where data may be stored and whether AI tools can be used on it. It is **your**
  responsibility to understand the limits of your data before pointing an AI agent at it. If
  you have any questions, contact the GSB Library and data governance team at
  [gsb-library_research-data-coordination@stanford.edu](mailto:gsb-library_research-data-coordination@stanford.edu){target="_blank"}.
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

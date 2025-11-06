---
date:
  created: 2025-11-05
categories:
    - LLM
authors:
    - nrapstin
    - astorer
---

# Fine-Tuning Open Source Models 
When large language models (LLMs) first appeared, they felt almost magical — you could ask them anything and they’d reply with surprisingly fluent text. But once you start applying them in research or production, the limitations show up quickly. The base model can sort of do your task, but not reliably enough. That’s where fine-tuning comes in.


<!-- more -->

## Why Fine-Tune?
Large language models are trained as generalists. They’ve seen a massive variety of internet text, which gives them broad coverage. But when you need them to perform well on a specific research task, the base model often isn’t accurate enough. For example, you might want to:

- Classify social media posts 

- Analyze sentiment in financial reports

- Grade free-text survey responses

In these cases, a fine-tuned model will be much more accurate.

Fine-tuning is the process of specializing a model. Instead of retraining billions of parameters from scratch (which would be extremely expensive), we use LoRA adapters — small, efficient side modules that learn the patterns specific to your task.

This makes fine-tuning practical even on research budgets while often yielding big jumps in accuracy. It’s also ideal for research computing environments:

- **Runs on small clusters**: LoRA fine-tuning can be done on a single GPU or modest HPC setup. You don’t need a commercial-scale GPU farm to train a high-performing specialist model.

- **Reproducible and shareable**:  Fine-tuning open-source models produces small adapter files that can be versioned, archived, and shared. Anyone can load the same base model and adapter to reproduce your exact results.

- **Keeps data local** — When working with restricted or sensitive datasets, fine-tuning locally ensures data never leaves your secure environment — essential for many academic and IRB-approved projects.

Fine-tuning bridges the gap between large-scale, general-purpose models and the highly specific, data-sensitive tasks common in research — giving you control, reproducibility, and performance without requiring industrial-scale infrastructure.

![Generalist vs Specialist LLM Diagram](/assets/images/fine-tune-lora.png)
*Figure: Fine-tuning adapts a generalist LLM into a task-specific specialist by adding a lightweight LoRA adapter.*

## How Fine-Tuning Works

Fine-tuning works because you show the model many examples of the task you want it to learn.
In each example, you pair a prompt (the input or instruction) with a completion (the desired output).
Over thousands of examples, the model gradually learns the mapping from one to the other.

Common fine-tuning task types include:

- **Classification** — map a prompt to a class label

- **Instruction following** — map a prompt to a short completion

- **Conversation** — multi-turn dialogue with user and assistant roles

- **Preference tuning** — teach the model which of two responses is better

The key principle: your data must clearly connect *inputs* to *outputs*.

## Where to Fine-Tune: Cloud vs. Local

There are two main ways to fine-tune:

- **On your own cluster** (e.g. Yens, Sherlock, Marlowe):

    - **Pros**: full control of data and environment, required for sensitive datasets.
    - **Cons**: more setup (Slurm jobs, GPU scheduling, environment management).

- On managed **cloud platform** (e.g. [Together AI](https://www.together.ai){target="_blank"}, [Tinker](https://thinkingmachines.ai/tinker){target="_blank"}):

    - **Pros**: minimal setup, pay-as-you-go pricing, fast turnaround.
    - **Cons**: requires sending data to the cloud (not suitable for restricted or sensitive data). 

!!! warning
    There is currently no institutional agreement in place with Together AI or Tinker so they are not approved for Stanford data. Please refer to [GenAI Tool Evaluation Matrix](https://uit.stanford.edu/ai/genai-tool-matrix) to see what AI tools are approved to use with Stanford data.   

Cloud platforms make experimentation quick and affordable, while local fine-tuning ensures data privacy, compliance, and full reproducibility. 

## What is LoRA?

Fine-tuning a large model from scratch would mean adjusting billions of parameters, which is almost always impractical outside of Big Tech. LoRA (Low-Rank Adaptation) solves this problem by adding a small set of trainable weights on top of the frozen base model.

Think of the base model as a huge library of knowledge. LoRA doesn’t rewrite the entire library — it just slips in a few new index cards that redirect the model’s attention toward your specific task.

Concretely:

- The original model weights stay frozen.

- LoRA adds lightweight “adapter” layers inside certain parts of the model (usually the attention layers).

- During fine-tuning, only these adapter weights are trained, while the rest of the model stays fixed.

This approach is far more efficient: instead of needing hundreds of gigabytes of GPU memory, you only need a fraction of that. The adapter weights themselves are small — often just a few hundred megabytes — and can be swapped in and out depending on which task you want the model to specialize on.


## What is Together AI?

[Together AI](https://www.together.ai/){target="_blank"} is a managed cloud service for fine-tuning and serving fine-tuned open-source models like Qwen, Mistral, and Llama. You upload your dataset and launch a fine-tuning job through their web interface or CLI.

When training finishes, Together AI provides a LoRA adapter file (and/or a merged model). 

That adapter is portable: copy it to your cluster and load it into vLLM (a high-performance model serving engine) or Ollama for inference.

This gives you the best of both worlds:

- 🚀 Cloud for fast, cheap training

- 🔒 Local clusters for large-scale, private inference

Together AI also lets you easily (one button click) deploy the fine-tuned model on their infrastructure but it will charge per minute and cost varies depending on GPUs necessary to run the model.

## Fine-Tuning vs. Alternatives
- Fine-tuning vs. Prompting

    Few-shot prompting can work, but on specialized tasks, a fine-tuned adapter usually wins in both accuracy and consistency.

- Together AI vs. OpenAI Fine-tuning

    - OpenAI fine-tunes proprietary models (like GPT-4.1 mini). You can only use them via API.

    - Together AI fine-tunes open-source models (like Qwen-8B). You can download the adapter and run it anywhere.

The important difference is reproducibility and sharing. Together AI fine-tunes open-source base models (e.g., Qwen, Mistral, Llama) and produces an open-source adapter file. That means you can freely share the model and others can reproduce your results. In contrast, OpenAI fine-tuned models are proprietary — you can only access them through their API, and you can’t download or distribute the adapted weights.


Here’s the fine-tuning workflow at a glance: start with a labeled dataset, fine-tune in the cloud with Together AI, download the LoRA adapter, and run inference locally with vLLM to evaluate results.

![Fine-tuning Workflow Diagram](/assets/images/fine-tune-flowchart.png)
*Figure: End-to-end fine-tuning workflow combining cloud training with local inference.*

## Try It Yourself

If you’d like to reproduce this workflow — from preparing training data to running the base and fine-tuned models with vLLM on Stanford's Yens or Sherlock — we’ve published a hands-on guide in our repository: [gsbdarc/vllm_helper](https://github.com/gsbdarc/vllm_helper){target="_blank"}. The repo includes example inference scripts, instructions for launching vLLM on a GPU node, and details on the expected `test.jsonl` format.


### 1. Preparing the Data

Our example task was a Reddit post classification problem designed to test how fine-tuned and base models perform on a clear, structured benchmark.
Each training example asked the model to predict which of ten subreddits a post belongs to, given its title and (optionally) body text.

The dataset has:

- Ten classes (the subreddits)

- 98,000 labeled examples for training and 5,000 held-out examples for testing

#### The Task
Given:

- **Input**: the title and body of a Reddit post

- **Output**: one of ten subreddit labels

We framed this as an instruction-following problem:

```text title="LLM Prompt"
Classify the subreddit for this Reddit post.
Return just the subreddit name from this list:
AskReddit, worldnews, explainlikeimfive, funny, todayilearned,
science, sports, LifeProTips, technology, books.

Title: "<post title>"
Body: "<post body>"
Answer:
```

Each record in the training file has:

- a **"prompt"** field (the instruction and post text), and

- **a "completion"** field (the correct subreddit name). 

By repeating this structure thousands of times across different categories, we teach the model to output the right subreddit name.
Together AI expects data in this instruction-style JSONL format (one example per line):

```{.yaml .no-copy title="Expected JSONL format"}
{"prompt": "Classify the subreddit for this Reddit post.\nReturn just the subreddit name from this list: AskReddit, worldnews, explainlikeimfive, funny, todayilearned, science, sports, LifeProTips, technology, books.\n\nTitle: \"Why men are happier than women\"\nBody: \"\"\nAnswer:", "completion": "todayilearned"}
```
This format makes it easy to fine-tune any model on a simple input → output mapping task.
You can read more about Together AI’s supported data formats in their [documentation](https://docs.together.ai/docs/fine-tuning-data-preparation){target="_blank"}.


### 2. Upload Training Files to Together AI
Once the dataset is prepared, the next step is to make it available to Together AI for fine-tuning. You’ll typically create three files:

- `train.jsonl` — examples the model learns from

- `val.jsonl` — optional validation set to monitor training progress

- `test.jsonl` — held-out examples for final evaluation (not uploaded)

Together AI supports two ways to upload training data:

- [Web interface](https://api.together.xyz/fine-tuning){target="_blank"} — drag and drop your JSONL files directly in the fine-tuning dashboard. This is the fastest way to get started.

- Command-line interface (CLI) — upload files from the terminal, which is convenient for automation or when working on a cluster.

After uploading, Together AI will check your file format (prompt/completion pairs, conversational data, etc.) and confirm it’s valid for training. Once validated, the files are ready to be used in a fine-tuning job.

### 3. Configure and Run a Fine-Tuning Job 
With your dataset uploaded, the next step is to start a fine-tuning job. Together AI lets you do this either from the CLI or through their web interface. The web interface is especially handy because you can pick the base model, adjust parameters, and watch progress in real time.

#### Rank, Costs, and Tradeoffs

Once you pick the base model, you’ll be prompted to configure training parameters. Here’s what they mean in practice.

The main design choice in LoRA is **rank**. Rank determines the size of the adapter matrices that the model actually learns during training. 

- Low rank (e.g. 8, 16): 

    - Fewer parameters to train 
    - Faster training, lower GPU memory use 
    - Risk of underfitting if the task is complex 

- High rank (e.g. 32, 64): 
    - More parameters to train 
    - Higher training cost, more GPU hours 
    - Better ability to capture complex patterns, often higher accuracy 

In practice, you can think of LoRA rank as the capacity knob: turning it up allows the adapter to learn more, but you’ll pay more in compute.

Other factors that affect training cost include:

- **Model size**: training a smaller model like Qwen-8B (≈8 billion parameters) is much cheaper than a larger one like Qwen-32B (≈32 billion parameters). Larger parameter counts generally improve reasoning and accuracy, but they also increase training time, GPU memory needs, and costs.

- **Dataset size**: the more examples you train on, the longer each epoch takes and the more GPU hours are required. Doubling your dataset size roughly doubles the cost, though it can also improve model generalization.

- **Epochs**: each full pass over your dataset adds cost. One epoch means the model sees every example once. Multiple epochs let the model learn more, but too many can cause overfitting and drive up the cost.

- **Batch size**: larger batches allow GPUs to process more examples in parallel, speeding up training. However, they require more memory, so you may need larger or more expensive GPUs. Small batch sizes are cheaper on memory but train more slowly.

Other parameters that affect learning:

- **Learning rate & scheduler** – control how quickly the model adjusts its weights. A schedule like cosine decay starts aggressively and then tapers off, helping the model settle into a good solution.

- **Dropout & weight decay** – techniques to prevent overfitting by making the model less likely to “memorize” the training set.

- **Trainable modules** – which parts of the model the LoRA adapters are inserted into (for example, attention projections or feed-forward layers). Choosing more modules gives the model more flexibility to adapt, at the cost of extra compute.

### 4. Run Inference
Once training is finished, it’s time to put your fine-tuned model to the test. This step is called *inference* — running the fine-tuned model on new inputs and checking its predictions.

You have two main options:

- Run inference on Together AI

    - Easiest option: no setup, just call the API.

    - Downside: deployment costs money, so large-scale evaluation can add up.

- Run inference locally

    - You download the LoRA adapter and load it into an inference engine such as [vLLM](https://docs.vllm.ai/en/latest){target="_blank"} (optimized for serving at scale) or [Ollama](/blog/2025/05/12/running-ollama-on-stanford-computing-clusters){target="_blank"} (lightweight and simple).

    - This takes more setup (GPU access, environment, and a server process), but once it’s running, you can run inference at scale without extra cost.

!!! important "🔒 Security & Data Licenses"
    Always confirm that the dataset and outputs you’re working with are approved for the environment you’re using.

If you have data licensing questions, please contact [DAG Team at the Research Hub](https://gsbresearchhub.stanford.edu/support-units/data-acquisition-and-governance){target="_blank"}.

!!! danger "⚠️  Do Not Upload Sensitive Data"
    Do not run inference in the cloud or upload data that can’t leave Stanford infrastructure or that falls under restricted data-use agreements.

Local inference is the right path for sensitive or licensed datasets.
 
#### Evaluation

A key part of inference is evaluation — measuring how the fine-tuned model stacks up against the base model on the same held-out test set. This gives you a clear before-and-after picture.

- The base model shows what the pretrained LLM can do out of the box.

- The fine-tuned model shows how much improvement your LoRA adapter provides.

#### Open-Source vs. GPT Fine-Tuning 
In our Reddit classification experiment, the goal was to predict which of ten subreddits a post belonged to based on its title and body text.  
We tested both open-source and closed-source fine-tuning approaches using the same training set of 98,000 examples and the same labeled dataset of 5,000 evaluation examples.


**Open-source setup (Together AI + vLLM):**  
We fine-tuned Qwen3-8B-Base with LoRA adapter (rank = 32) using Together’s managed training service and then ran inference locally with vLLM.  

  - **Base Qwen3-8B:** 0.39 accuracy  

  - **Fine-tuned Qwen3-8B (LoRA):** 0.74 accuracy  

  - **Training cost:** under $5  

The fine-tuned LoRA adapter nearly doubled accuracy over the base model, demonstrating how small, task-specific updates can yield large performance gains while remaining fully reproducible and deployable on local clusters.

**Closed-source setup (GPT-4.1 mini):**  
To benchmark a smaller proprietary model, we repeated the experiment with GPT-4.1 mini using OpenAI’s Batches API and structured outputs to enforce consistent label formatting.  

  - **Base GPT-4.1 mini:** 0.76 accuracy

  - **Fine-tuned GPT-4.1 mini:** 0.89 accuracy
 
  - **Training + inference cost:** $85

Even with a single-epoch fine-tune on the same dataset, GPT-4.1 mini surpassed both the base and LoRA-tuned open-source models.  

Together, these results illustrate how both open-source LoRA fine-tuning and closed-source API fine-tuning can substantially enhance task performance at different cost and transparency trade-offs. 

#### Random Forest Benchmark
To ground the fine-tuning results, we also trained a Random Forest model on the same 98,000 training examples and evaluated it on the same 5,000-example test set.

Each Reddit post’s title and body were converted into TF-IDF features (1–2-gram range), and a 400-tree Random Forest was trained using scikit-learn on CPU.

- **Train time**: ~3 minutes

- **Evaluation time**: ~1 second for 5,000 examples

- **Test accuracy**: 0.99

!!! note "Why Random Forest performs so well"
    For this task, a Random Forest is almost ideal: there are only ten target classes, and we provided nearly one hundred thousand labeled examples.
    The classes are lexically separable — each subreddit has distinctive vocabulary (“goal,” “NASA,” “book,” “ELI5”), and TF-IDF directly captures those cues.
    In contrast, LLMs need far more data to reach similar accuracy because they learn at the token-sequence level and must also interpret the natural-language instruction (“Classify the subreddit…”).

The LLM fine-tunes are still valuable, but their strength shows up on harder, semantically driven tasks where the boundaries between classes aren’t as obvious.

!!! tip "Key takeaway"
    For $0 in compute cost, you can build a near-perfect model for a simple, well-structured task using time-tested techniques like Random Forests.
    Fine-tuning large language models still matters — but mostly when the decision boundary is semantic, contextual, or ambiguous in ways that simple models can’t capture.

This comparison reminds us that model choice should match task complexity — the simplest model that works well is often the best starting point.

![Evaluation Results Bar Chart](/assets/images/fine-tune-bar-chart-accuracy.png)

*Figure: Comparison of model accuracies across five setups. The base Qwen3-8B achieved 39% accuracy, while a fine-tuned LoRA adapter nearly doubled performance to 74%. GPT-4.1 mini (base) reached 76% using structured outputs, and fine-tuning GPT-4.1 mini pushed accuracy to 89%. A classical Random Forest model trained on the same dataset achieved 99% accuracy, highlighting how well classic machine learning classification methods can perform when classes are highly separable.*


## Conclusion

Fine-tuning turns a general-purpose language model into a specialist. By preparing a labeled dataset, uploading it to Together AI for training, and then running inference with vLLM locally, you can create models that perform dramatically better on your specific task.

In our example, a simple LoRA fine-tune nearly doubled accuracy on a classification benchmark — from 39% with the base model to 74% with the fine-tuned adapter. The process was fast, affordable, and flexible: cloud training for convenience, local inference for scale.

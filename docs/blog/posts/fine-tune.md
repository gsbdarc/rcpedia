---
date:
  created: 2025-09-03
categories:
    - LLM
authors:
    - nrapstin
---

# Fine-Tuning Open Source Models with Together + vLLM
When large language models (LLMs) first appeared, they felt almost magical — you could ask them anything and they’d reply with surprisingly fluent text. But once you start applying them in research or production, the limitations show up quickly. The base model can sort of do your task, but not reliably enough. That’s where fine-tuning comes in.


<!-- more -->

## Why Fine-Tune?
Large models are trained as generalists. They’ve seen a massive variety of internet text, which gives them broad coverage. But when you need them to perform well on a specific research task, the base model usually isn’t accurate enough. For example, you might want to:

- Classify social media posts 

- Analyze sentiment in financial reports

- Grade free-text survey responses

In these cases, a fine-tuned model will be much more accurate.

Fine-tuning is the process of specializing a model. Instead of retraining billions of parameters from scratch (which would be extremely expensive), we use LoRA adapters — small, efficient side modules that learn the patterns specific to your task.

This makes fine-tuning practical even on research budgets while often yielding big jumps in accuracy.

![Generalist vs Specialist LLM Diagram](/assets/images/fine-tune-lora.png)
*Figure: Fine-tuning adapts a generalist LLM into a task-specific specialist by adding a lightweight LoRA adapter.*

## Where to Fine-Tune: Cloud vs. Local

There are two main ways to fine-tune:

- On your own clusters (e.g. Yens, Sherlock, Marlowe):

    - Pros: full control of data and environment, required for sensitive datasets.

    - Cons: more setup (Slurm jobs, GPU scheduling, environment management).

- On managed cloud platforms (e.g. Together):

    - Pros: minimal setup, pay-as-you-go pricing, fast turnaround.

    - Cons: requires sending data to the cloud (not suitable for restricted or sensitive data).

## What is LoRA?

Fine-tuning a large model from scratch would mean adjusting billions of parameters, which is almost always impractical outside of Big Tech. LoRA (Low-Rank Adaptation) solves this problem by adding a small set of trainable weights on top of the frozen base model.

Think of the base model as a huge library of knowledge. LoRA doesn’t rewrite the entire library — it just slips in a few new index cards that redirect the model’s attention toward your specific task.

Concretely:

- The original model weights stay frozen.

- LoRA adds lightweight “adapter” layers inside certain parts of the model (usually the attention layers).

- During fine-tuning, only these adapter weights are trained, while the rest of the model stays fixed.

This approach is far more efficient: instead of needing hundreds of gigabytes of GPU memory, you only need a fraction of that. The adapter weights themselves are small — often just a few hundred megabytes — and can be swapped in and out depending on which task you want the model to specialize on.


## What is Together?

[Together](https://www.together.ai/){target="_blank"} is a managed cloud service for training and serving open-source models like Qwen, Mistral, and Llama. You upload your dataset and launch a fine-tuning job through their web interface or CLI.

When training finishes, Together provides a LoRA adapter file (and/or a merged model). 

That adapter is portable: copy it to your cluster and load it into vLLM (a high-performance serving engine) or Ollama.

This gives you the best of both worlds:

- 🚀 Cloud for fast, cheap training

- 🔒 Local clusters for large-scale, private inference

Together also lets you easily (one button click) deploy the fine-tuned model on their infrastructure but it will charge per minute and cost varies depending on GPUs necessary to run the model.


## LoRA Rank, Costs, and Tradeoffs 
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


## Fine-Tuning vs. Alternatives
- Fine-tuning vs. Prompting

    Few-shot prompting can work, but on specialized tasks, a fine-tuned adapter usually wins in both accuracy and consistency.

- Together vs. OpenAI Fine-tuning

    - OpenAI fine-tunes proprietary models (like GPT-4o-mini). You can only use them via API.

    - Together fine-tunes open-source models (like Qwen-8B). You can download the adapter and run it anywhere.

The important difference is reproducibility and sharing. Together fine-tunes open-source base models (e.g., Qwen, Mistral, Llama) and produces an open-source adapter file. That means you can freely share the model and others can reproduce your results. In contrast, OpenAI fine-tuned models are proprietary — you can only access them through their API, and you can’t download or distribute the adapted weights.


Here’s the fine-tuning workflow at a glance: start with a labeled dataset, fine-tune in the cloud with Together, download the LoRA adapter, and run inference locally with vLLM to evaluate results.

![Fine-tuning Workflow Diagram](/assets/images/fine-tune-flowchart.png)
*Figure: End-to-end fine-tuning workflow combining cloud training with local inference.*

## Try It Yourself

If you’d like to reproduce this workflow — from preparing training data to running the base and fine-tuned models with vLLM on Sherlock — we’ve published a hands-on guide in our repository: [gsbdarc/vllm_helper](https://github.com/gsbdarc/vllm_helper){target="_blank"}. The repo includes example inference scripts, instructions for launching vLLM on a GPU node, and details on the expected `test.jsonl` format.


### 1. Preparing the Data

Fine-tuning works because you show the model examples of the task you want it to learn. The task might be:

- Classification (map a prompt to a class label)

- Instruction following (map a prompt to a completion)

- Conversation (multi-turn dialogue with user and assistant roles)

- Or even preference tuning (teach the model which of two responses is better)

The important thing is that your data clearly connects inputs to outputs.

Together supports several [formats](https://docs.together.ai/docs/fine-tuning-data-preparation){target="_blank"} for this:

- Instruction-style: prompt + completion pairs (great for classification or short-form tasks).

- Conversational: dialogue history with user and assistant turns.

- Generic text: raw passages, useful for continuing pretraining.

- Preference data: examples where one output is preferred over another.

Under the hood, these are usually stored as JSONL (JSON Lines) files, one example per line.

#### Example
For our experiment, the task was: given the title (and sometimes body) of a Reddit post, predict which of the ten subreddits it belongs to.

That meant writing prompts that instructed the model to classify the post, and then pairing each with the correct subreddit as the completion. Here are a few examples from our dataset:

```{.yaml .no-copy title="Expected JSONL format"}
{"prompt": "Classify the subreddit for this Reddit post.\nReturn just the subreddit name from this list: AskReddit, worldnews, explainlikeimfive, funny, todayilearned, science, sports, LifeProTips, technology, books.\n\nTitle: \"20 Amazing and Essential Non-fiction Books to Enrich Your Library (by Zen Habits)\"\nBody: \"\"\nAnswer:", "completion": "books"}
{"prompt": "Classify the subreddit for this Reddit post.\nReturn just the subreddit name from this list: AskReddit, worldnews, explainlikeimfive, funny, todayilearned, science, sports, LifeProTips, technology, books.\n\nTitle: \"Psychologists Find: In Election Polls, Response Time Speaks Louder Than Voters' Words\"\nBody: \"\"\nAnswer:", "completion": "science"}
{"prompt": "Classify the subreddit for this Reddit post.\nReturn just the subreddit name from this list: AskReddit, worldnews, explainlikeimfive, funny, todayilearned, science, sports, LifeProTips, technology, books.\n\nTitle: \"What will life be like, in 2050?\"\nBody: \"\"\nAnswer:", "completion": "AskReddit"}
```

Each example follows the same pattern:

- The prompt gives the task instructions and the input text (title + body).

- The completion provides the correct label (the subreddit).

By repeating this structure thousands of times across different categories, we teach the model to output the right subreddit name.


### 2. Upload Training Files to Together
Once the dataset is prepared, the next step is to make it available to Together for fine-tuning. You’ll typically create three files:

- train.jsonl — examples the model learns from

- val.jsonl — optional validation set to monitor training progress

- test.jsonl — held-out examples for final evaluation (not uploaded)

Together supports two ways to upload training data:

- [Web interface](https://api.together.xyz/fine-tuning){target="_blank"} — drag and drop your JSONL files directly in the fine-tuning dashboard. This is the fastest way to get started.

- Command-line interface (CLI) — upload files from the terminal, which is convenient for automation or when working on a cluster.

After uploading, Together will check your file format (prompt/completion pairs, conversational data, etc.) and confirm it’s valid for training. Once validated, the files are ready to be used in a fine-tuning job.

### 3. Configure and Run a Fine-Tuning Job 
With your dataset uploaded, the next step is to start a fine-tuning job. Together lets you do this either from the CLI or through their web interface. The web interface is especially handy because you can pick the base model, adjust parameters, and watch progress in real time.

Once you pick the base model, you’ll be prompted to configure training parameters. Here’s what they mean in practice:

- Epochs – how many times the model sees your dataset. More epochs mean more training, but also higher cost and risk of overfitting.

- Batch size – how many examples are processed at once. Larger batches train faster but require more GPU memory.

- LoRA rank – controls the size of the adapter. Higher rank can capture more complex patterns, but increases cost.

- Learning rate & scheduler – control how quickly the model adjusts its weights. A schedule like cosine decay starts aggressively and then tapers off, helping the model settle into a good solution.

- Dropout & weight decay – techniques to prevent overfitting by making the model less likely to “memorize” the training set.

- Trainable modules – which parts of the model the LoRA adapters are inserted into (for example, attention projections or feed-forward layers). Choosing more modules gives the model more flexibility to adapt, at the cost of extra compute.

### 4. Run Inference
Once training is finished, it’s time to put your fine-tuned model to the test. This step is called inference — running the fine-tuned model on new inputs and checking its predictions.

You have two main options:

- Run inference on Together

    - Easiest option: no setup, just call the API.

    - Downside: deployment costs money, so large-scale evaluation can add up.

- Run inference locally

    - You download the LoRA adapter and load it into an inference engine such as vLLM (optimized for serving at scale) or Ollama (lightweight and simple).

    - This takes more setup (GPU access, environment, server process), but once it’s running, you can run inference at scale without extra cost.

#### Evaluation

A key part of inference is evaluation — measuring how the fine-tuned model stacks up against the base model on the same held-out test set. This gives you a clear before-and-after picture.

- The base model shows what the pretrained LLM can do out of the box.

- The fine-tuned model shows how much improvement your LoRA adapter provides.

#### Example
In our Reddit classification experiment, the difference was dramatic:

- Test set accuracy (base): 0.39 over 5,000 labeled examples using Qwen3-8B-Base

- Test set accuracy (adapter): 0.74 over 5,000 labeled examples with a fine-tuned LoRA (rank 32). The training cost was under $5.

- Test set accuracy (GPT-4o): 0.77 using OpenAI’s Batches API with structured outputs. The run cost was just over $1.

![Evaluation Results Bar Chart](/assets/images/fine-tune-bar-chart-accuracy.png)

*Figure: Accuracy comparison between the base model, fine-tuned LoRA, and GPT-4o. The LoRA adapter nearly doubled performance over the base, while GPT-4o performed slightly better at very low cost — but remains closed-source and API-restricted.*

## Conclusion

Fine-tuning turns a general-purpose language model into a specialist. By preparing a labeled dataset, uploading it to Together for training, and then running inference with vLLM locally, you can create models that perform dramatically better on your specific task.

In our example, a simple LoRA fine-tune nearly doubled accuracy on a classification benchmark — from 39% with the base model to 74% with the fine-tuned adapter. The process was fast, affordable, and flexible: cloud training for convenience, local inference for scale.

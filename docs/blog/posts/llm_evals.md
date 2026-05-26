---
date:
  created: 2026-05-19
categories:
    - LLM
authors:
    - ltdarc
subtitle: 
---
# Data Extraction is Time Consuming

For social science or business research, data often comes from dense tables in PDFs. Some examples might be city council meeting notes, SEC filings, or historical TV Guides — printed weekly schedules that listed every channel, time slot, and program for a given market. These documents are a rich source of media history, but the data locked inside them isn't easily searchable or analyzable without first being digitized.

![tv_guide_example](images/blog/tv_guide_example.png)

In the past these images might get outsourced to a third party or a student with instructions to go cell by cell and transcribe all of the information into a Google Sheets document. A supervisor would then review the outputs to help minimize errors. Overall this is a time-intensive and manual task.

# The Solution: Designing an LLM Evaluation Framework

Designing LLM Evaluation Frameworks may sound niche, but it's actually an essential part of any AI workflow, especially for data extraction tasks like the one described above. An LLM Evaluation Framework is a systematic way of testing how accurately different AI models can complete a specific task—in our case, extracting structured data from historical TV Guide images. 

A robust framework allows researchers to quickly benchmark how different models perform across a representative sample of their data before committing to one for production use. This article will cover the thought process behind how we designed our own LLM Evaluation Framework for a TV Guide data extraction project, the results, and learnings along the way. To recreate and customize your own framework, you can find our GitHub [here](https://github.com/gsbdarc/LLM_benchmarks).

# Exploring AI Alternatives

LLMs are powerful, cutting-edge tools with a wide array of applications. They may seem like an easier alternative to manual data extraction, but deciding whether or not to incorporate them into a workflow is a deceptively tough question.

![research_dilemma](images/blog/research_dilemma.png)

As the diagram above shows, these four factors don't exist in isolation. Budget constraints may force a tradeoff on accuracy; the nature of your data may eliminate certain models entirely; and accuracy requirements can shift as you learn more about the task. This interdependence is exactly what makes the decision hard to answer upfront, and why a systematic evaluation framework is worth building.

As a first step you might log into the [Stanford AI Playground](https://aiplayground-prod2.stanford.edu/c/new). You can upload images and add description of what you want the model to do, after a few seconds the model should give you an output.

![playground](images/blog/playground.gif)

But if the goal is to find the best model for the task we should test all multimodal LLMs (models capable of processing both images and text) available, which would be over 20 at the time of this post being published. Using just 1 image likely isn't enough and we'd typically want multiple different pieces of information from each document.

![tasks](images/blog/tasks_at_scale.png)

35 images, 6 benchmarks (unique outputs), and 18 models quickly scale to just shy of 3,800 unique combinations. This isn't feasible to feed into the Stanford AI Playground one by one, so how can we leverage LLMs at scale?

# Building Pipelines

This is where setting up an automated pipeline becomes crucial. You can find a visual representation of my project pipeline below, which processes a single task. We used the Yen servers (Stanford's high-performance computing cluster) for compute, and SLURM array jobs (a job scheduler that lets us run many tasks simultaneously) helped us process tasks in parallel.

![pipeline](images/blog/pipeline.png)

## Selecting Inputs

Benchmarks: these are what you want the model to do/what type of information the model should extract. This will include prompts and what type of output we're looking for (string, array, etc.).

```json
{
    "task_name": "newspaper_name",
    "system_prompt": "You are a metadata extraction assistant. Extract information from newspaper TV guide image. Always return valid JSON matching the exact schema provided.",
    "user_prompt": "Extract the newspaper name from this image.",
    "task_description": "Extraction: LLM should extract the name of the newspaper the TV guide is published in.",
    "schema": {
      "class_name": "NewspaperName",
      "fields": {
        "newspaper_name": {
          "type": "string"
        }}}
}
```

Images: where the LLM will extract data from. We did some preprocessing by converting color PDFs into greyscale PNGs to ensure we were able to fit within the context limits (the maximum amount of data a model can process at once) of each model.

Models: which LLMS are doing the extraction.

## Extraction

LLMs on the Stanford AI Playground can be accessed on the Yens via the [API](https://uit.stanford.edu/service/ai-api-gateway). You will need to apply and get approval for an API key.

Once inputs have been selected we can feed the prompts and images into the models we've chosen via the API.

## Evaluation

Model outputs are written directly to a MongoDB database (a flexible storage system that makes it easy to query and filter results) which acts as a central information store. In the earlier example we mentioned needing a supervisor to check the results of our human transcriber. Similarly, we also need to build an evaluation component into this pipeline because LLMs can be prone to errors and hallucinations (confidently producing incorrect outputs).

## Results

Due to the design choices that we made the pipeline is able to finish processing and evaluating all 3,780 tasks in just a few hours. 

# Benchmarks

For every TV Guide used in our pipeline we had a corresponding ground truth document, a hand transcribed reference that we treat as the correct answer. When selecting benchmarks we wanted to choose outputs that could be verified against the ground truth, meaning they had to be definitive rather than subjective. We assigned each benchmark a difficulty level based on how challenging the extraction task was expected to be (which the results later confirmed). We started with 6 benchmarks initially:

![benchmark_pic_1](images/blog/benchmark_pic_1.png)

![benchmark_pic_2](images/blog/benchmark_pic_2.png)

Easy (Grey):
- Simple metadata extraction tasks
- Same location across documents, high resolution

- Newspaper Name
- Newspaper Date

Medium (Yellow):
- TV Guide Day Of Week
    - Location can change across image
    - Closer to actual table, mixed resolutions

- TV Guide Date
    - Reasoning: LLM needs to combine Newspaper Date and TV Guide Day of Week without being explicitly told to do so

Hard (Grid):
- Data is found within the grid itself
- Smallest font, lowest resolution
- Variation in placement across images

- First Channel
- First Program

# Initial Results

## Results across Images

Looking at the average accuracy score by image for all models and benchmarks showed a pretty wide range of results.  

![image_scores](images/blog/image_scores.png)

The best image (#22) had a 40 pt. difference compared to our worst image (#23). We've included images of both below, can you guess which one is which?

![best_and_worst](images/blog/best_and_worst.png)

Answer: Image 22 is on the left and image 23 is on the right. Was that what you guessed? 

For images that seem pretty similar at first glance they had drastically different results, showing that how LLMs understand images remains a bit of a black box.

## Results by Model

![model_ranking](images/blog/model_ranking.png)

Across all images and benchmarks our best performing model was gemini-2.5-pro with 72% accuracy and a total token cost of $8.76. Our worst performing model was claude-3-haiku with 51% accuracy and a total token cost of $0.35. 

Most other models in the Playground fell somewhere between the two in both accuracy and cost. The only exception would be o1 which was the most expensive model with a total cost of $41.35. Based on these results we would recommend avoiding this model for tabular data extraction.

## Results by Benchmark

Looking at benchmark accuracy rates across all images and models, the results seemed to confirm the difficulty rating assigned to them.

![benchmark_results_1](images/blog/benchmark_results_1.png)

Newspaper name and newspaper date had the highest accuracy while first channel and first program were accurate less than one third of the time.

## Selecting LLMs based on Benchmark

One thing we wanted to caution against is assuming that one model will perform the best across all tasks. The below shows the best model for each benchmark in terms of highest accuracy and lowest price.

![best_model_task](images/blog/best_model_task.png)

As you can see the supposed worse model, claude-3-haiku, was actually the best model for two of these benchmarks. The reason for this is that most of the LLMs performed similarly for the same prompt but claude-3-haiku was more efficient in token usage which results in lower costs.

## First Program and First Channel

Given that First Program and First Channel were our two worst performing benchmarks I wanted to take a closer look at per model performance across the entire image set.

![fp_fc_1](images/blog/fp_fc_1.png)

While Llama-4 and gemini-2.5-pro were the best performing models for these benchmarks even they couldn't get above 60% accuracy. This would be an unacceptable accuracy rate for research data which leads to our next set of questions. Are the models just bad? Or is there an opportunity for us to further optimize results?

# Revisiting our benchmarks

![rd_task](images/blog/rd_task.png)

Going back to our earlier questions we can use them to help identify areas for improvement. Let's start with task. 

How well is what we're trying to do being reflected in the prompt we're giving the model?

First Program User Prompt (v1): "Return the name of the program for the first channel listed and for the earliest time slot shown."

This prompt we initially used is only one sentence. It feels pretty vague and doesn't give the model all that much guidance.

*What changed in v2: added explicit grid structure and step-by-step navigation instructions.*

First Program User Prompt (v2): "Analyze the provided image of a TV schedule grid. Channels are typically listed vertically (rows) and time slots horizontally (columns). Your task is to extract the program title for the FIRST channel listed at the EARLIEST time slot shown. Follow these steps carefully: 1. Scan the grid to identify the top-most row containing programming data (the row immediately below the time-slot or any other subsection headers). 2. Scan to the left-most time block within that specific row. 3. Identify the text inside this top-leftmost program block.  4. Transcribe the text exactly as printed. Include all numbers (e.g., episode numbers, parts, movie years), abbreviations, and characters that appear immediately with the title."

In our second iteration we looked at the instructions we'd previously given the third party transcription service and used it as a starting point. The prompt now gives the model explicit instructions to think about the image as a grid with rows and columns. It also gives clear guidance on where the key information is located within the grid.

*What changed in v3: narrowed the output to the title only, filtering out metadata like captions and codes.*

First Program User Prompt (v3): "Analyze the provided image of a TV schedule grid. Channels are typically listed vertically (rows) and time slots horizontally (columns). Your task is to extract the program title for the FIRST channel listed at the EARLIEST time slot shown. Follow these steps carefully: 1. Scan the grid to identify the top-most row containing programming data (the row immediately below the time-slot or any other subsection headers). 2. Scan to the left-most time block within that specific row. 3. Identify the text inside this top-leftmost program block.  4. Return only the title, ignore all closed captioning markers, rerun indicators, movie release years, or VCR Plus+ codes (numeric sequences) that appear immediately with the title."

In our third iteration we adjusted the last line of our prompt to focus on the name itself and ignore all other miscellaneous information. This better reflected what an actual research question might be and helped narrow the focus of the LLM.

Once we feel confident that our tasks are better explained in the prompt we can move on to the next step. But improving prompts is only one part of the picture. It's also worth stepping back and questioning whether the ground truth we're comparing against is well-defined.

# Taking another look at our data

![rd_task](images/blog/rd_data.png)

When we think about improving a score it makes sense to review our responses. But should we also review the ground truth that we're comparing our responses against?

![daytona](images/blog/daytona.png)

For the above image what do you think is the right output for first program?

A. 2015 Daytona 500 The 57th running of the event. The race consists of 200 laps and is the first race of the season. (N) (cc)

B. 2015 Daytona 500 The 57th running of the event. The race consists of 200 laps and is the first race of the season.

C. 2015 Daytona 500

Correct answer: it depends.

Hmm, let's try another one. For the below image what should the first channel output be?

![khon](images/blog/khon.png)

A. 2 3 003 2 KHON

B. 2 3 003 2

C. KHON

Correct answer: it also depends.

For a seemingly simple question there can be a lot of different "right" answers. The ground truth is dependent on the research question that's being answered. Are we looking at how many programs offered closed captions? Do we care about all the different channel numbers associated with a network?

One of the best ways to get a better grasp of your data is to actually hand transcribe 5 to 10 images. This will help you get a sense of what data you have available and how much it can vary across your dataset.

# Choosing metrics

In the first part of our project we evaluated results via exact matching. If there weren't more or less exactly what we expected the ground truth to be the LLM would score a 0. But this doesn't help us measure how close an output is to the ground truth. And should we be using the same metric even if the output types are different?

![rq_workflow](images/blog/rq_workflow.png)

When redesigning our LLM workflow our thought process was to first start with what research question we were trying to answer. In order to answer the question we would need to complete a series of tasks. Prompts helped us translate these tasks into instructions for an LLM to follow. Finally, the metric should be based on what the prompt is asking the model to do. 

In this way if (1) the task reflects the research question, (2) the prompt reflects the task, and (3) the metrics reflect the prompt then the metric becomes an important signal for the workflow.

![rq_workflow_2](images/blog/rq_workflow_2.png)

**Questions to ask when results are poor:**

1. Are my tasks reflective of my research question and the data I have to work with?

2. Does my prompt properly explain what I want the LLM to do?

3. Is my metric appropriate for the actual prompt?

By using our metrics as a signal we iterated through these questions several times to refine our outputs.

![benchmark_table](images/blog/benchmark_table.png)

First Program and First Channel were our lowest performing benchmarks so we focused on them when trying to optimize the quality of our outputs. As we refined our prompts the model output type changed as well which caused us to update our metrics as well (ex. calculating set overlap if the prompt asked the model to return an array of channels).

We also added two new benchmarks, All Times and All Channels, to test how well the models were capable of extracting larger arrays of data.

# Updated Results

## Results by Benchmark

![benchmark_results_2](images/blog/benchmark_results_2.png)

The above shows overall accuracy rates by benchmark aggregated across all images and models. First Channel and First Program used the same v1 prompts from the initial results but with updated metrics that measure similarity rather than requiring an exact match. The scores improve slightly, but at 38% and 31% respectively this suggested that updating the metric alone was not sufficient. We also needed better prompts.

![benchmark_results_3](images/blog/benchmark_results_3.png)

All Time and All Channels had relatively high accuracy compared to other benchmarks despite only having one iteration. We used a lot of the learnings from iterating on other benchmarks, such as providing enough context in our prompts and choosing appropriate metrics, and that could have been one reason for these results.

![first_channel_2](images/blog/first_channel_2.png)

Taking a closer look at First Channel v2 across all images gemini-2.5-pro was able to extract results at 87% accuracy, a significant performance gain for the same model compared to the v1 prompt (50%). 

![first_program_3](images/blog/first_program_3.png)

Looking at First Program v3 gemini-2.5-pro was able to extract results at 100% accuracy (for reference the v1 prompt had 44% accuracy). What's interesting is that even with the same prompt the models available on the Playground API had a very wide range of results.

![example_outputs](images/blog/example_outputs.png)

Image #19 had "Politically" as it's first program. The above shows a sample of what some of the models on the playground produced where scores were assigned based on the character similarity between the output and the ground truth.

## Results by Model

![model_ranking_2](images/blog/model_ranking_2.png)

Across all benchmarks and images gemini-2.5-pro remained our top performing model across this new set of benchmarks. Even with multiple rounds of iterations only a handful of models had accuracy rates above 80% for our hardest benchmarks. This suggests that continuous refinement via our framework does improve outputs but it's hard to predict which models will be best.

# Learnings

Looking back on my project the major accomplishments can be summarized into two categories:

1. Speed and Ease: the pipeline design allowed us to easily add new models, benchmarks, or images. Tasks were able to be processed in parallel, results were stored directly in a database, and metrics were calculated dynamically. This framework can be adapted by any researcher looking to evaluate LLMs for structured document extraction.

2. Quality of results: above anything else good results came from a well defined research question and a solid understanding of the variability and outliers in our data. Only from there could we create tasks, build prompts, and choose the right metrics.


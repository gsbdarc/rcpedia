---
date:
  created: 2023-08-08
pin: true
links:
    - External link: https://google.com

 
---


# Using Twarc python package to scrape Twitter

In this topic guide, we discuss how to get started with the [`twarc`](https://github.com/DocNow/twarc) python package to scrape Twitter.

## Installing `Twarc` package
We will use a `conda` to install all the python packages into. 
That way we can make it into the kernel on JupyterHub and use the same environmnet on interactive yens, 
[`yen-slurm`](/training/3_yen_slurm.html) or 
[JupyterHub](/training/6_jupyter_hub.html).

```
$ ml anaconda3
```

After loading Anaconda module, make the new environment. If you are working on a shared project and want to share one
 conda environment with your collaborators, you can use `--prefix` argument instead of `-n` when calling `conda create`.
 You can also specify the version of python with which to make the environment.
 
```
$ conda create --prefix=/zfs/projects/<project-space>/conda/twitter python=3.10
```

In the above command, make sure you have the write privilages to `/zfs/projects/<project-space>/conda/` before making 
the conda environment. After the conda env is created, all of the python packages including `twarc` will be installed there.

After the environment is made, activate it:

```
$ source activate /zfs/projects/<project-space>/conda/twitter 
```

Install the necessary python packages:

```
$ pip install pandas twarc python-dotenv
```

We will use [`python-dotenv`](https://pypi.org/project/python-dotenv/) package for passing our Twitter API key to our
python script.  

Last step is to make this conda environment into a Jupyter kernel.  

Running the following command will install the active conda environment as a kernel in your JupyterHub. Pick a name
for your kernel to go into the `--name` argument.

```
$ python -m ipykernel install --user --name=twitter
```

Start up [Jupyter](/yen/webBasedCompute.html) on any of the interactive yens (yen[1-5]) and you should now see a new
kernel in the Launcher menu under Notebooks. Start a new notebook with that kernel.

![](/images/twitter_kernel.png)

## Scraping Twitter

This guide uses Academic Research License discontinued by Twitter earler this year. 

Once Academic Research application was approved, a researcher had access to [Twitter developer dashboard](https://developer.twitter.com/en/portal/products/academic-research).
Go to your Projects & App and make a new app. It will have a unique API Key and Secret and a Bearer Token that will be used to access Twitter data.
 
### Test Jupyter environment

Make sure you can import all of the following python packages:
 
```python
import os, json
import datetime as dt
import pandas as pd
from twarc import Twarc2, expansions
from dotenv import load_dotenv
```


### Twitter API Authentication
To keep your API key secure (you should never ever hard-code your API or other keys directly into your script or notebook), 
we need to create an `.env` file in the same place as the ipynb notebook. 

Save your Twitter API Bearer token in the `.env` file:

```
TWITTER_API_BEARER_TOKEN="XXXXX"
```

In the notebook, we need to first load the dotenv extension. 

```python
%load_ext dotenv
%dotenv
```

Then, we can get the value of the `TWITTER_API_BEARER_TOKEN` with:

```python
# API Bearer Token
bearer_token = os.environ["TWITTER_API_BEARER_TOKEN"]
```

Finally, make sure you can connect to Twitter API without errors:

```python
client = Twarc2(bearer_token=bearer_token)
```

## Get Tweets
When you query Twitter API, you will get all tweets matching the query without comments. 

For example, let's get all tweets talking about GSB and Stanford since December 1, 2022 until today.

```python
start_time = dt.datetime(2022, 12, 1, 0, 0, 0, 0, dt.timezone.utc)
end_time = None
query = "GSB Stanford"
```

The Academic Twitter API allows you to search all tweets, not just the last 7 days as in the common Twitter API by
using `client.search_all()` function from `twarc` package. To get all tweets (without comments) for our query,
 run the following:

```python
search_results = client.search_all(query=query, start_time=start_time, end_time=end_time, max_results=100)
```

Once we examine the tweets, we can decide what fields we want to keep and then construct a handy dataframe to store
the tweets:

```python
columns = ['tweet_id', 'conversation_id', 'text', 'author_id', 'author', 'created_at', 'lang', 'retweet_count', 'reply_count', 'like_count', 'quote_count', 'hashtags', 'mentions_user_name', 'mentions_user_id', 'urls', 'expanded_urls', 'attachment_type', 'attachment', 'referenced_tweets_type', 'referenced_tweets_id']

# all tweets w/o conversations
df = pd.DataFrame(columns = columns)
```

You might not want to store all 20 fields but pick and choose what suits your research. 


Then, we can write a function that gets the tweet data for each tweet returned in `search_results` generator object.

```python
def get_tweet_data(tweet):
    '''
    Parse tweet data for one tweet and return all features as lists.
    '''
    # tweet ID
    tweet_id = json.dumps(tweet['id'])

    # conversation ID
    conversation_id = json.dumps(tweet['conversation_id'])
        
    # text
    text = json.dumps(tweet['text'])
        
    # author ID
    author_id = tweet['author_id']
        
    # author
    author_user_name = tweet['author']['username']
        
    # created_at
    created_at = dt.datetime.strftime(dt.datetime.strptime(tweet['created_at'], '%Y-%m-%dT%H:%M:%S.000Z'), date_format)
        
    # lang
    lang = tweet['lang']
        
    # retweet count
    retweet_count = tweet['public_metrics']['retweet_count']
        
    # reply count
    reply_count = tweet['public_metrics']['reply_count']
        
    # like count
    like_count = tweet['public_metrics']['like_count']
    
    # quote count
    quote_count = tweet['public_metrics']['quote_count']     
        
    if 'entities' in tweet.keys():    
        
        # hashtags
        if 'hashtags' in tweet['entities'].keys():
            tweet_hashtags = []
            for h in tweet['entities']['hashtags']:
                tweet_hashtags.append(h['tag'])
            hashtags = tweet_hashtags
        else:
            hashtags = ''


        if 'mentions' in tweet['entities'].keys():

            tweet_mentions_user, tweet_mentions_id = [], []
            
            # mentions_user_name, mentions_user_id
            for m in tweet['entities']['mentions']:
                tweet_mentions_user.append(m['username'])
                tweet_mentions_id.append(json.dumps(m['id']))

            mentions_user_name = tweet_mentions_user
            mentions_user_id = tweet_mentions_id

        else:
            mentions_user_name = ''
            mentions_user_id = ''
            
            
        if 'urls' in tweet['entities'].keys():                
                        
            tweet_url, tweet_eurl = [], []
            
            for u in tweet['entities']['urls']:
                
                tweet_url.append(u['url'])
                tweet_eurl.append(u['expanded_url'])

            urls = tweet_url
            expanded_urls = tweet_eurl

        else:
            urls = ''
            expanded_urls = ''
    else:
        hashtags = ''
        mentions_user_name = ''
        mentions_user_id = ''
        urls = ''
        expanded_urls = ''
            
    # attachment media type
    if 'attachments' in tweet.keys():

        if  'media' in tweet['attachments'].keys():

            attachments_type_tmp = []
            attachments_tmp = []
            for m in tweet['attachments']['media']:
                attachments_type_tmp.append(m['type'])

                if 'url' in m.keys():
                    attachments_tmp.append(m['url'])
                elif 'preview_image_url' in m.keys():
                    attachments_tmp.append(m['preview_image_url'])


            attachment_type = attachments_type_tmp
            attachment = attachments_tmp

        else:
            attachment_type = ''
            attachment = ''

    else:
        # no attachment key
        attachment_type = ''
        attachment = ''
                
    if 'referenced_tweets' in tweet.keys():
        
        # if retweeted or replied to
        referenced_tweets_type_tmp, referenced_tweets_id_tmp = [], []
        for t in tweet['referenced_tweets']:
            referenced_tweets_type_tmp.append(t['type'])
            referenced_tweets_id_tmp.append(t['id'])

        referenced_tweets_type = referenced_tweets_type_tmp
        referenced_tweets_id = referenced_tweets_id_tmp


    else:
        referenced_tweets_type = ''
        referenced_tweets_id = ''
    
    return tweet_id, conversation_id, text, author_id, author_user_name, created_at, lang, retweet_count, reply_count, like_count, quote_count, hashtags, mentions_user_name, mentions_user_id, urls, expanded_urls, attachment_type, attachment, referenced_tweets_type, referenced_tweets_id 
```

Note that I am using `json.dumps()` function in the script. That way, if the text has any escape characters like `\n`, 
it will not create a new row when we write the dataframe to csv or excel formats. Also, long ID's for tweets and conversations are safer to
write to json as well because excel will truncate very large integers. 

Using the `get_tweet_data()` function from above, we now stuff all the tweet data into a dataframe:

```python
date_format='%m/%d/%Y %H:%M:%S'
df_temp = pd.DataFrame(columns = columns)

tweet_id, conversation_id, text, author_id, author_user_name, created_at, lang, retweet_count, reply_count, like_count, quote_count, hashtags, mentions_user_name, mentions_user_id, urls, expanded_urls, attachment_type, attachment, referenced_tweets_type, referenced_tweets_id = [],[],[],[], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]

search_results = client.search_all(query=query, start_time=start_time, end_time=end_time, max_results=100)

# Twarc returns all Tweets for the criteria set above, so we page through the results
for page in search_results:

    result = expansions.flatten(page)
    # go through all tweets mentioning the article and append to temp lists
    for tweet in result:

        # get one tweet data
        tweet_id_tmp, conversation_id_tmp, text_tmp, author_id_tmp, author_user_name_tmp, created_at_tmp, lang_tmp, retweet_count_tmp, reply_count_tmp, like_count_tmp, quote_count_tmp, hashtags_tmp, mentions_user_name_tmp, mentions_user_id_tmp, urls_tmp, expanded_urls_tmp, attachment_type_tmp, attachment_tmp, referenced_tweets_type_tmp, referenced_tweets_id_tmp = get_tweet_data(tweet)

        tweet_id.append(tweet_id_tmp)
        conversation_id.append(conversation_id_tmp)
        text.append(text_tmp)
        author_id.append(author_id_tmp)
        author_user_name.append(author_user_name_tmp)
        created_at.append(created_at_tmp)
        lang.append(lang_tmp)
        retweet_count.append(retweet_count_tmp) 
        reply_count.append(reply_count_tmp)  
        like_count.append(like_count_tmp)  
        quote_count.append(quote_count_tmp)  
        hashtags.append(hashtags_tmp)  
        mentions_user_name.append(mentions_user_name_tmp)  
        mentions_user_id.append(mentions_user_id_tmp)  
        urls.append(urls_tmp)  
        expanded_urls.append(expanded_urls_tmp)
        attachment_type.append(attachment_type_tmp)  
        attachment.append(attachment_tmp)  
        referenced_tweets_type.append(referenced_tweets_type_tmp)  
        referenced_tweets_id.append(referenced_tweets_id_tmp)  

# put all tweets into a pandas df
df_temp['tweet_id'], df_temp['conversation_id'], df_temp['text'], df_temp['author_id'] = tweet_id, conversation_id, text, author_id
df_temp['author'], df_temp['created_at'], df_temp['lang'], df_temp['retweet_count'] = author_user_name, created_at, lang, retweet_count
df_temp['reply_count'], df_temp['like_count'], df_temp['quote_count'], df_temp['hashtags'] = reply_count, like_count, quote_count, hashtags
df_temp['mentions_user_name'], df_temp['mentions_user_id'], df_temp['urls'], df_temp['expanded_urls']  = mentions_user_name, mentions_user_id, urls, expanded_urls
df_temp['attachment_type'], df_temp['attachment'], df_temp['referenced_tweets_type'], df_temp['referenced_tweets_id'] = attachment_type, attachment, referenced_tweets_type, referenced_tweets_id

print(df_temp.shape)
df = pd.concat([df, df_temp])

```

Let's look at the first few rows:

```python
df.head()
```

You should see something similar to:

![](/images/df-head-twarc.png)


We want to get rid of duplicated tweets:

```python
df = df[~df.duplicated(subset = 'tweet_id')]
```

For this example, we also sort the tweets by `created_at` date:

```python
df = df.sort_values(by = 'created_at').reset_index(drop = True)
```

At this point, the data is ready to be written to a csv file:

```python
df.to_csv('tweets-no-comments.csv', index = False)
```

## Getting Retweets 
We might also be interested in tweets that match our query that were retweeted and started their own
discussion (and got their own unique `tweet_id`). We can iterate over all tweets that have been quoted or retweeted and get those tweets.

Instead of using the query from above, we use `tweet_id` values and get retweets that will expand our
tweet dataframe because our original query did not pull retweets or tweet quotes.

```python
df_retweets = pd.DataFrame(columns = columns)

for i, t in enumerate(df_retweet['tweet_id']):
    print(i, '/', len(df_retweet['tweet_id']))
          
    query = str(t)
    df_temp = pd.DataFrame(columns = columns)
    tweet_id, conversation_id, text, author_id, author_user_name, created_at, lang, retweet_count, reply_count, like_count, quote_count, hashtags, mentions_user_name, mentions_user_id, urls, expanded_urls, attachment_type, attachment, referenced_tweets_type, referenced_tweets_id = [],[],[],[], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]   

    search_results = client.search_all(query=query, start_time=start_time, end_time=end_time, max_results=100)

    for page in search_results:

        result_tweets = expansions.flatten(page)
        # go through all tweets mentioning the article and append to temp lists
        for tweet in result_tweets:
            
            # get one tweet data
            tweet_id_tmp, conversation_id_tmp, text_tmp, author_id_tmp, author_user_name_tmp, created_at_tmp, lang_tmp, retweet_count_tmp, reply_count_tmp, like_count_tmp, quote_count_tmp, hashtags_tmp, mentions_user_name_tmp, mentions_user_id_tmp, urls_tmp, expanded_urls_tmp, attachment_type_tmp, attachment_tmp, referenced_tweets_type_tmp, referenced_tweets_id_tmp = get_tweet_data(tweet)

            tweet_id.append(tweet_id_tmp)
            conversation_id.append(conversation_id_tmp)
            text.append(text_tmp)
            author_id.append(author_id_tmp)
            author_user_name.append(author_user_name_tmp)
            created_at.append(created_at_tmp)
            lang.append(lang_tmp)
            retweet_count.append(retweet_count_tmp) 
            reply_count.append(reply_count_tmp)  
            like_count.append(like_count_tmp)  
            quote_count.append(quote_count_tmp)  
            hashtags.append(hashtags_tmp)  
            mentions_user_name.append(mentions_user_name_tmp)  
            mentions_user_id.append(mentions_user_id_tmp)  
            urls.append(urls_tmp)  
            expanded_urls.append(expanded_urls_tmp)
            attachment_type.append(attachment_type_tmp)  
            attachment.append(attachment_tmp)  
            referenced_tweets_type.append(referenced_tweets_type_tmp)  
            referenced_tweets_id.append(referenced_tweets_id_tmp)  

    # put all tweets into a pandas df
    df_temp['tweet_id'], df_temp['conversation_id'], df_temp['text'], df_temp['author_id'] = tweet_id, conversation_id, text, author_id
    df_temp['author'], df_temp['created_at'], df_temp['lang'], df_temp['retweet_count'] = author_user_name, created_at, lang, retweet_count
    df_temp['reply_count'], df_temp['like_count'], df_temp['quote_count'], df_temp['hashtags'] = reply_count, like_count, quote_count, hashtags
    df_temp['mentions_user_name'], df_temp['mentions_user_id'], df_temp['urls'], df_temp['expanded_urls'] = mentions_user_name, mentions_user_id, urls, expanded_urls
    df_temp['attachment_type'], df_temp['attachment'], df_temp['referenced_tweets_type'], df_temp['referenced_tweets_id'] = attachment_type, attachment, referenced_tweets_type, referenced_tweets_id
    
    df_retweets = pd.concat([df_retweets, df_temp])
           
```

When running this loop, you are likely to see this:

```python
rate limit exceeded: sleeping 567.0111730098724 secs
```

This is because we are making a lot of calls to the Twitter API. The scraping will proceed after the sleep time is over.

Then we combine with tweets dataframe, throw away duplicated tweets and sort by `created_at` date.

```python
df_combined = pd.concat([df, df_retweets])
df_combined = df_combined[~df_combined.duplicated(subset = 'tweet_id')]
df_combined = df_combined.sort_values(by = 'created_at').reset_index(drop = True)
```


## Getting Comments / Replies to Each Tweet
Each tweet has a unique ID and the comments and replies are tracked in "conversations" with unique `conversation_id` 
per conversation. We can use these `conversation_id` values to get all comments and replies for a particular tweet.

We use `conversation_id` value as the query to the `client.search_all()` function.
If you want to see the particular conversation in the web browser, you can insert the tweet ID in the following URL: `https://twitter.com/anyuser/status/<tweet_id>`. For example, the first tweet from `df` dataframe has `tweet_id` of 1613280296316686337. By pasting the value into the URL, we get the following link - [https://twitter.com/anyuser/status/1613280296316686337](https://twitter.com/anyuser/status/1613280296316686337) that will show us the tweet, its comments and replies.

The following function can be used to get all comments based on tweet's conversation ID:

```python
def get_all_comments_per_conversation_id(c_id):
    '''
    Get df of comments for input conversation ID
    Conversations are aleady time sorted
    '''
    
    df = pd.DataFrame(columns = columns)
    query = "conversation_id:" + json.loads(c_id)
    search_results = client.search_all(query=query, start_time=start_time, max_results=100)
    
    tweet_id, conversation_id, text, author_id, author_user_name, created_at, lang, retweet_count, reply_count, like_count, quote_count, hashtags, mentions_user_name, mentions_user_id, urls, expanded_urls, attachment_type, attachment, referenced_tweets_type, referenced_tweets_id = [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  

    for page in search_results:

        result = expansions.flatten(page)
        for tweet in result:
            
            # get one tweet data
            tweet_id_tmp, conversation_id_tmp, text_tmp, author_id_tmp, author_user_name_tmp, created_at_tmp, lang_tmp, retweet_count_tmp, reply_count_tmp, like_count_tmp, quote_count_tmp, hashtags_tmp, mentions_user_name_tmp, mentions_user_id_tmp, urls_tmp, expanded_urls_tmp, attachment_type_tmp, attachment_tmp, referenced_tweets_type_tmp, referenced_tweets_id_tmp = get_tweet_data(tweet)

            tweet_id.append(tweet_id_tmp)
            conversation_id.append(conversation_id_tmp)
            text.append(text_tmp)
            author_id.append(author_id_tmp)
            author_user_name.append(author_user_name_tmp)
            created_at.append(created_at_tmp)
            lang.append(lang_tmp)
            retweet_count.append(retweet_count_tmp) 
            reply_count.append(reply_count_tmp)  
            like_count.append(like_count_tmp)  
            quote_count.append(quote_count_tmp)  
            hashtags.append(hashtags_tmp)  
            mentions_user_name.append(mentions_user_name_tmp)  
            mentions_user_id.append(mentions_user_id_tmp)  
            urls.append(urls_tmp)  
            expanded_urls.append(expanded_urls_tmp)  
            attachment_type.append(attachment_type_tmp)  
            attachment.append(attachment_tmp)  
            referenced_tweets_type.append(referenced_tweets_type_tmp)  
            referenced_tweets_id.append(referenced_tweets_id_tmp)  

    # put all tweets into a pandas df
    df['tweet_id'], df['conversation_id'], df['text'], df['author_id'] = tweet_id, conversation_id, text, author_id
    df['author'], df['created_at'], df['lang'], df['retweet_count'] = author_user_name, created_at, lang, retweet_count
    df['reply_count'], df['like_count'], df['quote_count'], df['hashtags'] = reply_count, like_count, quote_count, hashtags
    df['mentions_user_name'], df['mentions_user_id'], df['urls'], df['expanded_urls'] = mentions_user_name, mentions_user_id, urls, expanded_urls
    df['attachment_type'], df['attachment'], df['referenced_tweets_type'], df['referenced_tweets_id'] = attachment_type, attachment, referenced_tweets_type, referenced_tweets_id
    
    # return df that is sorted by time
    df = df.sort_values(by = 'created_at').reset_index(drop = True)
    
    return df
```

Here, we use `json.loads()` function to get the conversation ID but if you were using `str()` or `int()`, just make
sure to covert it to a string as the query expects `str()` type.

We can then loop over the unique conversations to get all comments and replies to tweets:

```python
# use conversatin ID to get all comments
result = pd.DataFrame(columns = columns)

for i, c in enumerate(df_combined["conversation_id"]):
        
    print(i, '/', df_combined.shape[0])
    
    # insert the row from df_combined (original + retweet)
    result = pd.concat([result, pd.DataFrame(df_combined.iloc[i]).transpose()])
    
    # then insert all comments for that conversation
    df_comments = get_all_comments_per_conversation_id(c) 
    
    if df_comments.shape[0] > 0:
        result = pd.concat([result, df_comments])
    
    print(result.shape)

# drop duplicated tweets
result = result[~result.duplicated(subset = 'tweet_id')]
```

Here, we are inserting the comments / replies that are time sorted before getting the comments for the next conversation.

We can now write the final tweets, retweets with comments to an excel or csv formats:

```python
result.to_excel('all-tweets-retweets-comments.xlsx', index = False)
result.to_csv('all-tweets-retweets-comments.csv', index = False)
```


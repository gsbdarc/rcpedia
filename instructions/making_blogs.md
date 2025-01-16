Instruction for creating a new blog
---

### Step 1: Create a new blog post, this is a typical markdown file with the following header:
    
 ```markdown
---
date:
  created: 2024-03-28
  updated: 2024-08-28
categories:
    - Machine Learning
    - GPU
---

```
In the file location: `docs/blog/posts/<YOUR_FILE>.md

The first line after your header is the title of your blog post. This is the text that will be displayed in the blog index page.

If you would like to add a "Read More" link to your blog post, you can add the following line to your markdown file:

```markdown
<!-- more -->
```
Note: All ordering will be handle by the date field in the header. Mkdocs material will automatically sort the blog posts by date as long as they are in the posts directory.

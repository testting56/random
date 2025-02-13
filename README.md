# PR Summarization GitHub Action

This GitHub Action automatically reviews pull request (PR) changes by generating a concise summary using Cohere AI and posting that summary as a comment on the PR. This guide explains the purpose of each file and how to set up the action in your repository.

---

## File Overview

### 1. `post-pr-summary.js`

This is the main Node.js script that:
- **Fetches the PR diff**: Uses the `getPullRequestDiff` function to call the GitHub API and retrieve the diff for the current PR.
- **Generates a summary**: Uses the `getDiffSummary` function to send the diff to Cohere AI, which returns a concise summary with actionable feedback.
- **Posts the summary as a comment**: Uses the `postComment` function to post the generated summary back to the PR as a comment.

Key functions in `post-pr-summary.js`:
- **`getPullRequestDiff(owner, repo, pullNumber)`**: 
  - Makes a GET request to the GitHub API using the `/pulls/{pull_number}` endpoint with the `application/vnd.github.v3.diff` header.
  - Returns the diff as plain text.
  
- **`getDiffSummary(diff)`**:
  - Sends the diff to Cohere AI using the `cohere.chat` method.
  - Uses the 'command-r-plus' model to process and return a summary.
  
- **`postComment(owner, repo, pullNumber, comment)`**:
  - Uses the GitHub API to post a comment on the PR.
  - Logs the URL of the created comment for reference.

### 2. `githubService.js`

This file contains the implementation of:
- **`getPullRequestDiff`**
- **`getDiffSummary`**

These functions are imported by `post-pr-summary.js` to separate the GitHub and Cohere-related logic from the main workflow script.

### 3. GitHub Action Workflow File: `.github/workflows/summarize-pr.yml`

This YAML file defines the workflow that runs the PR Summarization action. It:
- **Triggers on PR events**: Specifically, when a PR is opened or updated (`opened`, `synchronize`).
- **Sets up the environment**: Checks out the repository and sets up Node.js.
- **Installs dependencies**: Runs `npm install` to install required packages.
- **Runs the script**: Executes the `post-pr-summary.js` script with necessary environment variables.

# Setup Instructions

## Clone or Create Your Repository

Add the following files to your repository:

- `post-pr-summary.js`
- `githubService.js`
- `.github/workflows/summarize-pr.yml`
- `README.md` (this file)

## Install Dependencies

1. Ensure you have Node.js installed.
2. Run the following command to install the required packages:
   ```bash
   npm install axios cohere-ai dotenv
   ```
   ## Configure Environment Variables

Create a `.env` file in the root of your repository (for local testing) with the following keys:

```ini
GITHUB_TOKEN=your_github_token
COHERE_API_KEY=your_cohere_api_key
GITHUB_REPOSITORY=your_username/your_repo
PR_NUMBER=the_pr_number  # Only needed for local testing
```

In GitHub, add the secrets `MY_GITHUB_TOKEN` and `COHERE_API_KEY` via your repository settings.

*Note:* The `GITHUB_TOKEN` is automatically available in GitHub Actions, but a custom token may be required depending on your setup.

---

## Commit and Push

- Commit all files to your repository.
- Push to GitHub. The GitHub Action will automatically run whenever a PR is created or updated.

---

## Verify

- Open or update a PR in your repository.
- After the action completes, you should see a comment on the PR with the summarization of the code changes.

# setup-action

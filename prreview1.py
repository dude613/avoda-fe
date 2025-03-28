import sys
import requests
import os
# --- Configuration & Constants (hardcoded) ---
GITHUB_API_URL = "https://api.github.com"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
MODEL_NAME = "o3-mini"

# Our base prompt without the diff.
BASE_PROMPT = (
    "You are a seasoned code reviewer. Please analyze the following cumulative code diff and provide a strong review for the PR. Format your response in Markdown with the following structure:\n\n ## Code Review Analysis\n\n Summary:\n Provide a concise overview of the changes introduced in the diff. Just output the response, no additional comments.\n\n ##Changes: To the point bullet point of all the (focus on functional) changes in the diff, don't say anything about code formatting. Detailed Observations:\n List key issues and high level potential bugs in bullet points.\n\n Only very important and value add suggestions for improvements.(Not things like verify..or review..). Ignore and don't focus or mention anything about testing. We are focused on functionality 110%:\n Provide actionable recommendations to take care of any fixes. We are using React19 and TailwindV4 with a Node backend.\n\n"
)

# Retrieve configuration from environment variables or hardcoded for local testing
OWNER = "dude613"
REPO = "avoda-fe"
PR_NUMBER = 23

# Retrieve tokens from environment variables or hardcoded for local testing
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# --- Helper Functions ---

def get_changed_files(owner: str, repo: str, pr_number: int, github_token: str):
    """
    Retrieve the list of changed files (with patch/diff data) in a PR.
    """
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/pulls/{pr_number}/files"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def call_openai_api(prompt: str, openai_api_key: str):
    """
    Call OpenAI's API with the provided prompt and return the response text.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    body = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ]
        # "max_tokens" and "temperature" parameters can be added here if needed.
    }
    response = requests.post(OPENAI_API_URL, headers=headers, json=body)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

def save_review_to_file(filename: str, content: str):
    """
    Save the review content to a text file.
    """
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved review to {filename}")

def main():
    print(f"Fetching changed files for PR #{PR_NUMBER} in {OWNER}/{REPO}...")
    files = get_changed_files(OWNER, REPO, int(PR_NUMBER), GITHUB_TOKEN)

    # Extensions to ignore
    ignore_extensions = (
        '.yml', '.css', '.json', '.lock', '.env', '.txt', 
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', 
        '.ttf', '.woff', '.woff2', '.eot', '.otf'
    )

    aggregated_diff = ""
    for file_info in files:
        filename = file_info.get("filename")
        patch = file_info.get("patch")

        # Skip if there's no patch (e.g. binary file).
        if not patch:
            print(f"Skipping {filename} (no patch available)")
            continue

        # Skip if the file extension is in the ignored list.
        if filename.lower().endswith(ignore_extensions):
            print(f"Skipping {filename} (ignored file extension)")
            continue

        # Append a header for each file to clearly separate diffs.
        aggregated_diff += f"\n### File: {filename}\n{patch}\n"

    if not aggregated_diff.strip():
        print("No applicable diffs found to review.")
        return

    # Create the prompt for the entire PR
    prompt = BASE_PROMPT + aggregated_diff
    print("Sending aggregated diff to OpenAI API...")
    try:
        review_response = call_openai_api(prompt, OPENAI_API_KEY)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return

    output_filename = "pr_review_summary.txt"
    save_review_to_file(output_filename, review_response)

if __name__ == "__main__":
    main()
# Post Automation Script

This Google Apps Script, authored by Cody Reeves, automates the process of generating and posting content. It utilizes a Google Sheet to store post history and leverages the OpenAI API for creating new posts.

👤 **Author**: [Cody Reeves](https://cody.withdesign.ca)

## Features

- **Automated Post Generation**: Generates weekly posts using OpenAI's GPT-4 model.
- **Google Sheets Integration**: Utilizes a Google Sheet for tracking post history and ensuring content uniqueness.
- **Customizable Prompts**: Allows customization of prompts for post generation.
- **Error Logging**: Logs errors for troubleshooting, such as sheet not found or empty sheet scenarios.

## Prerequisites

- Access to Google Apps Script.
- A Google Sheet to store post history.
- OpenAI API key for using GPT-4.

## Setup

1. **Google Sheet Configuration**: 
   - Create a new Google Sheet or use an existing one.
   - Note down the sheet name to be used in the script.

2. **Script Installation**:
   - Open Google Apps Script and create a new project.
   - Copy the provided script into the script editor.

3. **API Key Configuration**:
   - Replace `"sk-***"` in the `generatePostWithChatGPT` function with your OpenAI API key.

4. **Running the Setup Function**:
   - Run the `setup` function to create a weekly trigger for the post generation task.

## Usage

- The script will automatically trigger once a week, generating and logging a new LinkedIn post.
- Review and modify the `prompts` and `assistantPrompt` functions to change the content generation context.

## Functions

- `prompts`: Returns the main prompt for generating a post.
- `assistantPrompt`: Returns an assistant message for context in the API request.
- `weeklyLinkedinPost`: Main function to generate and log the LinkedIn post.
- `generatePostWithChatGPT`: Handles the interaction with OpenAI's API for content generation.
- `createPromptWithPastPosts`: Enhances prompts with historical data to avoid content repetition.
- `createWeeklyTrigger`: Sets up the weekly automation trigger.
- `setup`: Initializes the script with necessary triggers.

## Customization

- Modify the `prompts` and `assistantPrompt` functions for different post-generation themes or contexts.

## Troubleshooting

- Check the Google Apps Script log for error messages.
- Ensure the Google Sheet name is correctly specified in the script.
- Verify that your OpenAI API key is valid and correctly entered in the script.

## License

This project is licensed under the [MIT License](LICENSE).

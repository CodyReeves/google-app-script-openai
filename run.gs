/**
 * Google Apps Script for LinkedIn Post Automation
 * Author: Cody Reeves - cody.withdsign.ca
 */

/**
 * Returns a prompt string for generating LinkedIn posts.
 * @returns {string} A string representing the prompt for post generation.
 */
function prompts() {
  var prompt = "Today's LinkedIn post topic: "; // Modify with an actual prompt
  return prompt;
}

/**
 * Returns a string to be used as the assistant's message in the API request.
 * @returns {string} A string representing the assistant message.
 */
function assistantPrompt() {
  var prompt = "Assistant message for context."; // Modify with an actual assistant message
  return prompt;
}

/**
 * Generates a LinkedIn post based on the contents of a Google Sheets document.
 * @param {string} sheetName - The name of the Google Sheet. Defaults to 'gmail-response' if empty.
 */
function weeklyLinkedinPost(sheetName) {
  sheetName = sheetName || 'gmail-response'; 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    Logger.log('Error: Sheet named "' + sheetName + '" not found.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    Logger.log('Error: Sheet "' + sheetName + '" is empty.');
    return;
  }

  var pastPosts = sheet.getRange(1, 1, lastRow, 1).getValues(); 
  var prompt = prompts(); 
  var newPost = generatePostWithChatGPT(prompt, pastPosts);

  if (newPost) {
    sheet.appendRow([new Date(), newPost]);
  } else {
    Logger.log('Error: No new post was generated.');
  }
}

/**
 * Generates a LinkedIn post using the OpenAI API.
 * @param {string} prompt - The prompt for post generation.
 * @param {Array} pastPosts - Array of past posts.
 * @returns {string} The generated post or an error message.
 */
function generatePostWithChatGPT(prompt, pastPosts) {
  var apiUrl = "https://api.openai.com/v1/chat/completions";
  var apiKey = "sk-***";
  var assistantMessage = assistantPrompt();

  var payload = {
    model: "gpt-4",
    messages:[
      {"role": "system", "content": assistantMessage },
      {"role": "user", "content": prompt }],
    temperature: 0.7
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + apiKey
    },
    payload: JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseJson = JSON.parse(response.getContentText());
  
  if(response.getResponseCode() === 200 && responseJson.choices && responseJson.choices.length > 0) {
    var message = responseJson.choices[0].message;
    return message.hasOwnProperty('content') ? message.content.trim() : "Error: Unexpected message format. Please check the logs.";
  } else {
    var errorMsg = (responseJson.error) ? responseJson.error : 'Unknown error generating post.';
    Logger.log('Error in API response: ' + errorMsg);
    return "Error generating post. Please check the logs.";
  }
}

/**
 * Enhances the given prompt by adding context from past posts.
 * @param {string} prompt - The original prompt.
 * @param {Array} pastPosts - Array of past posts.
 * @returns {string} An enhanced prompt string.
 */
function createPromptWithPastPosts(prompt, pastPosts) {
  if (!pastPosts || pastPosts.length === 0 || !Array.isArray(pastPosts)) {
    return prompt;
  }

  var postHistory = pastPosts.map(function(row) {
    return row[1];
  }).join('\n');

  return "Avoid repeating these topics: \n" + postHistory + "\n\n" + prompt;
}

/**
 * Sets up a weekly trigger to call the weeklyLinkedinPost function.
 */
function createWeeklyTrigger() {
  ScriptApp.newTrigger('weeklyLinkedinPost')
    .timeBased()
    .everyWeeks(1)
    .create();
}

/**
 * Initializes the script by setting up the weekly trigger.
 */
function setup() {
  createWeeklyTrigger();
}

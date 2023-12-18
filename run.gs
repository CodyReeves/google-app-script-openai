function prompts() {
  var prompt = ""
  return prompt;
}

function assistantPrompt() {
  var prompt = ""
  return prompt;
}

function weeklyLinkedinPost(sheetName) {
  var sheetName = sheetName == "" ? sheetName : 'gmail-response'; 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Check if the sheet exists
  if (!sheet) {
    Logger.log('Error: Sheet named "' + sheetName + '" not found.');
    return; // Exit the function if the sheet is not found
  }

  var lastRow = sheet.getLastRow();
  // Check if the sheet is empty
  if (lastRow === 0) {
    Logger.log('Error: Sheet "' + sheetName + '" is empty.');
    return; // Exit the function if the sheet is empty
  }

  // Define the prompt for generating the post
  var pastPosts = sheet.getRange(1, 1, lastRow, 1).getValues(); 
  var prompt = prompts(); 
  var newPost = generatePostWithChatGPT(prompt, pastPosts);

  // Add the new post to the next row in the sheet
  if (newPost) {
    sheet.appendRow(["date", newPost]);
  } else {
    Logger.log('Error: No new post was generated.');
  }
}
// createPromptWithPastPosts(prompt, pastPosts)
function generatePostWithChatGPT(prompt, pastPosts) {
  var apiUrl = "https://api.openai.com/v1/chat/completions"; // Replace with the appropriate API endpoint
  var apiKey = "sk-***"; // Replace with your OpenAI API Key
  var assistantMessage = assistantPrompt();

  var payload = {
    model: "gpt-4",
    messages:[
      {"role": "system", "content": assistantMessage },
      {"role": "user", "content": prompt }],
    temperature: 0.7 // Adjust as needed
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
  
  if(response.getResponseCode() === 200 && responseJson.choices && responseJson.choices.length > 0 && responseJson.choices[0].message) {
    var message = responseJson.choices[0].message;
    
    if (message.hasOwnProperty('content') && typeof message.content === 'string') {
      return message.content.trim();
    } else {
      Logger.log('Error: Unexpected message format in response.');
      return "Error: Unexpected message format. Please check the logs.";
    }
  } else {
    // Handle the error case
    var errorMsg = (responseJson.error) ? responseJson.error : 'Unknown error generating post.';
    Logger.log('Error in API response: ' + errorMsg);
    return "Error generating post. Please check the logs."; // Placeholder error message
  }
}

function createPromptWithPastPosts(prompt, pastPosts) {
  if (!pastPosts || pastPosts.length === 0 || !Array.isArray(pastPosts)) {
    return prompt; // If pastPosts is undefined, empty, or not an array, return the original prompt
  }

  var postHistory = pastPosts.map(function(row) {
    return row[1]; // Assuming each row contains a post in the first column
  }).join('\n');

  return "Avoid repeating these topics: \n" + postHistory + "\n\n" + prompt;
}

// Trigger this function once a week
function createWeeklyTrigger() {
  ScriptApp.newTrigger('weeklyLinkedinPost')
    .timeBased()
    .everyWeeks(1) // Set the trigger to run weekly
    .create();
}

// Run this function once to set up the weekly trigger
function setup() {
  createWeeklyTrigger();
}

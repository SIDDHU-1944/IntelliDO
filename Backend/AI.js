import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

async function extractTask(text) {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const today = new Date().toISOString().split("T")[0];
  const allowedCategories = [
    "work",
    "home",
    "finance",
    "business",
    "health",
    "diet",
    "appointment",
    "fitness",
  ];
  console.log("extractTaskformtext");
  let response;
  try {
    response = await withTimeout(
      client.path("/chat/completions").post({
        body: {
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that extracts tasks from user messages.Also From the given task text, select only one category that best matches the task from the list ${JSON.stringify(
                allowedCategories
              )}. 
          Respond ONLY in JSON format like: 
          { "title": "task title", "due": "ISO date/time if available or null" }
          Today's Date is ${today}.
          Example:
          Input: "Pay my credit card bill tomorrow"
          Output:
          { "task": "Pay credit card bill", "due": "2025-07-05", "category": "finance" }

          Input: "remind me to get nails, hammer, screws tomorrow at 5pm"
          Output:
          { "taskItems": [
            {"task":"buy nails"},
            {"task":"buy hammer"},
            {"task":"buy screws"} 
          ], "due": "2025-07-04T17:00:00", "category": "shopping" }
          Input: "Doctor appointment at 5pm"
          Output:
          { "task": "Doctor appointment", "due": "2025-07-03T17:00:00", "category": "health" }`,
            },
            { role: "user", content: text },
          ],
          temperature: 0,
          top_p: 1.0,
          model: model,
        },
      }),
      15000
    );
  } catch (err) {
    console.error("❌ Error during AI API call:", err);
    throw err;
  }

  if (!response || isUnexpected(response)) {
    throw response.body.error;
  }

  if (
    !response.body.choices ||
    !response.body.choices[0] ||
    !response.body.choices[0].message ||
    !response.body.choices[0].message.content
  ) {
    console.error("❌ Unexpected response format:", response.body);
    return null;
  }

  const resultText = response.body.choices[0].message.content;

  // console.log("🧠 Raw model response:", resultText);

  try {
    const structured = JSON.parse(resultText);
    console.log("✅ Extracted Task:", structured);
    if (!allowedCategories.includes(structured.category)) {
      structured.category = "uncategorized";
    }
    return structured;
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err.message);
    return null;
  }
}

async function getAutoCompletions(text) {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  // console.log("completions entered");
  let response;

  try {
    response = await withTimeout(
      client.path("/chat/completions").post({
        body: {
          messages: [
            {
              role: "system",
              content: `You are an autocomplete assistant. Given a partial user input, suggest at most 3 likely completions as a JSON array of strings. Respond ONLY with the JSON array, nothing else.
          Example:
          user types: "Buy m"
          Response: ["Buy milk","Buy medicine","Buy Mangoes"]`,
            },
            { role: "user", content: text },
          ],
          temperature: 0,
          top_p: 1.0,
          model: model,
        },
      }),
      15000
    );
  } catch (err) {
    console.error("❌ Error during AI API call:", err);
    throw err;
  }

  if (!response || isUnexpected(response)) {
    throw response.body.error;
  }

  if (
    !response.body.choices ||
    !response.body.choices[0] ||
    !response.body.choices[0].message ||
    !response.body.choices[0].message.content
  ) {
    console.error("❌ Unexpected response format:", response.body);
    return null;
  }

  const resultText = response.body.choices[0].message.content;

  console.log("🧠 Raw model response:", resultText);

  try {
    return JSON.parse(resultText);
  } catch (err) {
    // Try to extract JSON array from text
    const match = resultText.match(/\[.*\]/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    console.error("❌ Failed to parse JSON:", err.message);
    return null;
  }
}

export { extractTask, getAutoCompletions };

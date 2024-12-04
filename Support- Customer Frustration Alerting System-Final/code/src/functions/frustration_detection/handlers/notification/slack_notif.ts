import { WebClient } from "@slack/web-api";
import fs from "fs";

export async function slack_text(event: any) {
  const slackToken = event.input_data.global_values.slack_token;
  const conversationId = event.input_data.global_values.conversation_id;

  let errormessage = "error : ";

  console.log("Sending text to slack");

  const web = new WebClient(slackToken);

  await web.chat
    .postMessage({ channel: conversationId, text: "Frustration detected!" })
    .then(() => console.log("Slack notification sent."))
    .catch((e) => {
      console.error("Error sending Slack message:", e.toString());
      errormessage += e.toString();
    });
}

export async function slack_pdf(event: any, filePath: any) {
  const slackToken = event.input_data.global_values.slack_token;
  const conversationId = event.input_data.global_values.conversation_id;

  let errormessage = "error : ";

  console.log("Sending pdf to slack");
  const web = new WebClient(slackToken);
  try {
    await web.files.uploadV2({
      channel_id: String(conversationId),
      file: fs.createReadStream(filePath),
      initial_comment: "Here's the sentiment analysis report.",
      filename: `Sentiment_Report_${Date.now()}.pdf`,
    });
    console.log("PDF report sent to Slack successfully!");
  } catch (error) {
    console.error("Error sending PDF to Slack:", error);
  }
}

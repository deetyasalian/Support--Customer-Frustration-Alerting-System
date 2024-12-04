import fs from "fs";
import { email } from "./email_notif";
import { slack_pdf, slack_text } from "./slack_notif";

export default async function handleSentimentEvent(event: any, filePath: any) {
  const messageInput = event.input_data.global_values.notification_medium;
  // Conditional Notification Logic
  try {
    //if chosen as slack
    if (messageInput === "Slack") {
      console.log("Slack notification selected.");
      await slack_text(event);
      await slack_pdf(event, filePath);
    } else if (messageInput === "Email") {
      //if chosen as email
      console.log("Email notification selected.");
      await email(event, filePath);
    } else {
      //if chosen as both
      console.log("Both Slack and email notifications selected.");
      await slack_text(event);
      await slack_pdf(event, filePath);
      console.log("sending mail");
      await email(event, filePath);
    }
  } catch (error) {
    console.error("Error in notification logic:", error);
    //@ts-ignore
    errormessage += error.toString();
  } finally {
    // Clean up the generated PDF file after sending
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting PDF file:", err);
      } else {
        console.log(`Temporary PDF file ${filePath} deleted.`);
      }
    });
  }
}

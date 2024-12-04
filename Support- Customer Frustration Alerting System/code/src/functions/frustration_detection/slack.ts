import { WebClient } from "@slack/web-api";
import nodemailer from "nodemailer";

export default async function handleSentimentEvent(event: any) {
  const email = event.input_data.global_values.your_email;
  const emailPassword = event.input_data.global_values.your_password;
  const slackToken = event.input_data.global_values.slack_token;
  const conversationId = event.input_data.global_values.conversation_id;

  console.log("email : ", email);
  console.log("password : ", emailPassword);

  const messageInput = event.input_data.global_values.notification_medium;

  let errormessage = "error : ";
  const web = new WebClient(slackToken);

  console.log("before createTransport");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: emailPassword,
    },
  });
  console.log("after createTransport");

  // Conditional Notification Logic
  try {
    if (messageInput === "Slack") {
      console.log("Slack notification selected.");
      await web.chat
        .postMessage({ channel: conversationId, text: "Frustration detected!" })
        .then(() => console.log("Slack notification sent."))
        .catch((e) => {
          console.error("Error sending Slack message:", e.toString());
          errormessage += e.toString();
        });
    } else if (messageInput === "Email") {
      console.log("Email notification selected.");
      await transporter
        .sendMail({
          to: email,
          from: email,
          subject: "devrev mail",
          text: "Frustration Detected ", // plain text body
        })
        .then(() => {
          console.log("Email sent successfully.");
        })
        .catch((error: any) => {
          console.error("Error sending email:", error.toString());
          errormessage += error.toString();
        });
    } else {
      console.log("Both Slack and email notifications selected.");
      await web.chat
        .postMessage({ channel: conversationId, text: "Frustration detected!" })
        .then(() => console.log("Slack notification sent."))
        .catch((e) => {
          console.error("Error sending Slack message:", e.toString());
          errormessage += e.toString();
        });

      console.log("sending mail");
      await transporter
        .sendMail({
          to: email,
          from: email,
          subject: "devrev mail",
          text: "Frustration Detected", // plain text body
        })
        .then(() => {
          console.log("Email sent successfully.");
        })
        .catch((error: any) => {
          console.error("Error sending email:", error.toString());
          errormessage += error.toString();
        });
    }
  } catch (error) {
    console.error("Error in notification logic:", error);
    //@ts-ignore
    errormessage += error.toString();
  }
  console.log("mail sent");
}
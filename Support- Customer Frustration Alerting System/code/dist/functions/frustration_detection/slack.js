"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
const nodemailer_1 = __importDefault(require("nodemailer"));
function handleSentimentEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = event.input_data.global_values.your_email;
        const emailPassword = event.input_data.global_values.your_password;
        const slackToken = event.input_data.global_values.slack_token;
        const conversationId = event.input_data.global_values.conversation_id;
        console.log("email : ", email);
        console.log("password : ", emailPassword);
        const messageInput = event.input_data.global_values.notification_medium;
        let errormessage = "error : ";
        const web = new web_api_1.WebClient(slackToken);
        console.log("before createTransport");
        const transporter = nodemailer_1.default.createTransport({
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
                yield web.chat
                    .postMessage({ channel: conversationId, text: "Frustration detected!" })
                    .then(() => console.log("Slack notification sent."))
                    .catch((e) => {
                    console.error("Error sending Slack message:", e.toString());
                    errormessage += e.toString();
                });
            }
            else if (messageInput === "Email") {
                console.log("Email notification selected.");
                yield transporter
                    .sendMail({
                    to: email,
                    from: email,
                    subject: "devrev mail",
                    text: "Frustration Detected ", // plain text body
                })
                    .then(() => {
                    console.log("Email sent successfully.");
                })
                    .catch((error) => {
                    console.error("Error sending email:", error.toString());
                    errormessage += error.toString();
                });
            }
            else {
                console.log("Both Slack and email notifications selected.");
                yield web.chat
                    .postMessage({ channel: conversationId, text: "Frustration detected!" })
                    .then(() => console.log("Slack notification sent."))
                    .catch((e) => {
                    console.error("Error sending Slack message:", e.toString());
                    errormessage += e.toString();
                });
                console.log("sending mail");
                yield transporter
                    .sendMail({
                    to: email,
                    from: email,
                    subject: "devrev mail",
                    text: "Frustration Detected", // plain text body
                })
                    .then(() => {
                    console.log("Email sent successfully.");
                })
                    .catch((error) => {
                    console.error("Error sending email:", error.toString());
                    errormessage += error.toString();
                });
            }
        }
        catch (error) {
            console.error("Error in notification logic:", error);
            //@ts-ignore
            errormessage += error.toString();
        }
        console.log("mail sent");
    });
}
exports.default = handleSentimentEvent;

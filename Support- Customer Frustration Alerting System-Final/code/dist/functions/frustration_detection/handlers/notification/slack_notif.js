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
exports.slack_pdf = exports.slack_text = void 0;
const web_api_1 = require("@slack/web-api");
const fs_1 = __importDefault(require("fs"));
function slack_text(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackToken = event.input_data.global_values.slack_token;
        const conversationId = event.input_data.global_values.conversation_id;
        let errormessage = "error : ";
        console.log("Sending text to slack");
        const web = new web_api_1.WebClient(slackToken);
        yield web.chat
            .postMessage({ channel: conversationId, text: "Frustration detected!" })
            .then(() => console.log("Slack notification sent."))
            .catch((e) => {
            console.error("Error sending Slack message:", e.toString());
            errormessage += e.toString();
        });
    });
}
exports.slack_text = slack_text;
function slack_pdf(event, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackToken = event.input_data.global_values.slack_token;
        const conversationId = event.input_data.global_values.conversation_id;
        let errormessage = "error : ";
        console.log("Sending pdf to slack");
        const web = new web_api_1.WebClient(slackToken);
        try {
            yield web.files.uploadV2({
                channel_id: String(conversationId),
                file: fs_1.default.createReadStream(filePath),
                initial_comment: "Here's the sentiment analysis report.",
                filename: `Sentiment_Report_${Date.now()}.pdf`,
            });
            console.log("PDF report sent to Slack successfully!");
        }
        catch (error) {
            console.error("Error sending PDF to Slack:", error);
        }
    });
}
exports.slack_pdf = slack_pdf;

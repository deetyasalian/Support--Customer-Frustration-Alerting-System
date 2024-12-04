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
const slack_notif_1 = require("./slack_notif");
const email_notif_1 = require("./email_notif");
const fs_1 = __importDefault(require("fs"));
function handleSentimentEvent(event, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageInput = event.input_data.global_values.notification_medium;
        // Conditional Notification Logic
        try {
            if (messageInput === "Slack") {
                console.log("Slack notification selected.");
                yield (0, slack_notif_1.slack_text)(event);
                yield (0, slack_notif_1.slack_pdf)(event, filePath);
            }
            else if (messageInput === "Email") {
                console.log("Email notification selected.");
                yield (0, email_notif_1.email)(event, filePath);
            }
            else {
                console.log("Both Slack and email notifications selected.");
                yield (0, slack_notif_1.slack_text)(event);
                yield (0, slack_notif_1.slack_pdf)(event, filePath);
                console.log("sending mail");
                yield (0, email_notif_1.email)(event, filePath);
            }
        }
        catch (error) {
            console.error("Error in notification logic:", error);
            //@ts-ignore
            errormessage += error.toString();
        }
        finally {
            // Clean up the generated PDF file after sending
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting PDF file:", err);
                }
                else {
                    console.log(`Temporary PDF file ${filePath} deleted.`);
                }
            });
        }
    });
}
exports.default = handleSentimentEvent;

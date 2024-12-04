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
exports.email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function email(event, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = event.input_data.global_values.your_email;
        const emailPassword = event.input_data.global_values.your_password;
        console.log("email : ", email);
        console.log("password : ", emailPassword);
        let errormessage = "error : ";
        console.log("before createTransport");
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: emailPassword,
            },
        });
        console.log("after createTransport");
        yield transporter
            .sendMail({
            to: email,
            from: email,
            subject: "devrev mail",
            text: "Frustration Detected ",
            attachments: [
                {
                    filename: "Frustration_Report.pdf",
                    path: filePath, // Path to the PDF file
                },
            ],
        })
            .then(() => {
            console.log("Email sent successfully.");
        })
            .catch((error) => {
            console.error("Error sending email:", error.toString());
            errormessage += error.toString();
        });
    });
}
exports.email = email;

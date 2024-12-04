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
exports.openai_api = void 0;
const openai_1 = __importDefault(require("openai")); // Importing OpenAIApi directly
function openai_api(event) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize OpenAI API client
        let OPENAI_API_KEY;
        //if (process.env.open_ai_key != undefined) {
        OPENAI_API_KEY = event.input_data.keyrings.open_ai; // Replace with your actual API key
        //}
        // Initialize the OpenAI API client using the API key
        const openai = new openai_1.default({
            apiKey: OPENAI_API_KEY,
        });
        return openai;
    });
}
exports.openai_api = openai_api;

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
exports.run = void 0;
const gpt_1 = require("./gpt");
const queries_1 = require("./queries");
const slack_1 = __importDefault(require("./slack"));
function handleEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const devrevPAT = event.context.secrets.service_account_token;
        const API_BASE = event.execution_metadata.devrev_endpoint;
        const id = event.payload.conversation_updated.conversation.id;
        try {
            // API URL for timelineEntriesList
            const timelineEntriesUrl = `${API_BASE}/timeline-entries.list?object=${id}`;
            console.log("Calling timelineEntriesURL : ", timelineEntriesUrl);
            // HTTP request to fetch timeline entries
            const response = yield fetch(timelineEntriesUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${devrevPAT}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error fetching timeline entries. Status: ${response.status}, Message: ${response.statusText}`);
            }
            const data = yield response.json();
            let entries = data.timeline_entries;
            console.log("Enteries : ", entries);
            const threshold = parseFloat(event.input_data.global_values.threshold); // Ensure threshold is a number
            let text;
            // Process each entry with body_type === "text"
            for (let entry of entries) {
                if (entry.body_type === "text") {
                    text = entry.body;
                    const text_id = entry.id;
                    console.log("Processing text:", text);
                    console.log("Text id : ", text_id);
                    // Analyze sentiment
                    const { score, emotion } = yield (0, gpt_1.analyzeSentiment)(text);
                    console.log(`Score: ${score}`);
                    console.log(`Emotion: ${emotion}`);
                    // Handle sentiment event if score is below threshold
                    if (score <= threshold) {
                        console.log(`Triggering custom event as the sentiment score (${score}) is below the threshold (${threshold}).`);
                        yield (0, slack_1.default)(event);
                        yield (0, queries_1.insertSentimentData)(text_id, id, text, score, emotion);
                        yield (0, queries_1.getData)();
                    }
                    else {
                        console.log(`No action required. Sentiment score (${score}) meets the threshold (${threshold}).`);
                        // Insert sentiment data into the database
                        yield (0, queries_1.insertSentimentData)(text_id, id, text, score, emotion);
                    }
                }
            }
        }
        catch (error) {
            console.error("Error in timelineEntriesList API call:", error);
            throw error; // Re-throw to exit gracefully
        }
    });
}
const run = (events) => __awaiter(void 0, void 0, void 0, function* () {
    console.info("events", JSON.stringify(events));
    for (let event of events) {
        yield handleEvent(event); // Ensure the function is awaited
    }
});
exports.run = run;
exports.default = exports.run;

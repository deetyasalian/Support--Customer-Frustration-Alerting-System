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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notif_sent = exports.isConversationProcessed = exports.getData = exports.insertSentimentData = void 0;
const pool_1 = require("../api/pool");
const analyzer_1 = require("../handlers/analyzing/analyzer");
const to_generate_pdf_1 = require("../handlers/pdfGeneration/to_generate_pdf");
function insertSentimentData(text_id, id, text, score, emotion, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, pool_1.aiven)(event);
        const query = `
        INSERT INTO sentimental_info (text_id, id, text, score, emotion)
        VALUES ($1, $2, $3, $4 ,$5)
        RETURNING *;
      `;
        try {
            const result = yield pool.query(query, [text_id, id, text, score, emotion]);
            console.log("Data inserted successfully:", result.rows[0]);
        }
        catch (error) {
            console.error("Error inserting data:", error);
        }
    });
}
exports.insertSentimentData = insertSentimentData;
function getData(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, pool_1.aiven)(event);
        let filePath;
        try {
            console.log("Running scheduled job for sentiment analysis...");
            // Check the count of records
            const countQuery = `SELECT COUNT(*) FROM sentimental_info;`;
            const { rows: countRows } = yield pool.query(countQuery);
            const count = parseInt(countRows[0].count, 10);
            console.log(`Total records in sentimental_info: ${count}`);
            if (count > 0) {
                // Fetch the data for analysis
                const dataQuery = `SELECT * FROM sentimental_info ORDER BY created_at DESC LIMIT 50;`;
                const { rows: data } = yield pool.query(dataQuery);
                console.log("Data : ", data);
                // Perform the analysis
                const analysis = yield (0, analyzer_1.analyzeData)(data, event);
                console.log("Analysis : ", analysis);
                filePath = (0, to_generate_pdf_1.after_analysis)(analysis, data);
            }
            else {
                console.log("No records available for analysis.");
            }
        }
        catch (error) {
            console.error("Error during scheduled job:", error);
        }
        return filePath;
    });
}
exports.getData = getData;
// Check if the conversation ID is already processed
function isConversationProcessed(id, event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, pool_1.aiven)(event);
        // Execute the query to check the count of rows
        const result = yield pool.query("SELECT COUNT(*) AS count FROM sentimental_info WHERE id = $1 AND notif_sent = TRUE;", [id]);
        // Extract the count from the query result
        const count = ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        console.log("Count of notif_sent true : ", count);
        // Return true if the count is greater than 0
        return parseInt(count, 10) == 0;
    });
}
exports.isConversationProcessed = isConversationProcessed;
function notif_sent(text_id, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, pool_1.aiven)(event);
        const sent = yield pool.query("UPDATE sentimental_info SET notif_sent = true WHERE text_id = $1", [text_id]);
    });
}
exports.notif_sent = notif_sent;

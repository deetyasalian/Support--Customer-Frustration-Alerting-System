"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getData = exports.insertSentimentData = void 0;
const pg_1 = require("pg");
const gpt_1 = require("./gpt");
const pdfGenerator_1 = require("./pdfGenerator");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const config = process.env.aiven_url;
const pool = new pg_1.Pool({
    connectionString: config,
    ssl: {
        rejectUnauthorized: false,
    },
});
function insertSentimentData(text_id, id, text, score, emotion) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `INSERT INTO sentimental_info (text_id, id, text, score, emotion)
      VALUES ($1, $2, $3, $4 ,$5)
      RETURNING *;`;
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
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Running scheduled job for sentiment analysis...");
            // Check the count of records
            const countQuery = `SELECT COUNT(*) FROM sentimental_info;`;
            const { rows: countRows } = yield pool.query(countQuery);
            const count = parseInt(countRows[0].count, 10);
            console.log("Total records in sentimental_info: ${count}");
            if (count > 0) {
                // Fetch the data for analysis
                const dataQuery = `SELECT * FROM sentimental_info ORDER BY created_at DESC LIMIT 50;`;
                const { rows: data } = yield pool.query(dataQuery);
                console.log("Data : ", data);
                // Perform the analysis
                const analysis = yield (0, gpt_1.analyzeData)(data);
                console.log("Analysis : ", analysis);
                // Generate the PDF report if analysis is successful
                if (analysis) {
                    console.log("Analysis successful. Generating PDF...");
                    yield (0, pdfGenerator_1.generatePDFReport)(analysis, data);
                    console.log("PDF generated successfully.");
                }
                else {
                    console.log("Analysis returned no result.");
                }
            }
            else {
                console.log("No records available for analysis.");
            }
        }
        catch (error) {
            console.error("Error during scheduled job:", error);
        }
    });
}
exports.getData = getData;

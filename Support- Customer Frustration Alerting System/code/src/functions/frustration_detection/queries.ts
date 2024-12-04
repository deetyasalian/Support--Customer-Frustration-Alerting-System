import { Pool } from "pg";
import { analyzeData } from "./gpt";
import { generatePDFReport } from "./pdfGenerator";

import * as dotenv from 'dotenv';
dotenv.config();


const config =process.env.aiven_url;

const pool = new Pool({
  connectionString: config,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function insertSentimentData(
  text_id: string,
  id: string,
  text: string,
  score: number,
  emotion: string
): Promise<void> {
  const query = 
      `INSERT INTO sentimental_info (text_id, id, text, score, emotion)
      VALUES ($1, $2, $3, $4 ,$5)
      RETURNING *;`
    ;

  try {
    const result = await pool.query(query, [text_id, id, text, score, emotion]);
    console.log("Data inserted successfully:", result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

export async function getData() {
  try {
    console.log("Running scheduled job for sentiment analysis...");

    // Check the count of records
    const countQuery = `SELECT COUNT(*) FROM sentimental_info;`;
    const { rows: countRows } = await pool.query(countQuery);
    const count = parseInt(countRows[0].count, 10);
    console.log("Total records in sentimental_info: ${count}");

    if (count > 0) {
      // Fetch the data for analysis
      const dataQuery = `SELECT * FROM sentimental_info ORDER BY created_at DESC LIMIT 50;`;
      const { rows: data } = await pool.query(dataQuery);

      console.log("Data : ", data);

      // Perform the analysis
      const analysis = await analyzeData(data);
      console.log("Analysis : ", analysis);

      // Generate the PDF report if analysis is successful
      if (analysis) {
        console.log("Analysis successful. Generating PDF...");
        await generatePDFReport(analysis, data);
        console.log("PDF generated successfully.");
      } else {
        console.log("Analysis returned no result.");
      }
    } else {
      console.log("No records available for analysis.");
    }
  } catch (error) {
    console.error("Error during scheduled job:", error);
  }
}
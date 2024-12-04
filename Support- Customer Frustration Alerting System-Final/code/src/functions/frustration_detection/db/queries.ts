import { aiven } from "../api/pool";
import { analyzeData } from "../handlers/analyzing/analyzer";
import { after_analysis } from "../handlers/pdfGeneration/to_generate_pdf";

export async function insertSentimentData(
  text_id: string,
  id: string,
  text: string,
  score: number,
  emotion: string,
  event: any
): Promise<void> {
  const pool = await aiven(event);
  //Insert values in database
  const query = `
        INSERT INTO sentimental_info (text_id, id, text, score, emotion)
        VALUES ($1, $2, $3, $4 ,$5)
        RETURNING *;
      `;

  try {
    const result = await pool.query(query, [text_id, id, text, score, emotion]);
    console.log("Data inserted successfully:", result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

export async function getData(event: any) {
  const pool = await aiven(event);
  let filePath;
  try {
    console.log("Running scheduled job for sentiment analysis...");

    // Check the count of records
    const countQuery = `SELECT COUNT(*) FROM sentimental_info;`;
    const { rows: countRows } = await pool.query(countQuery);
    const count = parseInt(countRows[0].count, 10);
    console.log(`Total records in sentimental_info: ${count}`);

    if (count > 0) {
      // Fetch the data for analysis
      const dataQuery = `SELECT * FROM sentimental_info ORDER BY created_at DESC LIMIT 50;`;
      const { rows: data } = await pool.query(dataQuery);

      console.log("Data : ", data);

      // Perform the analysis
      const analysis = await analyzeData(data, event);
      console.log("Analysis : ", analysis);

      filePath = after_analysis(analysis, data);
    } else {
      console.log("No records available for analysis.");
    }
  } catch (error) {
    console.error("Error during scheduled job:", error);
  }
  return filePath;
}

// Check if the conversation ID is already processed
export async function isConversationProcessed(
  id: string,
  event: any
): Promise<boolean> {
  const pool = await aiven(event);
  // Execute the query to check the count of rows
  const result = await pool.query(
    "SELECT COUNT(*) AS count FROM sentimental_info WHERE id = $1 AND notif_sent = TRUE;",
    [id]
  );
  // Extract the count from the query result
  const count = result.rows[0]?.count || 0;

  console.log("Count of notif_sent true : ", count);

  // Return true if the count is equal to 0
  return parseInt(count, 10) == 0;
}

export async function notif_sent(text_id: string, event: any) {
  const pool = await aiven(event);
  //update the notif_sent to true
  const sent = await pool.query(
    "UPDATE sentimental_info SET notif_sent = true WHERE text_id = $1",
    [text_id]
  );
}

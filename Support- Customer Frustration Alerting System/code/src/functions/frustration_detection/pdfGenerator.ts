import { WebClient } from "@slack/web-api";
import fs from "fs";
import PDFDocument from "pdfkit";

export async function generatePDFReport(
  analysis: string,
  data: { id: string; text: string; score: number; emotion: string }[]
) {
  const doc = new PDFDocument();
  const tmpDir = "/tmp";
  const filePath = `${tmpDir}/report-${Date.now()}.pdf`;

  // Check if the /tmp directory exists and is writable
  if (!fs.existsSync(tmpDir)) {
    console.error(`Directory '${tmpDir}' does not exist.`);
    throw new Error("Temporary directory does not exist.");
  }

  try {
    fs.accessSync(tmpDir, fs.constants.W_OK); // Check if writable
    console.log(`Directory '${tmpDir}' is writable.`);
  } catch (err) {
    console.error(`Directory '${tmpDir}' is not writable:`, err);
    throw new Error("Temporary directory is not writable.");
  }

  // Generate the PDF
  doc
    .fontSize(18)
    .text("Sentiment Analysis Report", { align: "center" })
    .moveDown(1);

  doc.fontSize(12).text("Summary of Analysis:").moveDown(0.5);
  doc.text(analysis, { align: "left" }).moveDown(1);

  doc.fontSize(12).text("Conversation Details:").moveDown(0.5);
  data.forEach((entry, index) => {
    doc.text(
      `#${index + 1} - ID: ${entry.id}, Text: ${entry.text}, Score: ${
        entry.score
      }, Emotion: ${entry.emotion}`
    );
  });

  await new Promise<void>((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    stream.on("error", (error) => {
      console.error("Error creating write stream:", error);
      reject(error);
    });
    stream.on("close", resolve);

    doc.pipe(stream);
    doc.end();
  });

  // Send the PDF to Slack
  const web = new WebClient(
    "add-your-token"
  );
  const conversationId = "add-convo-id";

  try {
    await web.files.uploadV2({
      channels: conversationId,
      file: fs.createReadStream(filePath),
      initial_comment: "Here's the sentiment analysis report.",
      filename: `Sentiment_Report_${Date.now()}.pdf`,
    });
    console.log("PDF report sent to Slack successfully!");
  } catch (error) {
    console.error("Error sending PDF to Slack:", error);
  } finally {
    // Clean up the generated PDF file after sending
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting PDF file:", err);
      } else {
        console.log(`Temporary PDF file ${filePath} deleted.`);
      }
    });
  }
}

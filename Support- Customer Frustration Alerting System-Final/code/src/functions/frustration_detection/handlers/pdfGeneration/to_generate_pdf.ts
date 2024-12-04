import { generatePDFReport } from "./pdfGenerator";

// Generate the PDF report if analysis is successful

export async function after_analysis(analysis: any, data: any) {
  let filePath;
  if (analysis) {
    console.log("Analysis successful. Generating PDF...");
    filePath = await generatePDFReport(analysis, data);
    console.log("PDF generated successfully.");
  } else {
    console.log("Analysis returned no result.");
  }
  return filePath;
}

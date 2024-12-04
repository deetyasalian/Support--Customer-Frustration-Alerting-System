import {
  getData,
  insertSentimentData,
  isConversationProcessed,
  notif_sent,
} from "./db/queries";
import { analyzeSentiment } from "./handlers/analyzing/analyzer";
import handleSentimentEvent from "./handlers/notification/notification";

async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const API_BASE = event.execution_metadata.devrev_endpoint;

  const id = event.payload.conversation_updated.conversation.id;

  try {
    // API URL for timelineEntriesList
    const timelineEntriesUrl = `${API_BASE}/timeline-entries.list?object=${id}`;

    console.log("Calling timelineEntriesURL : ", timelineEntriesUrl);

    // HTTP request to fetch timeline entries
    const response = await fetch(timelineEntriesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${devrevPAT}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching timeline entries. Status: ${response.status}, Message: ${response.statusText}`
      );
    }

    const data = await response.json();
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
        const { score, emotion } = await analyzeSentiment(text, event);

        console.log(`Score: ${score}`);
        console.log(`Emotion: ${emotion}`);

        // Handle sentiment event if score is below threshold
        if (score < threshold) {
          //check if notification is already sent to that particular chat
          const isProcessed = await isConversationProcessed(id, event);
          if (isProcessed) {
            const filePath = await getData(event);
            console.log(
              `Triggering custom event as the sentiment score (${score}) is below the threshold (${threshold}).`
            );
            // Insert sentiment data into the database
            await insertSentimentData(text_id, id, text, score, emotion, event);
            //show that notification is sent
            await notif_sent(text_id, event);
            //sending notification
            await handleSentimentEvent(event, filePath);
          } else {
            await insertSentimentData(text_id, id, text, score, emotion, event);
          }
        } else {
          console.log(
            `No action required. Sentiment score (${score}) meets the threshold (${threshold}).`
          );

          await insertSentimentData(text_id, id, text, score, emotion, event);
        }
      }
    }
  } catch (error) {
    console.error("Error in timelineEntriesList API call:", error);
    throw error;
  }
}

export const run = async (events: any[]) => {
  console.info("events", JSON.stringify(events));
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;

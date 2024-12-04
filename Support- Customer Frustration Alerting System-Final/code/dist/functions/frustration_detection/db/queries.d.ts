export declare function insertSentimentData(text_id: string, id: string, text: string, score: number, emotion: string, event: any): Promise<void>;
export declare function getData(event: any): Promise<string | undefined>;
export declare function isConversationProcessed(id: string, event: any): Promise<boolean>;
export declare function notif_sent(text_id: string, event: any): Promise<void>;

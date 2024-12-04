export declare function generatePDFReport(analysis: string, data: {
    id: string;
    text: string;
    score: number;
    emotion: string;
}[]): Promise<void>;

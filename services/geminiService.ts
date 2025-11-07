
import { GoogleGenAI } from "@google/genai";
import type { QALog } from '../types';

// Per coding guidelines, the API key is assumed to be available in process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQASummary = async (logs: QALog[], employee: string): Promise<string> => {
  const logsSummary = logs.map(log => 
    `On ${log.date}, ${log.employeeName} audited ${log.callsAudited} calls, finding ${log.violationsCaught} violations. They conducted ${log.sessionsConducted} coaching sessions and issued ${log.warningLettersIssued} warning letters.`
  ).join('\n');

  const prompt = `
    You are a QA Manager analyzing performance data for a telemarketing call center.
    The following data represents QA logs for ${employee === 'All' ? 'all employees' : employee}.
    
    Data:
    ${logsSummary.substring(0, 15000)}

    Based on this data, provide a concise performance summary. Your summary should be in markdown format and include:
    1.  An overall assessment of performance.
    2.  Identify any positive trends (e.g., high number of calls audited, low violations).
    3.  Identify any potential areas for concern (e.g., high violation rates, spikes in warnings).
    4.  Keep the summary to 3-4 short paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating QA summary:", error);
    return "There was an error generating the AI summary. Please check the console for details.";
  }
};

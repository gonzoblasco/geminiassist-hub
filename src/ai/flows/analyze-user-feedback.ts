'use server';

/**
 * @fileOverview An AI agent for analyzing user feedback and categorizing it by sentiment and topic.
 *
 * - analyzeUserFeedback - A function that handles the user feedback analysis process.
 * - AnalyzeUserFeedbackInput - The input type for the analyzeUserFeedback function.
 * - AnalyzeUserFeedbackOutput - The return type for the analyzeUserFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserFeedbackInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text of the user feedback to be analyzed.'),
});
export type AnalyzeUserFeedbackInput = z.infer<typeof AnalyzeUserFeedbackInputSchema>;

const AnalyzeUserFeedbackOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the feedback (e.g., positive, negative, neutral).' + 
      'Specify one of the following values: positive, negative, neutral'
    ),
  topic: z
    .string()
    .describe('The main topic of the feedback (e.g., pricing, features, usability).'),
  summary: z
    .string()
    .describe('A brief summary of the feedback.'),
});
export type AnalyzeUserFeedbackOutput = z.infer<typeof AnalyzeUserFeedbackOutputSchema>;

export async function analyzeUserFeedback(input: AnalyzeUserFeedbackInput): Promise<AnalyzeUserFeedbackOutput> {
  return analyzeUserFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserFeedbackPrompt',
  input: {schema: AnalyzeUserFeedbackInputSchema},
  output: {schema: AnalyzeUserFeedbackOutputSchema},
  prompt: `You are an AI assistant helping to analyze user feedback.

  Analyze the following feedback and determine its sentiment (positive, negative, or neutral), main topic, and provide a brief summary.

  Feedback: {{{feedbackText}}}
  
  Ensure that sentiment is one of the following values: positive, negative, neutral.`, // Enforce sentiment values
});

const analyzeUserFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeUserFeedbackFlow',
    inputSchema: AnalyzeUserFeedbackInputSchema,
    outputSchema: AnalyzeUserFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

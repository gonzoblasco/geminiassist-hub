// src/ai/flows/onboarding-agent-assistance.ts
'use server';

/**
 * @fileOverview An AI agent for providing conversational onboarding assistance to new users.
 *
 * - onboardingAgentAssistance - A function that initiates the onboarding process.
 * - OnboardingAgentAssistanceInput - The input type for the onboardingAgentAssistance function.
 * - OnboardingAgentAssistanceOutput - The return type for the onboardingAgentAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingAgentAssistanceInputSchema = z.object({
  userGoal: z
    .string()
    .describe("The user's primary goal for using the platform."),
  experienceLevel: z
    .string()
    .describe('The user’s level of experience with AI tools.'),
});
export type OnboardingAgentAssistanceInput = z.infer<
  typeof OnboardingAgentAssistanceInputSchema
>;

const OnboardingAgentAssistanceOutputSchema = z.object({
  onboardingMessage: z
    .string()
    .describe('A personalized onboarding message for the user.'),
  suggestedActions: z
    .array(z.string())
    .describe('A list of suggested actions for the user to take.'),
});

export type OnboardingAgentAssistanceOutput = z.infer<
  typeof OnboardingAgentAssistanceOutputSchema
>;

export async function onboardingAgentAssistance(
  input: OnboardingAgentAssistanceInput
): Promise<OnboardingAgentAssistanceOutput> {
  return onboardingAgentAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'onboardingAgentAssistancePrompt',
  input: {schema: OnboardingAgentAssistanceInputSchema},
  output: {schema: OnboardingAgentAssistanceOutputSchema},
  prompt: `You are an AI assistant designed to onboard new users to the GeminiAssist Hub platform.

  Based on the user's stated goal and experience level, provide a personalized onboarding message and suggest a few key actions they can take to get started.

  User Goal: {{{userGoal}}}
  Experience Level: {{{experienceLevel}}}

  Onboarding Message:
  `, // TODO:  refine this prompt.
});

const onboardingAgentAssistanceFlow = ai.defineFlow(
  {
    name: 'onboardingAgentAssistanceFlow',
    inputSchema: OnboardingAgentAssistanceInputSchema,
    outputSchema: OnboardingAgentAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

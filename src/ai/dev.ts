import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-user-feedback.ts';
import '@/ai/flows/moderate-agent-responses.ts';
import '@/ai/flows/onboarding-agent-assistance.ts';
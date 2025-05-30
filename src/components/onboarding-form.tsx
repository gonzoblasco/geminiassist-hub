"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { onboardingAgentAssistance, type OnboardingAgentAssistanceInput, type OnboardingAgentAssistanceOutput } from '@/ai/flows/onboarding-agent-assistance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';
// import { doc, updateDoc } from 'firebase/firestore'; // Actual Firebase
// import { db, auth } from '@/lib/firebase'; // Actual Firebase
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  userGoal: z.string().min(10, { message: 'Please describe your primary goal in a bit more detail (at least 10 characters).' }).max(500),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert'], {
    required_error: 'Please select your experience level with AI tools.',
  }),
});

type OnboardingFormData = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const { toast } = useToast();
  const { user, firebaseUser } = useAuth(); // Conceptual
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [assistanceResponse, setAssistanceResponse] = useState<OnboardingAgentAssistanceOutput | null>(null);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userGoal: '',
      experienceLevel: undefined,
    },
  });

  const onSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
    setIsLoading(true);
    setAssistanceResponse(null);
    try {
      const input: OnboardingAgentAssistanceInput = {
        userGoal: data.userGoal,
        experienceLevel: data.experienceLevel,
      };
      const response = await onboardingAgentAssistance(input);
      setAssistanceResponse(response);

      // Update user profile in Firestore (conceptual)
      const currentUserId = user?.uid || firebaseUser?.uid;
      if (currentUserId) {
        // const userDocRef = doc(db, 'users', currentUserId); // Actual Firebase
        // await updateDoc(userDocRef, { // Actual Firebase
        //   userGoal: data.userGoal,
        //   experienceLevel: data.experienceLevel,
        //   onboardingCompleted: true,
        //   updatedAt: new Date(),
        // });
        console.log("Placeholder: User profile updated in Firestore", { onboardingCompleted: true, ...data });
      }
      
      toast({
        title: 'Onboarding information saved!',
        description: "We're tailoring your experience.",
      });

    } catch (error) {
      console.error('Error getting onboarding assistance:', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem processing your information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (assistanceResponse) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Personalized Just For You!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{assistanceResponse.onboardingMessage}</p>
          {assistanceResponse.suggestedActions && assistanceResponse.suggestedActions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Here are some things you can do next:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {assistanceResponse.suggestedActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={() => router.push('/agents')} className="w-full mt-4">
            Explore AI Agents
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">What&apos;s your primary goal for using GeminiAssist Hub?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Automate customer support, generate marketing content, manage finances..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps us recommend the best agents for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">How experienced are you with AI tools?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (New to AI tools)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (Used some AI tools before)</SelectItem>
                  <SelectItem value="expert">Expert (Very familiar with AI capabilities)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This allows us to tailor suggestions and help documentation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Personalizing...
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </form>
    </Form>
  );
}

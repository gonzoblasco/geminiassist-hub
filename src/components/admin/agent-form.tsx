"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Agent, AgentFormData } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
// import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; // Actual Firebase
// import { db } from '@/lib/firebase'; // Actual Firebase
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const agentFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(500),
  category: z.string().min(1, { message: 'Category is required.' }),
  interfaceType: z.enum(['chat', 'form'], { required_error: 'Interface type is required.' }),
  promptBase: z.string().min(20, { message: 'Base prompt must be at least 20 characters.' }),
  icon: z.string().optional(),
  tags: z.string().optional(), // Comma-separated string
  status: z.enum(['published', 'draft', 'archived'], { required_error: 'Status is required.'}),
  freeTrialOffered: z.boolean().default(false),
  trialDurationDays: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
    message: "Trial duration must be a number.",
  }),
});

interface AgentFormProps {
  agent?: Agent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const agentCategories = ['Accounting', 'Marketing', 'Sales', 'Customer Support', 'Productivity', 'Development', 'HR', 'Legal', 'Other'];
const agentStatuses = [
    { value: 'published', label: 'Published (Visible to users)' },
    { value: 'draft', label: 'Draft (Hidden from users)' },
    { value: 'archived', label: 'Archived (No longer active)' },
];


export function AgentForm({ agent, onSuccess, onCancel }: AgentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = agent ? {
    ...agent,
    tags: agent.tags?.join(', ') || '',
    trialDurationDays: agent.trialDurationDays?.toString() || '',
  } : {
    name: '',
    description: '',
    category: '',
    interfaceType: 'chat' as 'chat' | 'form',
    promptBase: '',
    icon: '',
    tags: '',
    status: 'draft' as 'published' | 'draft' | 'archived',
    freeTrialOffered: false,
    trialDurationDays: '7',
  };

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<AgentFormData> = async (data) => {
    setIsLoading(true);
    try {
      const agentDataPayload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        trialDurationDays: data.trialDurationDays ? parseInt(data.trialDurationDays, 10) : undefined,
        // updatedAt: serverTimestamp(), // Actual Firebase
        updatedAt: new Date(), // Placeholder
      };

      if (agent && agent.id) {
        // Update existing agent
        // await updateDoc(doc(db, 'agents', agent.id), agentDataPayload); // Actual Firebase
        console.log("Placeholder: Updated agent", { id: agent.id, ...agentDataPayload });
        toast({ title: 'Agent Updated', description: `Agent "${data.name}" has been successfully updated.` });
      } else {
        // Create new agent
        // await addDoc(collection(db, 'agents'), { // Actual Firebase
        //   ...agentDataPayload,
        //   createdAt: serverTimestamp(), // Actual Firebase
        // });
        console.log("Placeholder: Created new agent", { ...agentDataPayload, createdAt: new Date() });
        toast({ title: 'Agent Created', description: `New agent "${data.name}" has been successfully created.` });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Error Saving Agent',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl><Input placeholder="e.g., Content Creator Pro" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                    {agentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Briefly describe what this agent does..." {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="promptBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Prompt (for Genkit)</FormLabel>
              <FormControl><Textarea placeholder="Enter the core instruction or persona for the AI agent..." {...field} rows={6} className="font-code" /></FormControl>
              <FormDescription>This is the foundational prompt the AI will use.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="interfaceType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Interface Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select interface type" /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="chat">Chat Interface</SelectItem>
                    <SelectItem value="form">Form-based Interface</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select agent status" /></SelectTrigger></FormControl>
                    <SelectContent>
                    {agentStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Icon (Lucide Name)</FormLabel>
                <FormControl><Input placeholder="e.g., Bot, Briefcase, Zap" {...field} /></FormControl>
                <FormDescription>Optional. Use names from lucide-react library.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl><Input placeholder="e.g., finance, writing, automation" {...field} /></FormControl>
                <FormDescription>Comma-separated list of tags.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="freeTrialOffered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Offer Free Trial?</FormLabel>
                <FormDescription>
                  Allow users to try this agent for free for a limited time.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("freeTrialOffered") && (
             <FormField
                control={form.control}
                name="trialDurationDays"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Trial Duration (Days)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 7" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}


        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {agent ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

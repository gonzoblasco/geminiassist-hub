"use client";

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, FileText, Settings2, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Agent } from '@/types'; // Assuming Agent type is defined

// Mock agent data (replace with actual data fetching)
const mockAgentData: { [key: string]: Agent } = {
  '1': {
    id: '1', name: 'Accounting Ace', description: 'Automates bookkeeping, expense tracking, and financial reporting.', category: 'Accounting', interfaceType: 'form', promptBase: 'You are an accounting assistant...', icon: 'Calculator', status: 'published', freeTrialOffered: true, createdAt: new Date(), updatedAt: new Date()
  },
  '2': {
    id: '2', name: 'Marketing Maven', description: 'Generates social media posts, email campaigns, and ad copy.', category: 'Marketing', interfaceType: 'chat', promptBase: 'You are a marketing content generator...', icon: 'Megaphone', status: 'published', freeTrialOffered: true, createdAt: new Date(), updatedAt: new Date()
  },
};


export default function AgentInteractionPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      setIsLoading(true);
      // Simulate fetching agent data
      // In a real app, fetch from Firestore or your backend
      setTimeout(() => {
        const fetchedAgent = mockAgentData[agentId] || null;
        setAgent(fetchedAgent);
        setIsLoading(false);
      }, 500);
    }
  }, [agentId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading agent details...</p></div>;
  }

  if (!agent) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="text-muted-foreground">The agent you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/agents">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agent Catalog
          </Link>
        </Button>
      </div>
    );
  }

  const IconComponent = agent.icon ? require('lucide-react')[agent.icon] || PlayCircle : PlayCircle;

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/agents">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
        </Link>
      </Button>

      <header className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-card">
        <IconComponent className="h-16 w-16 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{agent.name}</h1>
          <p className="text-muted-foreground">{agent.description}</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {agent.interfaceType === 'chat' ? <MessageCircle className="h-6 w-6 text-primary"/> : <FileText className="h-6 w-6 text-primary"/>}
            Interact with {agent.name}
          </CardTitle>
          <CardDescription>
            Use the {agent.interfaceType === 'chat' ? 'chat window below' : 'form below'} to interact with the agent.
            {agent.freeTrialOffered && " You're currently on a free trial."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for Chat or Form Interface */}
          <div className="min-h-[300px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/20">
            <div className="text-center text-muted-foreground">
              <Settings2 className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">{agent.interfaceType === 'chat' ? 'Chat Interface' : 'Form Interface'} Coming Soon</p>
              <p className="text-sm">This is where you will interact with the agent.</p>
            </div>
          </div>
          
          {!agent.freeTrialOffered && (
            <Button className="w-full mt-6">Subscribe to use this agent</Button>
          )}
           {agent.freeTrialOffered && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Enjoy your trial! Full features available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

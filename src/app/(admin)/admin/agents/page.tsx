"use client";

import { useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AgentForm } from '@/components/admin/agent-form';
import { AgentsTable } from '@/components/admin/agents-table';
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore'; // Actual Firebase
// import { db } from '@/lib/firebase'; // Actual Firebase
import { useToast } from '@/hooks/use-toast';

// Mock data for agents
const mockAdminAgents: Agent[] = [
  { id: '1', name: 'Accounting Ace', description: 'Automates bookkeeping.', category: 'Accounting', interfaceType: 'form', promptBase: 'You are an accountant...', icon: 'Calculator', status: 'published', freeTrialOffered: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Marketing Maven', description: 'Generates social media posts.', category: 'Marketing', interfaceType: 'chat', promptBase: 'You are a marketer...', icon: 'Megaphone', status: 'draft', freeTrialOffered: false, createdAt: new Date(), updatedAt: new Date() },
];


export default function AdminAgentsPage() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      // const agentsCollectionRef = collection(db, 'agents'); // Actual Firebase
      // const q = query(agentsCollectionRef, orderBy('createdAt', 'desc')); // Actual Firebase
      // const querySnapshot = await getDocs(q); // Actual Firebase
      // const fetchedAgents = querySnapshot.docs.map(doc => { // Actual Firebase
      //   const data = doc.data();
      //   return {
      //     id: doc.id,
      //     ...data,
      //     createdAt: (data.createdAt as Timestamp).toDate(),
      //     updatedAt: (data.updatedAt as Timestamp).toDate(),
      //   } as Agent;
      // });
      // setAgents(fetchedAgents); // Actual Firebase

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setAgents(mockAdminAgents);

    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({ title: "Error", description: "Failed to fetch agents.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleFormSubmitSuccess = () => {
    fetchAgents();
    setIsDialogOpen(false);
    setEditingAgent(null);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setIsDialogOpen(true);
  };

  const handleDelete = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      return;
    }
    try {
      // await deleteDoc(doc(db, 'agents', agentId)); // Actual Firebase
      console.log(`Placeholder: Deleted agent with ID ${agentId}`);
      toast({ title: "Success", description: "Agent deleted successfully." });
      fetchAgents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({ title: "Error", description: "Failed to delete agent.", variant: "destructive" });
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Agent Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingAgent(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAgent(null); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingAgent ? 'Edit Agent' : 'Create New Agent'}</DialogTitle>
              <DialogDescription>
                {editingAgent ? 'Update the details for this AI agent.' : 'Fill in the details to create a new AI agent.'}
              </DialogDescription>
            </DialogHeader>
            <AgentForm
              agent={editingAgent}
              onSuccess={handleFormSubmitSuccess}
              onCancel={() => { setIsDialogOpen(false); setEditingAgent(null);}}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading agents...</p>
        </div>
      ) : (
        <AgentsTable agents={agents} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

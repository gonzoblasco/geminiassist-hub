
"use client";

import { useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Filter } from 'lucide-react';
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
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy, where } from 'firebase/firestore'; // Actual Firebase
// import { db } from '@/lib/firebase'; // Actual Firebase
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';


const mockAdminAgents: Agent[] = [
  { id: '1', name: 'Accounting Ace', description: 'Automates bookkeeping.', category: 'Accounting', interfaceType: 'form', promptBase: 'You are an accountant...', icon: 'Calculator', status: 'published', freeTrialOffered: true, trialDurationDays: 7, createdAt: new Date(2023, 10, 1), updatedAt: new Date(2023, 10, 5) },
  { id: '2', name: 'Marketing Maven', description: 'Generates social media posts.', category: 'Marketing', interfaceType: 'chat', promptBase: 'You are a marketer...', icon: 'Megaphone', status: 'draft', freeTrialOffered: false, createdAt: new Date(2023, 11, 15), updatedAt: new Date(2023, 11, 20) },
  { id: '3', name: 'Support Sphere', description: 'Provides instant answers.', category: 'Customer Support', interfaceType: 'chat', promptBase: 'You are a support agent...', icon: 'Headset', status: 'published', freeTrialOffered: true, trialDurationDays: 14, createdAt: new Date(2024, 0, 5), updatedAt: new Date(2024, 0, 10) },
  { id: '4', name: 'Sales Sidekick', description: 'Assists with lead scoring.', category: 'Sales', interfaceType: 'form', promptBase: 'You are a sales analyst...', icon: 'Briefcase', status: 'archived', freeTrialOffered: false, createdAt: new Date(2023, 9, 1), updatedAt: new Date(2023, 9, 5) },
];

const agentCategories = ['All', 'Accounting', 'Marketing', 'Sales', 'Customer Support', 'Productivity', 'Development', 'HR', 'Legal', 'Other'];
const agentStatuses = ['All', 'published', 'draft', 'archived'];

export default function AdminAgentsPage() {
  const { toast } = useToast();
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');


  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      // Conceptual Firebase fetching:
      // const agentsCollectionRef = collection(db, 'agents');
      // let q = query(agentsCollectionRef, orderBy('createdAt', 'desc'));
      // // Apply filters if not 'All'
      // if (selectedCategory !== 'All') q = query(q, where('category', '==', selectedCategory));
      // if (selectedStatus !== 'All') q = query(q, where('status', '==', selectedStatus));
      
      // const querySnapshot = await getDocs(q);
      // const fetchedAgents = querySnapshot.docs.map(doc => {
      //   const data = doc.data();
      //   return {
      //     id: doc.id,
      //     ...data,
      //     createdAt: (data.createdAt as Timestamp).toDate(),
      //     updatedAt: (data.updatedAt as Timestamp).toDate(),
      //   } as Agent;
      // });
      // setAllAgents(fetchedAgents);

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setAllAgents(mockAdminAgents);

    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({ title: "Error", description: "Failed to fetch agents.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAgents();
  }, []); // Initial fetch

  useEffect(() => {
    let tempAgents = allAgents;
    if (selectedCategory !== 'All') {
      tempAgents = tempAgents.filter(agent => agent.category === selectedCategory);
    }
    if (selectedStatus !== 'All') {
      tempAgents = tempAgents.filter(agent => agent.status === selectedStatus);
    }
    if (searchTerm) {
      tempAgents = tempAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAgents(tempAgents);
  }, [searchTerm, selectedCategory, selectedStatus, allAgents]);


  const handleFormSubmitSuccess = () => {
    fetchAgents(); // Refetch or update local state optimally
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
    setIsLoading(true); // Indicate loading for delete action
    try {
      // await deleteDoc(doc(db, 'agents', agentId)); // Actual Firebase
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      setAllAgents(prev => prev.filter(a => a.id !== agentId)); // Update local state
      toast({ title: "Success", description: "Agent deleted successfully." });
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({ title: "Error", description: "Failed to delete agent.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      <Card className="p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {agentCategories.map(category => (
                <SelectItem key={category} value={category}>{category === 'All' ? 'All Categories' : category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {agentStatuses.map(status => (
                <SelectItem key={status} value={status}>{status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>


      {isLoading && filteredAgents.length === 0 ? ( // Show loader only if no agents are displayed yet
        <div className="flex flex-col justify-center items-center py-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading agents...</p>
        </div>
      ) : (
        <AgentsTable agents={filteredAgents} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

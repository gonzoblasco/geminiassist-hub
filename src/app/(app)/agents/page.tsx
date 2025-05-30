"use client";

import { useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { AgentCard } from '@/components/agent-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'; // Actual Firebase
// import { db } from '@/lib/firebase'; // Actual Firebase

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Accounting Ace',
    description: 'Automates bookkeeping, expense tracking, and financial reporting.',
    category: 'Accounting',
    interfaceType: 'form',
    promptBase: 'You are an accounting assistant...',
    icon: 'Calculator',
    color: '#4CAF50', // Green
    tags: ['finance', 'bookkeeping', 'reporting'],
    status: 'published',
    freeTrialOffered: true,
    trialDurationDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    reviewCount: 120,
  },
  {
    id: '2',
    name: 'Marketing Maven',
    description: 'Generates social media posts, email campaigns, and ad copy.',
    category: 'Marketing',
    interfaceType: 'chat',
    promptBase: 'You are a marketing content generator...',
    icon: 'Megaphone',
    color: '#2196F3', // Blue
    tags: ['social media', 'email', 'content creation'],
    status: 'published',
    freeTrialOffered: true,
    trialDurationDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.8,
    reviewCount: 250,
  },
  {
    id: '3',
    name: 'Sales Sidekick',
    description: 'Helps with lead generation, CRM updates, and sales follow-ups.',
    category: 'Sales',
    interfaceType: 'chat',
    promptBase: 'You are a sales assistant...',
    icon: 'Briefcase',
    color: '#FF9800', // Orange
    tags: ['leads', 'crm', 'follow-up'],
    status: 'published',
    freeTrialOffered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.2,
    reviewCount: 90,
  },
    {
    id: '4',
    name: 'Support Sphere',
    description: 'Provides instant answers to common customer queries and FAQs.',
    category: 'Customer Support',
    interfaceType: 'chat',
    promptBase: 'You are a customer support agent...',
    icon: 'Headset',
    color: '#9C27B0', // Purple
    tags: ['faq', 'helpdesk', 'tickets'],
    status: 'published',
    freeTrialOffered: true,
    trialDurationDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.6,
    reviewCount: 180,
  },
];

const categories = ['All', 'Accounting', 'Marketing', 'Sales', 'Customer Support', 'Productivity', 'Development'];

export default function AgentCatalogPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        // const agentsCollectionRef = collection(db, 'agents'); // Actual Firebase
        // const q = query(agentsCollectionRef, where('status', '==', 'published'), orderBy('name')); // Actual Firebase
        // const querySnapshot = await getDocs(q); // Actual Firebase
        // const fetchedAgents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent)); // Actual Firebase
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAgents(mockAgents);
        setFilteredAgents(mockAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
        // Handle error (e.g., show toast)
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    let tempAgents = agents;
    if (selectedCategory !== 'All') {
      tempAgents = tempAgents.filter(agent => agent.category === selectedCategory);
    }
    if (searchTerm) {
      tempAgents = tempAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    setFilteredAgents(tempAgents);
  }, [searchTerm, selectedCategory, agents]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Agent Catalog</h1>
        <p className="text-muted-foreground">
          Discover intelligent agents to automate your business tasks.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents by name, description, or tag..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading agents...</p>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No agents found matching your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

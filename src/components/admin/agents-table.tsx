"use client";

import type { Agent } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit3, Trash2, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';

interface AgentsTableProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (agentId: string) => void;
}

export function AgentsTable({ agents, onEdit, onDelete }: AgentsTableProps) {
  const getStatusVariant = (status: Agent['status']) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interface</TableHead>
            <TableHead>Trial</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No agents found. Create one to get started!
              </TableCell>
            </TableRow>
          )}
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.category}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(agent.status)}>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</Badge>
              </TableCell>
              <TableCell>{agent.interfaceType.charAt(0).toUpperCase() + agent.interfaceType.slice(1)}</TableCell>
              <TableCell>{agent.freeTrialOffered ? `${agent.trialDurationDays || 7} days` : 'No'}</TableCell>
              <TableCell>{format(new Date(agent.createdAt.toString()), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => alert(`View agent ${agent.name} (not implemented)`)}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(agent)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => alert(`Duplicate agent ${agent.name} (not implemented)`)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(agent.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ShadCN Card component is used as a wrapper, so need to import it.
// This file itself does not define Card, but uses it.
// Assuming Card is available globally or imported where AgentsTable is used.
import { Card } from "@/components/ui/card";

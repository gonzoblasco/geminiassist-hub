"use client";

import { useState, useEffect } from 'react';
import type { Interaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldCheck, ShieldAlert, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { moderateAgentResponses, type ModerateAgentResponsesInput, type ModerateAgentResponsesOutput } from '@/ai/flows/moderate-agent-responses';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

// Mock data for flagged interactions
const mockFlaggedInteractions: Interaction[] = [
  {
    id: 'interaction1',
    userId: 'userA',
    agentId: 'agentX',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    inputType: 'chat',
    inputContent: "This is a potentially problematic user input.",
    outputContent: "This is a potentially problematic agent response.",
    isFlaggedForModeration: true,
  },
  {
    id: 'interaction2',
    userId: 'userB',
    agentId: 'agentY',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    inputType: 'form',
    inputContent: { query: "Another problematic query" },
    outputContent: "Another questionable agent response.",
    isFlaggedForModeration: true,
    moderationResult: { isSafe: false, reason: "Contains harmful content", moderatedAt: new Date() }
  },
];

export default function AdminModerationPage() {
  const { toast } = useToast();
  const [flaggedItems, setFlaggedItems] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moderatingItemId, setModeratingItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlaggedItems = async () => {
      setIsLoading(true);
      // In a real app, fetch from Firestore where isFlaggedForModeration is true
      // and moderationResult is not yet set, or needs review.
      // const q = query(collection(db, 'interactions'), where('isFlaggedForModeration', '==', true), orderBy('timestamp', 'desc'));
      // const snapshot = await getDocs(q);
      // const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interaction));
      
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
      setFlaggedItems(mockFlaggedInteractions);
      setIsLoading(false);
    };
    fetchFlaggedItems();
  }, []);

  const handleModerate = async (item: Interaction, textToModerate: string, type: 'input' | 'output') => {
    setModeratingItemId(item.id + type);
    try {
      const result = await moderateAgentResponses({ text: textToModerate });
      
      // Update item in Firestore (conceptual)
      // const itemDocRef = doc(db, 'interactions', item.id);
      // await updateDoc(itemDocRef, {
      //   [`moderationResult_${type}`]: { ...result, moderatedAt: serverTimestamp() },
      //   // Potentially update isFlaggedForModeration based on result
      // });

      // Update local state for demo purposes
      setFlaggedItems(prevItems => prevItems.map(i => 
        i.id === item.id ? { ...i, moderationResult: { ...result, moderatedAt: new Date() } } : i
      ));

      toast({
        title: `Content Moderated (${result.isSafe ? 'Safe' : 'Not Safe'})`,
        description: result.reason || (result.isSafe ? 'Content appears to be safe.' : 'Content flagged for review.'),
        variant: result.isSafe ? 'default' : 'destructive',
      });

    } catch (error) {
      console.error("Error moderating content:", error);
      toast({ title: "Moderation Error", description: "Failed to moderate content.", variant: "destructive" });
    } finally {
      setModeratingItemId(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Content Moderation</h1>
      <p className="text-muted-foreground">
        Review and moderate AI agent responses and user inputs that have been flagged for potentially problematic content.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading flagged items...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Interactions ({flaggedItems.length})</CardTitle>
            <CardDescription>Items requiring review are listed below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent/User</TableHead>
                  <TableHead>Content Snippet</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedItems.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center h-24">No items currently in the moderation queue.</TableCell></TableRow>
                )}
                {flaggedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                        <div>Agent: {item.agentId}</div>
                        <div className="text-xs text-muted-foreground">User: {item.userId}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                        <span className="font-semibold">Input:</span> {typeof item.inputContent === 'string' ? item.inputContent : JSON.stringify(item.inputContent)}
                        <br />
                        <span className="font-semibold">Output:</span> {item.outputContent}
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(item.timestamp.toString()), { addSuffix: true })}</TableCell>
                    <TableCell>
                      {item.moderationResult ? (
                        item.moderationResult.isSafe ? 
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600"><ShieldCheck className="mr-1 h-3 w-3" /> Safe</Badge> : 
                          <Badge variant="destructive"><ShieldAlert className="mr-1 h-3 w-3" /> Not Safe</Badge>
                      ) : (
                        <Badge variant="secondary">Pending Review</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" size="sm" 
                        onClick={() => handleModerate(item, typeof item.inputContent === 'string' ? item.inputContent : JSON.stringify(item.inputContent) , 'input')}
                        disabled={moderatingItemId === item.id + 'input'}
                      >
                        {moderatingItemId === item.id + 'input' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Review Input"}
                      </Button>
                       <Button 
                        variant="outline" size="sm" 
                        onClick={() => handleModerate(item, item.outputContent, 'output')}
                        disabled={moderatingItemId === item.id + 'output'}
                      >
                        {moderatingItemId === item.id + 'output' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Review Output"}
                      </Button>
                      {/* Further actions like "Approve", "Reject", "Escalate" can be added */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

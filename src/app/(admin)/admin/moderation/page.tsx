
"use client";

import { useState, useEffect } from 'react';
import type { Interaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldCheck, ShieldAlert, ThumbsUp, ThumbsDown, Loader2, AlertTriangle } from 'lucide-react';
import { moderateAgentResponses, type ModerateAgentResponsesInput, type ModerateAgentResponsesOutput } from '@/ai/flows/moderate-agent-responses';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for flagged interactions
const mockFlaggedInteractions: Interaction[] = [
  {
    id: 'interaction1',
    userId: 'userA001',
    agentId: 'Marketing Maven',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    inputType: 'chat',
    inputContent: "Can you write an ad that's extremely aggressive towards competitors?",
    outputContent: "Sure, here's an ad that really tears down BrandX...",
    isFlaggedForModeration: true,
  },
  {
    id: 'interaction2',
    userId: 'userB002',
    agentId: 'Support Sphere',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    inputType: 'form',
    inputContent: { query: "My product exploded, what do I do?" },
    outputContent: "Have you tried turning it off and on again?",
    isFlaggedForModeration: true,
    moderationResult: { isSafe: false, reason: "Potentially harmful advice, insensitive.", moderatedAt: new Date(Date.now() - 1000 * 60 * 5) }
  },
  {
    id: 'interaction3',
    userId: 'userC003',
    agentId: 'Accounting Ace',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    inputType: 'chat',
    inputContent: "Is it okay to hide some income from the government?",
    outputContent: "As an AI, I cannot provide advice on illegal activities. You should always comply with tax laws.",
    isFlaggedForModeration: true,
    moderationResult: { isSafe: true, reason: "Agent responded appropriately to sensitive query.", moderatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3) }
  },
];

export default function AdminModerationPage() {
  const { toast } = useToast();
  const [flaggedItems, setFlaggedItems] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moderatingInfo, setModeratingInfo] = useState<{itemId: string; type: 'input' | 'output'} | null>(null);
  const [viewingItem, setViewingItem] = useState<Interaction | null>(null);

  useEffect(() => {
    const fetchFlaggedItems = async () => {
      setIsLoading(true);
      // In a real app, fetch from Firestore where isFlaggedForModeration is true
      // const q = query(collection(db, 'interactions'), where('isFlaggedForModeration', '==', true), orderBy('timestamp', 'desc'));
      // const snapshot = await getDocs(q);
      // const items = snapshot.docs.map(doc => {
      //   const data = doc.data();
      //   return { 
      //     id: doc.id, ...data, 
      //     timestamp: (data.timestamp as Timestamp).toDate(),
      //     moderationResult: data.moderationResult ? { ...data.moderationResult, moderatedAt: (data.moderationResult.moderatedAt as Timestamp).toDate()} : undefined
      //   } as Interaction
      // });
      
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
      setFlaggedItems(mockFlaggedInteractions.map(item => ({
        ...item,
        // Ensure moderationResult.moderatedAt is a Date if it exists
        moderationResult: item.moderationResult ? { ...item.moderationResult, moderatedAt: new Date(item.moderationResult.moderatedAt.toString()) } : undefined
      })));
      setIsLoading(false);
    };
    fetchFlaggedItems();
  }, []);

  const handleModerate = async (item: Interaction, textToModerate: string, type: 'input' | 'output') => {
    setModeratingInfo({itemId: item.id, type});
    try {
      const result = await moderateAgentResponses({ text: textToModerate });
      
      // Update item in Firestore (conceptual)
      // const itemDocRef = doc(db, 'interactions', item.id);
      // await updateDoc(itemDocRef, {
      //   moderationResult: { ...result, moderatedAt: serverTimestamp(), moderatedBy: 'admin', typeModerated: type },
      //   // Potentially update isFlaggedForModeration based on result, or add isReviewed flag
      // });

      setFlaggedItems(prevItems => prevItems.map(i => 
        i.id === item.id ? { ...i, moderationResult: { ...result, moderatedAt: new Date(), typeModerated: type } } : i
      ));

      toast({
        title: `Content Moderated (${result.isSafe ? 'Safe' : 'Not Safe'})`,
        description: result.reason || (result.isSafe ? `Content (${type}) appears to be safe.` : `Content (${type}) flagged for review.`),
        variant: result.isSafe ? 'default' : 'destructive',
      });

    } catch (error) {
      console.error("Error moderating content:", error);
      toast({ title: "Moderation Error", description: "Failed to moderate content.", variant: "destructive" });
    } finally {
      setModeratingInfo(null);
    }
  };

  const getContentToDisplay = (content: Record<string, any> | string): string => {
    if (typeof content === 'string') return content;
    return JSON.stringify(content);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Content Moderation</h1>
      <p className="text-muted-foreground">
        Review and moderate AI agent responses and user inputs that have been flagged for potentially problematic content.
      </p>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading flagged items...</p>
        </div>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Flagged Interactions ({flaggedItems.length})</CardTitle>
            <CardDescription>Items requiring review are listed below. Use Genkit AI to assess content safety.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Agent/User</TableHead>
                  <TableHead className="w-[35%]">Content Snippet</TableHead>
                  <TableHead className="w-[15%]">Timestamp</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="text-right w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedItems.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center h-24">No items currently in the moderation queue. <ShieldCheck className="inline-block h-5 w-5 ml-2 text-green-500" /></TableCell></TableRow>
                )}
                {flaggedItems.map((item) => (
                  <TableRow key={item.id} className={item.moderationResult && !item.moderationResult.isSafe ? "bg-red-500/10 hover:bg-red-500/20" : ""}>
                    <TableCell>
                        <div>Agent: <span className="font-semibold">{item.agentId}</span></div>
                        <div className="text-xs text-muted-foreground">User ID: {item.userId}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                        <p className="truncate"><span className="font-semibold">Input:</span> {getContentToDisplay(item.inputContent)}</p>
                        <p className="truncate"><span className="font-semibold">Output:</span> {item.outputContent}</p>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(item.timestamp.toString()), { addSuffix: true })}</TableCell>
                    <TableCell>
                      {item.moderationResult ? (
                        item.moderationResult.isSafe ? 
                          <Badge variant="default" className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200"><ShieldCheck className="mr-1 h-3 w-3" /> Safe</Badge> : 
                          <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Not Safe</Badge>
                      ) : (
                        <Badge variant="secondary">Pending Review</Badge>
                      )}
                       {item.moderationResult?.reason && <p className="text-xs text-muted-foreground mt-1 truncate" title={item.moderationResult.reason}>Reason: {item.moderationResult.reason}</p>}
                    </TableCell>
                    <TableCell className="text-right space-y-1 sm:space-y-0 sm:space-x-1">
                      <Button 
                        variant="outline" size="sm" 
                        onClick={() => setViewingItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" size="sm" 
                        onClick={() => handleModerate(item, getContentToDisplay(item.inputContent) , 'input')}
                        disabled={moderatingInfo?.itemId === item.id && moderatingInfo?.type === 'input'}
                        className="w-full sm:w-auto"
                      >
                        {moderatingInfo?.itemId === item.id && moderatingInfo?.type === 'input' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                        Input
                      </Button>
                       <Button 
                        variant="outline" size="sm" 
                        onClick={() => handleModerate(item, item.outputContent, 'output')}
                        disabled={moderatingInfo?.itemId === item.id && moderatingInfo?.type === 'output'}
                        className="w-full sm:w-auto"
                      >
                        {moderatingInfo?.itemId === item.id && moderatingInfo?.type === 'output' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                        Output
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewingItem && (
        <AlertDialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Interaction Details (ID: {viewingItem.id})</AlertDialogTitle>
              <AlertDialogDescription>
                Full content of the flagged interaction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <p><span className="font-semibold">Agent:</span> {viewingItem.agentId}</p>
              <p><span className="font-semibold">User ID:</span> {viewingItem.userId}</p>
              <p><span className="font-semibold">Timestamp:</span> {new Date(viewingItem.timestamp.toString()).toLocaleString()}</p>
              <div>
                <h4 className="font-semibold mb-1">User Input:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap break-all">{getContentToDisplay(viewingItem.inputContent)}</pre>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Agent Output:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap break-all">{viewingItem.outputContent}</pre>
              </div>
              {viewingItem.moderationResult && (
                <div>
                  <h4 className="font-semibold mb-1">Moderation Result:</h4>
                  <p>Status: {viewingItem.moderationResult.isSafe ? <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">Safe</Badge> : <Badge variant="destructive">Not Safe</Badge>}</p>
                  {viewingItem.moderationResult.reason && <p>Reason: {viewingItem.moderationResult.reason}</p>}
                  <p>Moderated At: {new Date(viewingItem.moderationResult.moderatedAt.toString()).toLocaleString()}</p>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setViewingItem(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

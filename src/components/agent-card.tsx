import type { Agent } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Star, Zap } from 'lucide-react'; // Assuming Zap as default icon

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const IconComponent = agent.icon ? require('lucide-react')[agent.icon] || Zap : Zap;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <IconComponent className="h-10 w-10" style={{ color: agent.color || 'hsl(var(--primary))' }} />
                <div>
                    <CardTitle className="text-xl font-headline leading-tight">{agent.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">{agent.category}</Badge>
                </div>
            </div>
            {agent.averageRating && (
                <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{agent.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({agent.reviewCount})</span>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-sm">{agent.description}</CardDescription>
        {agent.tags && agent.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {agent.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-xs text-muted-foreground">
          {agent.freeTrialOffered ? `${agent.trialDurationDays || 7}-Day Free Trial` : 'Subscription Required'}
        </div>
        <Button asChild size="sm">
          <Link href={`/agents/${agent.id}`}>
            {agent.freeTrialOffered ? 'Try Free' : 'View Agent'} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

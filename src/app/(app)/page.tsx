"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BotMessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (!user.onboardingCompleted) {
        router.replace('/onboarding');
      }
      // If onboarding is completed, they can stay on this dashboard or go to /agents.
      // For now, let them stay on dashboard which links to /agents.
    }
  }, [user, loading, router]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  if (!user) {
    // This should ideally be handled by the AppShell or a higher-level auth guard.
    // If somehow reached without user, show minimal loading or redirect.
    return <div className="flex justify-center items-center h-screen"><p>Redirecting...</p></div>;
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Welcome to GeminiAssist Hub, {user?.displayName || 'User'}!</CardTitle>
          <CardDescription>
            Explore intelligent AI agents designed to streamline your business tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You&apos;re all set to dive in! Discover agents that can help with accounting, marketing, sales, and more.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/agents">
                <BotMessageSquare className="mr-2 h-5 w-5" /> Explore Agents
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/onboarding">
                Revisit Onboarding <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for recent activity or favorite agents */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Favorite Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven&apos;t favorited any agents yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link href="/subscriptions" className="text-primary hover:underline">Manage Subscriptions</Link>
            <Link href="/settings" className="text-primary hover:underline">Account Settings</Link>
            <Link href="/help" className="text-primary hover:underline">Help & Support</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

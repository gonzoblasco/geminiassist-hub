
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BotMessageSquare, Loader2 } from "lucide-react"; // Added Loader2
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRootPage() { // Renamed component for clarity
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (!user.onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard'); // Redirect to the new dashboard
      }
    }
    // If not loading and no user, AppShell or login page's useEffect should handle redirection to /login
  }, [user, loading, router]);
  
  // Show a loading state while determining redirection
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-var(--header-height,4rem))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // This content will likely not be shown due to quick redirection by useEffect.
  // It's here as a fallback or if redirection logic changes.
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Redirigiendo a tu Dashboard...</CardTitle>
          <CardDescription>
            Serás redirigido en breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Si no eres redirigido automáticamente, por favor haz clic abajo.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                <BotMessageSquare className="mr-2 h-5 w-5" /> Ir al Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

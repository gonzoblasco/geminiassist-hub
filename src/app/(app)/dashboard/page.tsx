
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BotMessageSquare, BarChart, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // AppShell also handles onboarding redirection, but this is an additional safeguard
  // if user lands here directly and onboarding is not complete.
  useEffect(() => {
    if (!loading && user && !user.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-var(--header-height,4rem))]">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="ml-4 text-lg text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by the AppShell or a higher-level auth guard.
    return (
      <div className="flex justify-center items-center h-[calc(100vh-var(--header-height,4rem))]">
        <p className="text-lg text-muted-foreground">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">¡Bienvenido a InnoTech Solutions, {user?.displayName || 'Usuario'}!</CardTitle>
          <CardDescription className="text-lg">
            Este es tu panel de control principal. Desde aquí puedes acceder a todas las funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Explora los agentes de IA, gestiona tus suscripciones o configura tu cuenta.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/agents">
                <BotMessageSquare className="mr-2 h-5 w-5" /> Explorar Agentes IA
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/subscriptions">
                <BarChart className="mr-2 h-5 w-5" /> Ver Suscripciones
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/settings">
                <Settings className="mr-2 h-5 w-5" /> Configuración de Cuenta
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Un resumen de tus interacciones recientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Aún no hay actividad reciente.</p>
            {/* Placeholder for recent activity */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enlaces Rápidos</CardTitle>
            <CardDescription>Accede rápidamente a secciones importantes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Link href="/profile" className="text-primary hover:underline flex items-center">
              <ArrowRight className="mr-2 h-4 w-4 text-primary/70" /> Ver tu Perfil
            </Link>
            <Link href="/help" className="text-primary hover:underline flex items-center">
             <ArrowRight className="mr-2 h-4 w-4 text-primary/70" /> Centro de Ayuda
            </Link>
             {user?.onboardingCompleted === false && (
                 <Button asChild variant="link" className="p-0 h-auto justify-start text-primary hover:underline">
                    <Link href="/onboarding">
                        <ArrowRight className="mr-2 h-4 w-4 text-primary/70" /> Completar Onboarding
                    </Link>
                 </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add Loader2 for loading state
import { Loader2 } from "lucide-react";


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import Image from "next/image"; // Added for logo
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Actual Firebase
// import { auth } from '@/lib/firebase'; // Actual Firebase
import { auth as placeholderAuth } from '@/lib/firebase'; // Placeholder Firebase
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast"; // Added for error messages

// Placeholder Google icon component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.94 11c-.1-.59-.32-1.14-.62-1.64H12v3.29h5.02c-.2.98-.72 1.8-1.45 2.44v2.04h2.62c1.54-1.42 2.44-3.48 2.44-5.85V11z"/>
    <path d="M12 21c2.4 0 4.41-.79 5.88-2.13l-2.62-2.04c-.8.54-1.83.86-2.98.86-2.29 0-4.23-1.54-4.92-3.61H4.27v2.12C5.75 19.08 8.66 21 12 21z"/>
    <path d="M7.08 13.72c-.21-.64-.33-1.31-.33-2s.12-1.36.33-2V7.6H4.27C3.09 9.83 3 11.27 3 12c0 .73.09 2.17 1.27 4.4l2.81-2.68z"/>
    <path d="M12 6.24c1.31 0 2.39.45 3.29 1.3l2.33-2.33C16.05 3.56 14.23 3 12 3 8.66 3 5.75 4.92 4.27 7.6l2.81 2.12C7.77 7.78 9.71 6.24 12 6.24z"/>
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const pageTitle = "Bienvenido a InnoTech Solutions";
  const pageDescription = "Inicia sesión para acceder a tus herramientas.";

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else { // client role
        if (!user.onboardingCompleted) {
          router.replace('/onboarding');
        } else {
          router.replace('/dashboard'); // Redirect to the new dashboard
        }
      }
    }
  }, [user, authLoading, router]);


  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // await signInWithPopup(auth, new GoogleAuthProvider()); // Actual Firebase
      await placeholderAuth.signInWithPopup(); // Placeholder Firebase
      toast({ title: "Inicio de sesión exitoso", description: "Redirigiendo..." });
      // Redirection is handled by the useEffect hook reacting to user state change.
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        title: "Error de autenticación",
        description: "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Cargando...</p>
      </div>
    );
  }
  
  // If user is already logged in, useEffect will redirect. Show minimal loading or null.
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4 items-center flex-col gap-2">
            <Image 
              src="https://placehold.co/64x64.png" 
              alt="InnoTech Solutions Logo" 
              width={64} 
              height={64} 
              data-ai-hint="abstract logo"
              className="rounded-md"
            />
            <CardTitle className="text-2xl font-headline">InnoTech Solutions</CardTitle>
          </div>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
            {isSigningIn ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-2">Ingresar con Google</span>
          </Button>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al hacer clic en continuar, aceptas nuestros{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

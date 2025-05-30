"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Zap, Mail } from "lucide-react";
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Actual Firebase
// import { auth } from '@/lib/firebase'; // Actual Firebase
import { auth as placeholderAuth } from '@/lib/firebase'; // Placeholder Firebase
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";


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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth(); // Use the auth context

  const isSignup = searchParams.get('signup') === 'true';
  const pageTitle = isSignup ? "Create an Account" : "Welcome Back";
  const pageDescription = isSignup ? "Join GeminiAssist Hub to supercharge your business." : "Sign in to access your AI agents.";

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect based on onboarding status or to dashboard
      if (!user.onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace(user.role === 'admin' ? '/admin' : '/agents');
      }
    }
  }, [user, loading, router]);


  const handleGoogleSignIn = async () => {
    // const provider = new GoogleAuthProvider(); // Actual Firebase
    try {
      // await signInWithPopup(auth, provider); // Actual Firebase
      await placeholderAuth.signInWithPopup(); // Placeholder Firebase
      // router.push('/onboarding'); // Redirection handled by useEffect
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Handle error (e.g., show toast)
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p> {/* Replace with a proper spinner/skeleton */}
      </div>
    );
  }
  
  if (user) {
     // Already logged in, useEffect will redirect. Show loading or null.
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Zap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">{pageTitle}</CardTitle>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon /> <span className="ml-2">Sign in with Google</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            {isSignup && (
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/login?signup=true" className="underline text-primary hover:text-primary/80">
                  Sign Up
                </Link>
                 <span className="mx-1">·</span>
                <Link href="/forgot-password" className="underline text-primary hover:text-primary/80 text-xs">
                  Forgot password?
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context'; // Conceptual: requires Firebase setup
import './globals.css';

export const metadata: Metadata = {
  title: 'GeminiAssist Hub',
  description: 'Discover, hire, and utilize intelligent Gemini-based agents for your business tasks.',
  manifest: '/manifest.json', // For PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="application-name" content="GeminiAssist Hub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GeminiAssist Hub" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6639A6" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider> {/* Conceptual: wraps app with auth state */}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

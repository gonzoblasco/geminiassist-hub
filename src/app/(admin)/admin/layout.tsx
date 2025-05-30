
"use client";

import { AppShell, adminNavItems } from '@/components/layout/app-shell';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?next=/admin'); // Redirect to login if not authenticated
      } else if (!isAdmin) {
        router.replace('/'); // Redirect non-admins to client dashboard or landing
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          {loading ? 'Cargando área de administración...' : 'Acceso no autorizado. Redirigiendo...'}
        </p>
      </div>
    );
  }

  return (
    <AppShell navItems={adminNavItems} userRole="admin">
      {children}
    </AppShell>
  );
}

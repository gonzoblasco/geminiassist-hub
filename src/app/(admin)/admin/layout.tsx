import { AppShell, adminNavItems } from '@/components/layout/app-shell';
// import { useAuth } from '@/contexts/auth-context'; // Conceptual
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, isAdmin, loading } = useAuth(); // Conceptual
  // const router = useRouter();

  // useEffect(() => { // Conceptual - protect admin routes
  //   if (!loading) {
  //     if (!user) {
  //       router.replace('/login');
  //     } else if (!isAdmin) {
  //       router.replace('/'); // Redirect non-admins to client dashboard
  //     }
  //   }
  // }, [user, isAdmin, loading, router]);

  // if (loading || !isAdmin) { // Conceptual
  //   return <div className="flex justify-center items-center h-screen"><p>Loading admin area...</p></div>;
  // }

  return (
    <AppShell navItems={adminNavItems} userRole="admin">
      {children}
    </AppShell>
  );
}

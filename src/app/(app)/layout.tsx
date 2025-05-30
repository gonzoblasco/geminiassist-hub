import { AppShell, clientNavItems } from '@/components/layout/app-shell';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell navItems={clientNavItems} userRole="client">
      {children}
    </AppShell>
  );
}

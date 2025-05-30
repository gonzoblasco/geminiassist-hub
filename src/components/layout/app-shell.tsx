
"use client";

import React, { type ReactNode } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { MainNav, type NavItem } from './main-nav';
import { Zap, Settings, LogOut, UserCircle, LayoutDashboard, BotMessageSquare, Users, ShieldAlert, BadgeDollarSign, Contact, LifeBuoy, MessageSquareQuote, FileText } from 'lucide-react'; // Added MessageSquareQuote, FileText
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';

interface AppShellProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole?: 'client' | 'admin';
}

export function AppShell({ children, navItems, userRole }: AppShellProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user && !user.onboardingCompleted && pathname !== '/onboarding' && userRole !== 'admin' && !pathname.startsWith('/admin')) {
        router.replace('/onboarding');
    }
  }, [user, loading, router, pathname, userRole]);

  if (loading || (!user && pathname !== '/login' && !pathname.startsWith('/public'))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Zap className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }
  
  if (!user && pathname !== '/login' && !pathname.startsWith('/public')) return null;


  const defaultOpen = true; 

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href={userRole === 'admin' ? "/admin" : "/dashboard"} className="flex items-center gap-2 flex-grow overflow-hidden">
            <Zap className="h-7 w-7 text-primary flex-shrink-0" />
            <span className="font-semibold text-lg font-headline whitespace-nowrap group-data-[collapsible=icon]:hidden">InnoTech</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <MainNav items={navItems} />
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                  tooltip={{children: "Configuración", side: "right", align:"center"}}
                >
                  <Link href={userRole === 'admin' ? "/admin/settings" : "/settings"}>
                    <Settings /> <span className="group-data-[collapsible=icon]:hidden">Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <SidebarMenuButton
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center"
                    tooltip={{children: "Cerrar Sesión", side: "right", align:"center"}}
                    onClick={handleSignOut}
                  >
                    <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
            <div className="md:hidden"> 
                 <SidebarTrigger />
            </div>
            <div className="flex-1">
              {/* Breadcrumbs or dynamic page title can go here */}
            </div>
            <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const clientNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exactMatch: true },
  { title: 'Agentes IA', href: '/agents', icon: BotMessageSquare },
  { title: 'Suscripciones', href: '/subscriptions', icon: BadgeDollarSign },
  { title: 'Ayuda', href: '/help', icon: LifeBuoy },
  { title: 'Contacto', href: '/contact', icon: Contact },
];

export const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, exactMatch: true },
  { title: 'Gestión de Agentes', href: '/admin/agents', icon: BotMessageSquare },
  { title: 'Gestión de Usuarios', href: '/admin/users', icon: Users },
  { title: 'Suscripciones', href: '/admin/subscriptions', icon: FileText }, // New
  { title: 'Moderación', href: '/admin/moderation', icon: ShieldAlert },
  { title: 'Feedback', href: '/admin/feedback', icon: MessageSquareQuote }, // New
];

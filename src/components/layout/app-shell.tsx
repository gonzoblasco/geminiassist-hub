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
import { Zap, Settings, LogOut, UserCircle, LayoutDashboard, BotMessageSquare, Users, ShieldAlert, BadgeDollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // Conceptual
import { useRouter, usePathname } from 'next/navigation';

interface AppShellProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole?: 'client' | 'admin'; // To customize sidebar content
}

export function AppShell({ children, navItems, userRole }: AppShellProps) {
  const { user, loading } = useAuth(); // Conceptual
  const router = useRouter();
  const pathname = usePathname();

  // Placeholder for auth check, replace with actual logic from useAuth
  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    // Redirect to onboarding if not completed
    if (!loading && user && !user.onboardingCompleted && pathname !== '/onboarding' && userRole !== 'admin') {
        router.replace('/onboarding');
    }
  }, [user, loading, router, pathname, userRole]);

  if (loading || (!user && pathname !== '/login')) { // Prevent flicker or showing content before redirect
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Zap className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }
  
  // If user is not authenticated and we are not on a public page (e.g. login), don't render shell.
  // This check might be redundant if useEffect handles redirection properly, but good as a safeguard.
  if (!user && pathname !== '/login') return null;


  const defaultOpen = true; // Or load from cookie/localStorage

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href={userRole === 'admin' ? "/admin" : "/"} className="flex items-center gap-2 flex-grow overflow-hidden">
            <Zap className="h-7 w-7 text-primary flex-shrink-0" />
            <span className="font-semibold text-lg font-headline whitespace-nowrap group-data-[collapsible=icon]:hidden">GeminiAssist</span>
          </Link>
          {/* SidebarTrigger is usually outside SidebarHeader for mobile, or use custom positioning */}
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
                  tooltip={{children: "Settings", side: "right", align:"center"}}
                >
                  <Link href={userRole === 'admin' ? "/admin/settings" : "/settings"}>
                    <Settings /> <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Conceptual: Sign out button */}
              <SidebarMenuItem>
                 <SidebarMenuButton
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center"
                    tooltip={{children: "Sign Out", side: "right", align:"center"}}
                    onClick={() => { /* Call signout method */ router.push('/login'); }}
                  >
                    <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
            <div className="md:hidden"> {/* Mobile sidebar trigger */}
                 <SidebarTrigger />
            </div>
            <div className="flex-1">
              {/* Breadcrumbs or page title can go here */}
            </div>
            <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Define specific navigation items
export const clientNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard, exactMatch: true },
  { title: 'AI Agents', href: '/agents', icon: BotMessageSquare },
  { title: 'Subscriptions', href: '/subscriptions', icon: BadgeDollarSign },
  // { title: 'History', href: '/history', icon: History },
  // { title: 'Favorites', href: '/favorites', icon: Star },
];

export const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, exactMatch: true },
  { title: 'Agent Management', href: '/admin/agents', icon: BotMessageSquare },
  { title: 'User Management', href: '/admin/users', icon: Users },
  { title: 'Content Moderation', href: '/admin/moderation', icon: ShieldAlert },
];

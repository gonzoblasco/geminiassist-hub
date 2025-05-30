
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, BotMessageSquare, ShieldAlert, MessageSquareQuote, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
// import { collection, getCountFromServer } from "firebase/firestore"; // Actual Firebase
// import { db } from "@/lib/firebase"; // Actual Firebase

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href: string;
  description: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([
    { title: "Total Users", value: "...", icon: Users, color: "text-blue-500", href: "/admin/users", description: "Manage all users" },
    { title: "Available Agents", value: "...", icon: BotMessageSquare, color: "text-green-500", href: "/admin/agents", description: "Configure AI agents" },
    { title: "Subscriptions", value: "...", icon: FileText, color: "text-purple-500", href: "/admin/subscriptions", description: "View active plans" },
    { title: "Moderation Queue", value: "...", icon: ShieldAlert, color: "text-red-500", href: "/admin/moderation", description: "Review flagged content" },
    { title: "Feedback Received", value: "...", icon: MessageSquareQuote, color: "text-yellow-500", href: "/admin/feedback", description: "Analyze user feedback" },
  ]);

  useEffect(() => {
    // Placeholder for fetching actual data
    const fetchStats = async () => {
      // Example:
      // const usersSnapshot = await getCountFromServer(collection(db, "users"));
      // const agentsSnapshot = await getCountFromServer(collection(db, "agents"));
      // setStats(prevStats => prevStats.map(stat => {
      //   if (stat.title === "Total Users") return { ...stat, value: usersSnapshot.data().count };
      //   if (stat.title === "Available Agents") return { ...stat, value: agentsSnapshot.data().count };
      //   return stat;
      // }));
      
      // Mock data update
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(prevStats => prevStats.map(stat => {
        if (stat.title === "Total Users") return { ...stat, value: 1234 };
        if (stat.title === "Available Agents") return { ...stat, value: 56 };
        if (stat.title === "Subscriptions") return { ...stat, value: 450 };
        if (stat.title === "Moderation Queue") return { ...stat, value: 12 };
        if (stat.title === "Feedback Received") return { ...stat, value: 88 };
        return stat;
      }));
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.title} legacyBehavior>
              <a className="block">
                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <CardDescription className="text-xs">{stat.description}</CardDescription>
                    </div>
                    <div className={`p-2 rounded-md bg-muted ${stat.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                   <CardContent className="pt-2 pb-4">
                     <p className="text-xs text-muted-foreground flex items-center">
                        <Eye className="mr-1 h-3 w-3"/> View Details
                     </p>
                   </CardContent>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent system events and user interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground h-32 flex items-center justify-center">Recent activity feed will be displayed here.</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Status of Firebase services and AI model performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground h-32 flex items-center justify-center">System health monitoring will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

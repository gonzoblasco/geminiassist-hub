import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, BotMessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "text-blue-500", href: "/admin/users" },
    { title: "Active Agents", value: "56", icon: BotMessageSquare, color: "text-green-500", href: "/admin/agents" },
    { title: "Subscriptions", value: "450", icon: BarChart, color: "text-purple-500", href: "/admin/subscriptions" },
    { title: "Moderation Queue", value: "12", icon: ShieldAlert, color: "text-red-500", href: "/admin/moderation" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.title} legacyBehavior>
              <a className="block">
                <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">View Details</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent system events and user interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity log or chart */}
            <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Status of Firebase services and AI model performance.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for system health indicators */}
            <p className="text-muted-foreground">System health monitoring will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Construction } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>All Users</CardTitle>
          </div>
          <CardDescription>
            View, filter, and manage user accounts. This section is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Construction className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground">User Management Coming Soon!</h2>
          <p className="text-muted-foreground">
            Functionality to list, search, filter, and manage users will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, CreditCard, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context"; // Conceptual
// import { auth } from "@/lib/firebase"; // Actual Firebase
import { auth as placeholderAuth } from "@/lib/firebase"; // Placeholder Firebase
import { useRouter } from "next/navigation";


export function UserNav() {
  const { user, firebaseUser } = useAuth(); // Conceptual
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // await auth.signOut(); // Actual Firebase
      await placeholderAuth.signOut(); // Placeholder Firebase
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!user && !firebaseUser) { // Only show if a user (profile or firebaseUser) exists
    return (
      <Button asChild variant="outline" size="sm">
         <Link href="/login">Sign In</Link>
      </Button>
    );
  }
  
  const userDisplayName = user?.displayName || firebaseUser?.displayName || "User";
  const userEmail = user?.email || firebaseUser?.email || "no-email@example.com";
  const userPhotoURL = user?.photoURL || firebaseUser?.photoURL || "https://placehold.co/40x40.png";
  const userInitials = userDisplayName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userPhotoURL} alt={userDisplayName || "User Avatar"} data-ai-hint="profile avatar" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userDisplayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/billing" passHref>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

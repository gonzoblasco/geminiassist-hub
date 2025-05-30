"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon: LucideIcon;
  label?: string;
  description?: string;
  exactMatch?: boolean;
  children?: NavItem[];
}

interface MainNavProps {
  items: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className="w-full justify-start group-data-[collapsible=icon]:justify-center"
              tooltip={{ children: item.title, side: "right", align: "center" }}
            >
              <Link href={item.href} target={item.external ? "_blank" : undefined}>
                <Icon /> <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.children && item.children.length > 0 && (
              <SidebarMenuSub>
                {item.children.map((child, childIndex) => {
                  const ChildIcon = child.icon;
                  const isChildActive = child.exactMatch ? pathname === child.href : pathname.startsWith(child.href);
                  return (
                    <SidebarMenuSubItem key={childIndex}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isChildActive}
                      >
                        <Link href={child.href} target={child.external ? "_blank" : undefined}>
                          {ChildIcon && <ChildIcon />} <span>{child.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

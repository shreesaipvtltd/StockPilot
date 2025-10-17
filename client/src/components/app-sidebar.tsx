import { LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine, FileText, Users, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "staff", "employee"],
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Stock In",
    url: "/stock-in",
    icon: ArrowDownToLine,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Stock Out",
    url: "/stock-out",
    icon: ArrowUpFromLine,
    roles: ["admin", "manager", "staff", "employee"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    roles: ["admin", "manager"],
  },
  {
    title: "Staff",
    url: "/staff",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin", "manager"],
  },
];

interface AppSidebarProps {
  userRole?: string;
}

export function AppSidebar({ userRole = "admin" }: AppSidebarProps) {
  const [location] = useLocation();
  
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-base">Inventory</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

import { Home, Play, Presentation, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import logo from "@/assets/rebutly-logo.png";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/play", label: "Play", icon: Play },
  { to: "/demo", label: "Demo", icon: Presentation },
  { to: "/auth", label: "Sign In", icon: User },
];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const handleOpenChange = (open: boolean) => {
    if (open !== isOpen) {
      onToggle();
    }
  };

  return (
    <SidebarProvider open={isOpen} onOpenChange={handleOpenChange}>
      <UISidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Rebutly" className="h-7 w-7 rounded-md" />
              <div className="text-sm font-semibold">
                Rebutly<span className="text-primary">.AI</span>
              </div>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className="nav-item"
                      activeClassName="active"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className={cn("px-3 py-2 text-xs text-muted-foreground")}>
            Version 0.0.0
          </div>
        </SidebarFooter>
      </UISidebar>
    </SidebarProvider>
  );
};

export { Sidebar };

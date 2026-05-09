import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  UserCog,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  Briefcase,
  ClipboardList,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const masterAdminNav: NavItem[] = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'CA Firms', url: '/admin/firms', icon: Building2 },
  { title: 'Subscription Plans', url: '/admin/plans', icon: CreditCard },
  { title: 'All Users', url: '/admin/users', icon: Users },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const caNav: NavItem[] = [
  { title: 'Dashboard', url: '/ca', icon: LayoutDashboard },
  { title: 'Clients', url: '/ca/clients', icon: Users },
  { title: 'Sub-Users', url: '/ca/sub-users', icon: UserCog },
  { title: 'Documents', url: '/ca/documents', icon: FileText },
  { title: 'Subscription', url: '/ca/subscription', icon: CreditCard },
  { title: 'Audit Logs', url: '/ca/audit-logs', icon: History },
  { title: 'Settings', url: '/ca/settings', icon: Settings },
];

const subUserNav: NavItem[] = [
  { title: 'Dashboard', url: '/staff', icon: LayoutDashboard },
  { title: 'My Clients', url: '/staff/clients', icon: Users },
  { title: 'Documents', url: '/staff/documents', icon: FileText },
  { title: 'Tasks', url: '/staff/tasks', icon: ClipboardList },
  { title: 'Settings', url: '/staff/settings', icon: Settings },
];

const clientNav: NavItem[] = [
  { title: 'Dashboard', url: '/client', icon: LayoutDashboard },
  { title: 'My Documents', url: '/client/documents', icon: FileText },
  { title: 'Profile', url: '/client/profile', icon: Briefcase },
  { title: 'Settings', url: '/client/settings', icon: Settings },
];

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  if (!user) return null;

  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case 'master_admin':
        return masterAdminNav;
      case 'ca':
        return caNav;
      case 'sub_user':
        return subUserNav;
      case 'client':
        return clientNav;
      default:
        return [];
    }
  };

  const getRoleLabel = (): string => {
    switch (user.role) {
      case 'master_admin':
        return 'Master Admin';
      case 'ca':
        return 'CA Owner';
      case 'sub_user':
        return 'Staff';
      case 'client':
        return 'Client';
      default:
        return '';
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'master_admin':
        return <Shield className="h-4 w-4" />;
      case 'ca':
        return <Building2 className="h-4 w-4" />;
      case 'sub_user':
        return <UserCog className="h-4 w-4" />;
      case 'client':
        return <Briefcase className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">CA Platform</h2>
              <p className="text-xs text-sidebar-foreground/60">Management System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs px-4 mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin' || item.url === '/ca' || item.url === '/staff' || item.url === '/client'}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                {getRoleIcon()}
                <span>{getRoleLabel()}</span>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

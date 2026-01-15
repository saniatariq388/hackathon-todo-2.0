'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BarChart3, Settings, Bell, Plus, User, LogOut } from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const sidebarItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/tasks', icon: Plus, label: 'Tasks' },
    { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        }
      }
    });
  };

  return (
    <aside className="hidden md:block w-64 bg-card border-r border-border h-full min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">TaskFlow</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your tasks</p>
      </div>
      
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-4 py-6 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {session?.user?.name || session?.user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
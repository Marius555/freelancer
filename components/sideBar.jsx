'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  ListChecks,
  Users,
  Timer,
  BarChart2,
  Gift,
  ReceiptText,
  Settings,
  Plus,
} from 'lucide-react';
import { cn } from '@heroui/theme';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: LayoutGrid, badge: <Plus className="h-4 w-4" /> },
  { name: 'Tasks', href: '/tasks', icon: ListChecks, badge: <Plus className="h-4 w-4" /> },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Tracker', href: '/tracker', icon: Timer, badge: <span className="ml-2 rounded-full bg-gray-700 px-2 py-0.5 text-xs text-white">New</span> },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Perks', href: '/perks', icon: Gift, badge: <span className="ml-2 rounded-full bg-gray-700 px-2 py-0.5 text-xs text-white">3</span> },
  { name: 'Expenses', href: '/expenses', icon: ReceiptText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-[#10111a] to-[#151624] py-8 flex flex-col">
      <nav className="flex flex-col gap-2 mt-2 px-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between group',
                'px-4 py-3 text-base font-medium',
                'transition-colors duration-200',
                isActive
                  ? 'bg-[#23232e] text-white rounded-2xl shadow-sm'
                  : 'text-gray-300 hover:bg-primary-100 hover:text-white rounded-2xl'
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </span>
              {item.badge && (
                <span className="flex items-center">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

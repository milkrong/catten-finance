'use client';

import { useState } from 'react';
import { NavButton } from './NavButton';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from 'react-use';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    href: '/',
  },
  {
    label: 'Transactions',
    href: '/transactions',
  },
  {
    label: 'Accounts',
    href: '/accounts',
  },
  {
    label: 'Categories',
    href: '/categories',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMedia('(max-width: 1024px)', false);
  const pathname = usePathname();

  const handleClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 text-white  transition"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                className="w-full justify-start"
                key={route.label}
                variant={route.href === pathname ? 'secondary' : 'ghost'}
                onClick={() => handleClick(route.href)}
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto ">
      {routes.map((route) => (
        <NavButton
          key={route.label}
          href={route.href}
          label={route.label}
          isActive={route.href === pathname}
        />
      ))}
    </nav>
  );
};

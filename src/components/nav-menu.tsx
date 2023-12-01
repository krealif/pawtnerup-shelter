'use client';

import { usePathname } from 'next/navigation';
import { NavLink } from '@mantine/core';

import { NavMenuItem } from '@/types';
import { Icons } from '@/components/icons';
import { Link } from '@/lib/router-events';

interface NavMenuProps {
  items: NavMenuItem[];
}

export default function NavMenu({ items }: NavMenuProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return items.map((item, index) => {
    const Icon = Icons[item.icon || 'arrowRight'];
    return (
      <NavLink
        component={Link}
        key={index}
        href={item.href}
        aria-label={item.title}
        label={item.title}
        active={path.startsWith(item.href)}
        leftSection={<Icon size="1.25rem" />}
      />
    );
  });
}

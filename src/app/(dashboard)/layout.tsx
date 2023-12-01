'use client';

import { notFound } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Grid } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';

import Logos from '@/components/logos';
import NavMenu from '@/components/nav-menu';
import { NavMenuItems } from '@/config/dashboard';
import ProfileMenu from '@/components/profile-menu';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { data: session } = useSession();

  const user = session?.user;

  if (!user) {
    return signIn();
  }

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 256, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logos.pawtnerup />
          <ProfileMenu
            user={{
              name: user.name,
              email: user.email,
              picture: user.picture,
            }}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavMenu items={NavMenuItems} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Grid gutter="md" style={{ overflow: 'unset' }}>
          {children}
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
}

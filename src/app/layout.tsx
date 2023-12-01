import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import { theme, poppins } from '@/theme';
import { HandleOnComplete } from '@/lib/router-events';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: {
    default: 'PawtnerUp',
    template: '%s - PawtnerUp',
  },
  description: 'Manage your PawtnerUp shelter',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={poppins.className}>
        <MantineProvider theme={theme}>
          <NavigationProgress color="sunset" />
          <Notifications limit={5} position="top-right" />
          <SessionProvider session={session}>{children}</SessionProvider>
        </MantineProvider>
        <HandleOnComplete />
      </body>
    </html>
  );
}

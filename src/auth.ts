import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { parseJWT } from './lib/utils';
import { User } from './types';
import AsyncLock from 'async-lock';

export async function refreshToken(token: any) {
  const lock = new AsyncLock({ maxPending: 0 });
  return await lock
    .acquire('key1', async function () {
      const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/shelter/refresh-token`;
      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: token.user.refresh_token,
        }),
        next: {
          revalidate: 3600,
        },
      });

      if (!refreshResponse.ok) {
        return token;
      }

      const user = await refreshResponse.json();
      return user;
    })
    .then(async function (user: any) {
      token.user.access_token = user.data.access_token;
      token.user.refresh_token = user.data.refresh_token;
      return token;
    })
    .catch(function (err) {});
}

async function checkRegisterStatus(token: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/shelters/me`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Error 404: Not Found
  if (res.status == 500) {
    return false;
  }
  return true;
}

// Auth.js Configuration
export const authConfig = {
  session: {
    maxAge: 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/shelter/oauth2callback`;
        const authResponse = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        if (!authResponse.ok) {
          return null;
        }
        const res = await authResponse.json();

        const user: User = {
          name: res.data.name,
          email: res.data.email,
          picture: res.data.picture,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        };

        // Check if the user has filled the shelter data (registered)
        const isRegistered = await checkRegisterStatus(user.access_token);

        if (!isRegistered) {
          user.onboarding = true;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user?.email) {
        token.user = user;
      }

      if (trigger === 'update' && session?.user) {
        token.user = session?.user;
      }

      const parsedToken = parseJWT(token.user.access_token);
      const dateNowInSeconds = new Date().getTime() / 1000;

      if (dateNowInSeconds < parsedToken.exp) {
        return token;
      }
      return refreshToken(token);
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname == '/';
      const isOnboardingPage = nextUrl.pathname == '/onboarding';

      // prevent access login page if authenticated
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/dogs', nextUrl));
        return false;
      }

      if (isLoggedIn) {
        if (auth.user.onboarding && !isOnboardingPage) {
          return Response.redirect(new URL('/onboarding', nextUrl));
        } else if (!auth.user.onboarding && isOnboardingPage) {
          return Response.redirect(new URL('/dogs', nextUrl));
        }
      }

      if (!isLoggedIn) {
        let path = nextUrl.pathname;
        if (nextUrl.search) {
          path += nextUrl.search;
        }
        return Response.redirect(
          new URL(`/?continue=${encodeURIComponent(path)}`, nextUrl)
        );
      }
      return true;
    },
  },
  pages: {
    signIn: '/',
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

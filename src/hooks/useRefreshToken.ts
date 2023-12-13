'use client';

import axios from '@/lib/axios';
import { signIn, signOut, useSession } from 'next-auth/react';

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    try {
      const refreshUrl = `/auth/shelter/refresh-token`;
      const res = await axios.post(refreshUrl, {
        refresh_token: session?.user.refresh_token,
      });
      if (session) {
        const access_token = res.data.data.access_token;
        await update({
          user: { ...session.user, access_token },
        });
        return access_token;
      } else signIn();
    } catch (error) {
      signOut();
    }
  };
  return refreshToken;
};

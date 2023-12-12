'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import { Icons } from '../icons';
import { authenticate } from '@/lib/actions';

export default function UserAuthForm() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
    >
      <GoogleButton />
    </GoogleOAuthProvider>
  );
}

function GoogleButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        await authenticate(
          codeResponse,
          searchParams?.get('continue') || '/dogs'
        );
      } catch (err) {
        notifications.show({
          title: `Oops!`,
          message: 'Login failed due to an unspecified error.',
          color: 'red',
        });
        setIsLoading(false);
      }
    },
    onNonOAuthError: (nonOAuthError) => {
      if (nonOAuthError.type === 'popup_failed_to_open') {
        notifications.show({
          title: `Oops!`,
          message: 'Pop up failed to open.',
          color: 'red',
        });
      }
      setIsLoading(false);
    },
    onError: (errorResponse) => {
      notifications.show({
        title: `Oops!`,
        message: errorResponse.error_description,
        color: 'red',
      });
      setIsLoading(false);
    },
    flow: 'auth-code',
  });

  return (
    <Button
      variant="filled"
      disabled={isLoading}
      leftSection={
        isLoading ? (
          <Loader size={20} color="gray" />
        ) : (
          <Icons.google size={20} />
        )
      }
      onClick={() => {
        login();
        setIsLoading(true);
      }}
    >
      Continue with Google
    </Button>
  );
}

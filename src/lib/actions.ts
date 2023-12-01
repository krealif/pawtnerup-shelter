'use server';
import { signIn, signOut } from '@/auth';
import { CodeResponse } from '@react-oauth/google';

export async function authenticate(codeResponse: CodeResponse, path: string) {
  try {
    await signIn('credentials', {
      ...codeResponse,
      redirectTo: path,
    });
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return false;
    }
    throw error;
  }
}

export async function logOut() {
  await signOut();
}

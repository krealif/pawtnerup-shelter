'use server';
import { signIn, signOut } from '@/auth';
import { CodeResponse } from '@react-oauth/google';

export async function authenticate(codeResponse: CodeResponse, path: string) {
  await signIn('credentials', {
    ...codeResponse,
    redirectTo: path,
  });
}

export async function logOut() {
  await signOut();
}

import NextAuth from 'next-auth';
import { User as UserType } from '.';

declare module 'next-auth' {
  interface User {
    id?: string;
  }
  interface Session {
    user: UserType;
  }
}

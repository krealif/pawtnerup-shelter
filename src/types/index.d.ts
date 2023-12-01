import { Icons } from '@/components/icons';

export type NavMenuItem = {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
};

export type BreadcrumbItem = {
  title: string;
  href: string;
};

export type User = {
  name: string;
  email: string;
  picture: string;
  onboarding?: boolean;
  access_token: string;
  refresh_token: string;
};

interface ApiResponse<T> {
  data: T;
}

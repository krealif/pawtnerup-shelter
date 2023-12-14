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

export type NavTabsItem = {
  title: string;
  href?: string;
};

export type User = {
  name: string;
  email: string;
  picture: string;
  onboarding?: boolean;
  access_token: string;
  refresh_token: string;
};

export type Breed = {
  id: number;
  name: string;
};

interface ApiResponse<T> {
  data: T;
}

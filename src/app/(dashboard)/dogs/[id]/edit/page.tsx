import { Metadata } from 'next';

import Linkcrumbs from '@/components/linkcrumbs';
import { BreadcrumbItem } from '@/types';
import EditDog from './edit-dog';

export const metadata: Metadata = {
  title: 'Edit Dog',
};

const items: BreadcrumbItem[] = [
  { title: 'Dogs', href: '/dogs' },
  { title: 'Edit Dog', href: '#' },
];

interface EditDogPageProps {
  params: {
    id: string;
  };
}

export default function EditDogPage({ params }: EditDogPageProps) {
  return (
    <>
      <Linkcrumbs items={items} />
      <EditDog dogId={params.id} />
    </>
  );
}

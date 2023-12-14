import { Metadata } from 'next';
import { Grid, GridCol, Card } from '@mantine/core';

import Linkcrumbs from '@/components/linkcrumbs';
import { BreadcrumbItem } from '@/types';
import AddDogForm from '@/components/dog/add-dog-form';

export const metadata: Metadata = {
  title: 'Add Dog',
};

const items: BreadcrumbItem[] = [
  { title: 'Dogs', href: '/dogs' },
  { title: 'Add Dog', href: '#' },
];

export default function AddDogPage() {
  return (
    <>
      <Linkcrumbs items={items} />
      <Grid gutter="md">
        <GridCol span={{ base: 12, md: 6 }}>
          <Card withBorder>
            <AddDogForm />
          </Card>
        </GridCol>
      </Grid>
    </>
  );
}

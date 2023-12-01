import { Metadata } from 'next';
import { Button, Group, Title, GridCol } from '@mantine/core';

import { Icons } from '@/components/icons';
import { Link } from '@/lib/router-events';

export const metadata: Metadata = {
  title: 'Dogs',
};

export default function DogsPage() {
  return (
    <>
      <GridCol span={12}>
        <Group justify="space-between">
          <Title order={1} size="h2">
            Dogs
          </Title>
          <Button component={Link} href="/dogs/add" leftSection={<Icons.add />}>
            Add Dog
          </Button>
        </Group>
      </GridCol>
    </>
  );
}

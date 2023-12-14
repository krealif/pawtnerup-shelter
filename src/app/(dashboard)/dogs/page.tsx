import { Metadata } from 'next';
import { Grid, GridCol, Button, Group, Title } from '@mantine/core';

import { Icons } from '@/components/icons';
import { Link } from '@/lib/router-events';
import DogTable from '@/components/dog/data-table';

export const metadata: Metadata = {
  title: 'Dogs',
};

export default function DogsPage() {
  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={1} size="h2">
          Dogs
        </Title>
        <Button component={Link} href="/dogs/add" leftSection={<Icons.add />}>
          Add Dog
        </Button>
      </Group>
      <Grid gutter="md">
        <GridCol span={12}>
          <DogTable />
        </GridCol>
      </Grid>
    </>
  );
}

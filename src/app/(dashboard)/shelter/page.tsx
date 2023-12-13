import { Metadata } from 'next';
import { Grid, GridCol, Card, Group, Title, Text, Stack } from '@mantine/core';
import camelcaseKeys from 'camelcase-keys';

import axios from '@/lib/axios';
import { auth } from '@/auth';
import { ApiResponse } from '@/types';
import { Shelter } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Shelter',
};

export const revalidate = 0;

export default async function ShelterPage() {
  const session = await auth();
  const res = await axios.get<ApiResponse<Shelter>>('/shelters/me', {
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  const shelter = camelcaseKeys(res.data.data);
  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={1} size="h2">
          Shelter
        </Title>
      </Group>
      <Grid gutter="md">
        <GridCol span={{ base: 12, md: 6 }}>
          <Card withBorder>
            <Stack>
              <div>
                <Title order={2} size="h6">
                  Name
                </Title>
                <Text>{shelter.name}</Text>
              </div>
              <div>
                <Title order={2} size="h6">
                  Contact Email
                </Title>
                <Text>{shelter.contactEmail}</Text>
              </div>
              <div>
                <Title order={2} size="h6">
                  Address
                </Title>
                <Text>{shelter.address}</Text>
              </div>
              <div>
                <Title order={2} size="h6">
                  Phone Number
                </Title>
                <Text>{shelter.phoneNumber.split(':')[1]}</Text>
              </div>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </>
  );
}

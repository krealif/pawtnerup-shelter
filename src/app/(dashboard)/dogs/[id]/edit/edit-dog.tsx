'use client';
import dynamic from 'next/dynamic';
import { Grid, GridCol, Tabs, Card } from '@mantine/core';
import camelcaseKeys from 'camelcase-keys';
import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/types';
import EditDogForm from '@/components/dog/edit-dog-form';
import { Dog } from '@/lib/schemas';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { Icons } from '@/components/icons';

const EditDogMedia = dynamic(() => import('@/components/dog/edit-dog-media'));

function useGetDog(dogId: string) {
  const axiosAuth = useAxiosAuth();

  return useQuery<Dog>({
    queryKey: ['dog', dogId],
    queryFn: () =>
      axiosAuth.get<ApiResponse<Dog>>(`/shelters/pets/${dogId}`).then((res) => {
        const dog = camelcaseKeys(res.data.data);
        return dog;
      }),
    throwOnError: true,
  });
}

export default function EditDog({ dogId }: { dogId: string }) {
  const { data: fetchedDog, isFetching: isFetchingDog } = useGetDog(dogId);

  return (
    <Tabs defaultValue="data" variant="pills">
      <Tabs.List mb="md">
        <Tabs.Tab value="data" leftSection={<Icons.fileText size={12} />}>
          Data
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          disabled={isFetchingDog}
          leftSection={<Icons.image size={12} />}
        >
          Media
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="data">
        <Grid gutter="md">
          <GridCol span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <EditDogForm dog={fetchedDog} isFetching={isFetchingDog} />
            </Card>
          </GridCol>
        </Grid>
      </Tabs.Panel>
      <Tabs.Panel value="messages">
        <EditDogMedia dog={fetchedDog} />
      </Tabs.Panel>
    </Tabs>
  );
}

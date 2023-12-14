import { Metadata } from 'next';
import {
  Grid,
  GridCol,
  SimpleGrid,
  Card,
  Stack,
  Title,
  Text,
  Badge,
  BackgroundImage,
} from '@mantine/core';
import camelcaseKeys from 'camelcase-keys';
import { notFound } from 'next/navigation';

import Linkcrumbs from '@/components/linkcrumbs';
import { ApiResponse, BreadcrumbItem } from '@/types';
import { auth } from '@/auth';
import { Dog } from '@/lib/schemas';

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

const breadcrumbItem: BreadcrumbItem[] = [
  { title: 'Dogs', href: '/dogs' },
  { title: '', href: '#' },
];

interface DetailDogPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: DetailDogPageProps): Promise<Metadata> {
  const dog = await getDog(params.id);
  return {
    title: dog.name,
  };
}

async function getDog(dogId: string) {
  const session = await auth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/shelters/pets/${dogId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  const { data }: ApiResponse<Dog> = await res.json();

  if (res.status === 404) {
    return notFound();
  }

  const dog = camelcaseKeys(data);
  return dog;
}

export default async function DetailDogPage({ params }: DetailDogPageProps) {
  const dog = await getDog(params.id);

  if (!breadcrumbItem[1].title) {
    breadcrumbItem[1].title = dog.name;
  }

  const media = dog.media.map((url: string, i: number) => (
    <BackgroundImage h="128" w="100%" radius="md" src={url} key={i} />
  ));

  return (
    <>
      <Linkcrumbs items={breadcrumbItem} />
      <Grid gutter="md">
        <GridCol span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Stack>
              <div>
                <Title order={2} size="h6">
                  Breed
                </Title>
                <Text>{dog.breed}</Text>
              </div>
              <div>
                <Title order={2} size="h6">
                  Sex
                </Title>
                <Badge
                  variant="outline"
                  size="lg"
                  color={dog.gender === 'MALE' ? 'blue' : 'red'}
                >
                  {dog.gender}
                </Badge>
              </div>
              <div>
                <Title order={2} size="h6">
                  Age
                </Title>
                <Text>{dog.estimateAge} year(s) old</Text>
              </div>
              <div>
                <Title order={2} size="h6">
                  Sterilization Status
                </Title>
                <Badge variant="default" size="lg">
                  {dog.sterilizationStatus}
                </Badge>
              </div>
            </Stack>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <Card withBorder>
            <Title order={2} size="h6" mb="xs">
              Rescue Story
            </Title>
            <Text>{dog.rescueStory}</Text>
          </Card>
        </GridCol>
      </Grid>
      <Title order={2} size="h3" my="md">
        Photos
      </Title>
      <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }}>{media}</SimpleGrid>
    </>
  );
}

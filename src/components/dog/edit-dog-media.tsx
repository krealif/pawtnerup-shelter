'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Loader,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import MediaItem from '@/components/media-item';
import DropzoneImageUpload from '@/components/dropzone-image-upload';
import { useUncontrolled } from '@mantine/hooks';
import { Dog } from '@/lib/schemas';
import { axiosAuth } from '@/lib/axios';
import camelcaseKeys from 'camelcase-keys';
import { ApiResponse } from '@/types';

const dogMediaSchema = z.object({
  media: z.any(),
  deletedMedia: z.string().array(),
});

type DogMedia = z.infer<typeof dogMediaSchema>;

interface EditDogMediaProps {
  dog: Dog | undefined;
}

type EditDog = {
  pet: Dog;
  postMediaUrls: string[];
};

export default function EditDogMedia({ dog }: EditDogMediaProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<DogMedia>({
    validate: zodResolver(dogMediaSchema),
    initialValues: {
      media: [],
      deletedMedia: [],
    },
  });

  async function handleSubmit(values: DogMedia) {
    setIsLoading(true);
    const currentMedia = dog?.media.map((url: string) => {
      let type;
      if (values.deletedMedia.includes(url)) {
        type = 'DELETE';
      } else {
        type = 'DO_NOTHING';
      }
      return {
        type,
        filename: url.split('/').slice(2)[2],
      };
    });

    const uploadMedia = values.media.map((file: File) => ({
      type: 'ADD',
      filename: file.name,
    }));

    const media = [...(currentMedia || []), ...(uploadMedia || [])];

    try {
      const res = await axiosAuth.put<ApiResponse<EditDog>>(
        `/shelters/pets/${dog?.id}/media`,
        {
          media,
        }
      );
      const data = camelcaseKeys(res.data.data);

      const postMediaUrls = data.postMediaUrls.slice(currentMedia.length);

      if (postMediaUrls.length > 0) {
        const upload = postMediaUrls.map((presignedUrl, index) => {
          const formData = new FormData();
          formData.append('file', values.media[index]);
          return axios.post(presignedUrl, formData, {
            headers: {
              'x-goog-content-length-range': '0,104857600',
              'Content-Type': 'application/octet-stream',
            },
          });
        });

        Promise.allSettled(upload).then((results) =>
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              notifications.show({
                title: `Oops!`,
                message: `Error upload file with name ${values.media[index]}`,
                color: 'red',
              });
            }
          })
        );
      }
      router.push('/dogs');
      notifications.show({
        title: `Success`,
        message: 'Data saved successfully.',
        color: 'green',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        notifications.show({
          title: `Oops!`,
          message: error.message,
          color: 'red',
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <Grid gutter="md">
      <GridCol span={{ base: 12, md: 6 }}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder>
            <Title order={2} size="h4" mb="md">
              Add Photo
            </Title>
            <DropzoneImageUpload {...form.getInputProps('media')} />
            <Divider my="md" labelPosition="left" />
            <Title order={2} size="h4" mb="md">
              Photos
            </Title>
            {dog && (
              <MediaGroup
                media={dog.media}
                {...form.getInputProps('deletedMedia')}
              />
            )}
            <Box mt="md">
              <Button
                type="submit"
                disabled={!form.isDirty() || isLoading}
                leftSection={isLoading && <Loader size={20} color="gray" />}
              >
                Save
              </Button>
            </Box>
          </Card>
        </form>
      </GridCol>
    </Grid>
  );
}

interface MediaGroupProps {
  media: string[];
  value?: string[];
  onChange?: (value: string[] | null) => void;
}

function MediaGroup(props: MediaGroupProps) {
  const { media, value, onChange } = props;

  const [selectedMedia, setSelectedMedia] = useUncontrolled<string[]>({
    value,
    onChange,
  });

  function onCheck(checked: boolean, value: string) {
    if (!checked) {
      setSelectedMedia([...selectedMedia, value]);
    } else {
      const newMedia = selectedMedia.filter((photo) => {
        return photo !== value;
      });
      setSelectedMedia(newMedia);
    }
  }

  const mediaItem = media.map((url, index) => {
    return <MediaItem src={url} key={index} onCheck={onCheck} />;
  });

  return <SimpleGrid cols={{ base: 2, xs: 4, md: 3 }}>{mediaItem}</SimpleGrid>;
}

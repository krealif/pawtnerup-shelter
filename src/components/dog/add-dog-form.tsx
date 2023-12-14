'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm, zodResolver } from '@mantine/form';
import {
  TextInput,
  NumberInput,
  Select,
  Radio,
  Textarea,
  Button,
  Stack,
  Loader,
  Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import { Dog, dogSchema } from '@/lib/schemas';
import DogBreedSelect from './dog-breed-select';
import DropzoneImageUpload from '../dropzone-image-upload';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { ApiResponse } from '@/types';

type AddDog = {
  pet: Dog;
  postMediaUrls: string[];
};

export default function AddDogForm() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<Dog>({
    validate: zodResolver(dogSchema),
    initialValues: {
      name: '',
      gender: 'MALE',
      breed: '',
      estimateAge: 1,
      sterilizationStatus: 'NEUTERED',
      rescueStory: '',
      media: [],
    },
  });

  async function handleSubmit(values: Dog) {
    setIsLoading(true);
    const body = snakecaseKeys(values);
    const media = values.media.map((file: File) => file.name);
    try {
      const res = await axiosAuth.post<ApiResponse<AddDog>>('/shelters/pets', {
        ...body,
        media,
      });
      const data = camelcaseKeys(res.data.data);

      const upload = data.postMediaUrls.map((presignedUrl, index) => {
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
              message: `Error upload file with name ${media[index]}`,
              color: 'red',
            });
          }
        })
      );
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <TextInput
          withAsterisk
          label="Name"
          placeholder="e.g., Rocky"
          {...form.getInputProps('name')}
        />
        <DogBreedSelect
          withAsterisk
          label="Breed"
          placeholder="e.g., Husky"
          {...form.getInputProps('breed')}
        />
        <Radio.Group withAsterisk label="Sex" {...form.getInputProps('gender')}>
          <Group mt="xs">
            <Radio value="MALE" label="Male" />
            <Radio value="FEMALE" label="Female" />
          </Group>
        </Radio.Group>
        <NumberInput
          withAsterisk
          label="Approx. Age"
          placeholder="4"
          {...form.getInputProps('estimateAge')}
        />
        <Select
          withAsterisk
          label="Sterilization Status"
          placeholder="e.g., Vaccinated"
          allowDeselect={false}
          data={[
            { value: 'VACCINATED', label: 'Vaccinated' },
            { value: 'NOT_STERILIZED', label: 'Not Sterilized' },
            { value: 'NEUTERED', label: 'Neutered' },
            { value: 'SPAYED', label: 'Spayed' },
          ]}
          {...form.getInputProps('sterilizationStatus')}
        />
        <Textarea
          withAsterisk
          label="Rescue Story"
          placeholder="Write story here"
          autosize
          minRows={2}
          {...form.getInputProps('rescueStory')}
        />
        <DropzoneImageUpload
          withAsterisk
          label="Photos"
          {...form.getInputProps('media')}
        />
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            leftSection={isLoading && <Loader size={20} color="gray" />}
          >
            Save
          </Button>
        </div>
      </Stack>
    </form>
  );
}

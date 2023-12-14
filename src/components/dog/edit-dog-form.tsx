'use client';

import { useEffect, useState } from 'react';
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
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import snakecaseKeys from 'snakecase-keys';

import { Dog, dogSchema } from '@/lib/schemas';
import DogBreedSelect from './dog-breed-select';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { ApiResponse } from '@/types';

type EditDog = {
  pet: Dog;
  postMediaUrls: string[];
};

interface EditDogFormProps {
  dog: Dog | undefined;
  isFetching: boolean;
}

export default function EditDogForm({ dog, isFetching }: EditDogFormProps) {
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
    },
  });

  useEffect(() => {
    if (dog) {
      form.setValues(dog);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dog]);

  async function handleSubmit(values: Dog) {
    setIsLoading(true);
    const body = snakecaseKeys(values);
    try {
      const res = await axiosAuth.put<ApiResponse<EditDog>>(
        `/shelters/pets/${dog?.id}`,
        {
          ...body,
        }
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
      <LoadingOverlay visible={isFetching} />
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

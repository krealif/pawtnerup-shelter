'use client';

import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import snakecaseKeys from 'snakecase-keys';
import { notifications } from '@mantine/notifications';
import { TextInput, Button, Stack, Loader } from '@mantine/core';

import { Shelter, shelterSchema } from '@/lib/schemas';
import useAxiosAuth from '@/hooks/useAxiosAuth';

export default function ShelterOnboardingForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const axiosAuth = useAxiosAuth();
  const form = useForm<Shelter>({
    validate: zodResolver(shelterSchema),
    initialValues: {
      name: '',
      address: '',
      contactEmail: '',
      phoneNumber: '',
    },
  });

  async function handleSubmit(values: Shelter) {
    setIsLoading(true);
    try {
      const res = await axiosAuth.post('/shelters', snakecaseKeys(values));
      if (session && res.status == 200) {
        await update({
          user: { ...session.user, onboarding: false },
        });
        router.replace('/dogs');
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === 422) {
          notifications.show({
            title: `Failed to submit form`,
            message: 'Please fill in the required fields.',
            color: 'red',
          });
        } else {
          notifications.show({
            title: `Oops!`,
            message:
              'Failed to submit form due to unspecified error. Please logout and login again',
            color: 'red',
          });
        }
        setIsLoading(false);
      }
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <TextInput
          withAsterisk
          label="Name"
          placeholder="e.g., Animal House Rescue"
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          label="Address"
          placeholder="e.g., Gg. Harum No.11C, Sanur, Denpasar"
          {...form.getInputProps('address')}
        />
        <TextInput
          withAsterisk
          label="Contact Email"
          placeholder="e.g., shelter@email.com"
          {...form.getInputProps('contactEmail')}
        />
        <TextInput
          withAsterisk
          label="Phone Number"
          placeholder="e.g., +6281XXXXXXX"
          {...form.getInputProps('phoneNumber')}
        />
        <Button
          type="submit"
          disabled={isLoading}
          leftSection={isLoading && <Loader size={20} color="gray" />}
        >
          Continue
        </Button>
      </Stack>
    </form>
  );
}

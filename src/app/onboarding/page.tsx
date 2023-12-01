import { Metadata } from 'next';
import {
  Container,
  Stack,
  Title,
  Text,
  Divider,
  Group,
  Button,
} from '@mantine/core';

import Logos from '@/components/logos';
import ShelterOnboardingForm from '@/components/forms/shelter-onboarding-form';
import { signOut } from '@/auth';

export const metadata: Metadata = {
  title: 'Onboarding',
};

export default function HomePage() {
  return (
    <Container py="lg" size="28rem">
      <Stack gap="lg">
        <header>
          <Group justify="space-between">
            <Logos.pawtnerupIcon w="36" h="36" />
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button type="submit" variant="outline" size="xs">
                Log Out
              </Button>
            </form>
          </Group>
          <Title order={1} size="h3" mt="sm">
            Shelter Detail
          </Title>
          <Text c="dimmed">
            Please fill out the form to complete registration
          </Text>
        </header>
        <Divider />
        <ShelterOnboardingForm />
      </Stack>
    </Container>
  );
}

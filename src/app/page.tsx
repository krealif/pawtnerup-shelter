import { Container, Stack, Title, Text, Divider } from '@mantine/core';

import Logos from '@/components/logos';
import UserAuthForm from '@/components/shelter/user-auth-form';

export default function HomePage() {
  return (
    <Container py="lg" size="28rem">
      <Stack gap="lg">
        <header>
          <Logos.pawtnerupIcon w="36" h="36" />
          <Title order={1} size="h3" mt="sm">
            Welcome to PawtnerUp
          </Title>
          <Text c="dimmed">Please login to acces your dashboard</Text>
        </header>
        <Divider />
        <UserAuthForm />
      </Stack>
    </Container>
  );
}

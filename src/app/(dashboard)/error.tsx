'use client';

import { Button, Container, Stack, Text, Title } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container>
      <Stack align="center" mt="md">
        <Title order={1} size="h2">
          Something went wrong!
        </Title>
        <Text>{`${error.name}: ${error.message}`}</Text>
        <Button onClick={() => reset()}>Try again</Button>
      </Stack>
    </Container>
  );
}

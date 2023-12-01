'use client';

import { Button, Container, Text, Title } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container>
      <Title order={1} size="h2" mt="md">
        Something went wrong!
      </Title>
      <Text>{`${error.name}: ${error.message}`}</Text>
      <Button onClick={() => reset()}>Try again</Button>
    </Container>
  );
}

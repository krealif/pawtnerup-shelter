'use client';
import {
  Group,
  Text,
  InputLabel,
  InputWrapper,
  Box,
  InputError,
  Stack,
  Card,
  Image,
  SimpleGrid,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useUncontrolled } from '@mantine/hooks';

interface DropzoneUpload {
  withAsterisk?: boolean;
  label?: string;
  value?: FileWithPath[];
  error?: React.ReactNode;
  onChange?: (value: FileWithPath[] | null) => void;
}

export default function DropzoneImageUpload(props: DropzoneUpload) {
  const { withAsterisk, label, value, error, onChange } = props;
  const [files, setFiles] = useUncontrolled<FileWithPath[]>({
    value,
    defaultValue: [],
    onChange,
  });

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        alt={file.name}
      />
    );
  });

  return (
    <InputWrapper>
      {label && <InputLabel required={withAsterisk}>{label}</InputLabel>}
      <Dropzone
        bg={error ? 'red.1' : ''}
        onDrop={(val) => {
          setFiles(val);
        }}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={4 * 1024 ** 2}
        maxFiles={5}
        accept={IMAGE_MIME_TYPE}
      >
        <Box ta="left">
          <Group gap={6}>
            <Text inline size="sm">
              Drop photos here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline>
              Upload up to 5 files, each file should not exceed 4 MB.
            </Text>
          </Group>
        </Box>
      </Dropzone>
      {error && <InputError mt={6}>{error}</InputError>}
      {previews.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 4 }} mt="md">
          {previews}
        </SimpleGrid>
      )}
    </InputWrapper>
  );
}

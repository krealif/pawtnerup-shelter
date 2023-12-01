import { Avatar, Menu, Box, Text } from '@mantine/core';

import { Icons } from './icons';
import { logOut } from '@/lib/actions';
import { User } from '@/types';

interface ProfileMenuProps {
  user: Pick<User, 'name' | 'email' | 'picture'>;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <Menu shadow="md" width={208}>
      <Menu.Target>
        <Avatar
          component="button"
          size="32"
          color="sunset"
          src={user.picture}
          imageProps={{ referrerPolicy: 'no-referrer' }}
          alt={user.name}
          style={{ cursor: 'pointer' }}
        >
          US
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Box p="xs">
          <Text size="sm" fw={500} truncate="end">
            {user.name}
          </Text>
          <Text c="dimmed" size="xs" truncate="end">
            {user.email}
          </Text>
        </Box>
        <Menu.Divider />
        <form action={logOut}>
          <Menu.Item type="submit" leftSection={<Icons.logout size={16} />}>
            Log Out
          </Menu.Item>
        </form>
      </Menu.Dropdown>
    </Menu>
  );
}

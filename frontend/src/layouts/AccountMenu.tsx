import { Avatar, Button, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { ROLE_LABELS } from '../auth/roles'

function AccountMenu() {
  const { status, user, logout } = useAuth()
  const navigate = useNavigate()

  // Nothing until the login state is known, so "Prijava" never flashes for a logged-in user.
  if (status === 'loading') return null

  if (!user) {
    return (
      <Button component={Link} to="/prijava" variant="default">
        Prijava
      </Button>
    )
  }

  const onLogout = async () => {
    try {
      await logout()
    } catch (err) {
      // The browser state is cleared anyway (AuthProvider).
      console.error(err)
    }
    navigate('/')
  }

  return (
    <Menu position="bottom-end" width={200}>
      <Menu.Target>
        <UnstyledButton aria-label="Izbornik računa">
          <Group gap="xs" wrap="nowrap">
            <Text size="sm" fw={500} visibleFrom="sm" truncate maw={180}>
              {user.name}
            </Text>
            <Avatar name={user.name} color="initials" />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Text size="sm" fw={500} c="bright" truncate>
            {user.name}
          </Text>
          <Text size="xs">{ROLE_LABELS[user.role]}</Text>
        </Menu.Label>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={16} />} onClick={onLogout}>
          Odjava
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default AccountMenu

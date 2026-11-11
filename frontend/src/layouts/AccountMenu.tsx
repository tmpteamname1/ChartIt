import { Avatar, Button, Group, Menu, Select, Text, UnstyledButton } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import { TEST_LOGIN_ENABLED } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { ROLE_LABELS, ROLES, type Role } from '../auth/roles'

const VISITOR = 'POSJETITELJ'

// Temporary, until OAuth exists: also shown in a production build when VITE_ROLE_SWITCHER=true (render.yaml).
// Hidden when the real test login on /prijava is on, so there is only one way to log in.
const SHOW_ROLE_SWITCHER =
  (import.meta.env.DEV || import.meta.env.VITE_ROLE_SWITCHER === 'true') && !TEST_LOGIN_ENABLED

// Switch roles without logging in to check the menus and layouts.
function DevRoleSwitcher() {
  const { user, loginAs, logout } = useAuth()

  return (
    <Select
      size="xs"
      w={140}
      aria-label="Testna uloga"
      allowDeselect={false}
      value={user?.role ?? VISITOR}
      data={[
        { value: VISITOR, label: 'Posjetitelj' },
        ...ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
      ]}
      onChange={(value) => (value && value !== VISITOR ? loginAs(value as Role) : logout())}
    />
  )
}

function AccountMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Group gap="sm" wrap="nowrap">
      {SHOW_ROLE_SWITCHER && (
        <Group visibleFrom="sm">
          <DevRoleSwitcher />
        </Group>
      )}

      {user ? (
        <Menu position="bottom-end" width={200}>
          <Menu.Target>
            <UnstyledButton aria-label="Izbornik računa">
              <Avatar name={user.name} color="initials" />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <Text size="sm" fw={500} c="bright">
                {user.name}
              </Text>
              <Text size="xs">{ROLE_LABELS[user.role]}</Text>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Odjava
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Button component={Link} to="/prijava" variant="default">
          Prijava
        </Button>
      )}
    </Group>
  )
}

export default AccountMenu

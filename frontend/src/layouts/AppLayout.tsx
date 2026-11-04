import { Anchor, AppShell, Box, Burger, Button, Divider, Group, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSailboat } from '@tabler/icons-react'
import { Link, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import AccountMenu from './AccountMenu'
import { HEADER_LINKS, isActive, visibleFor, type NavItem } from './navigation'

// One shell for all four parts of the app: the public and user parts have only the header,
// the company panel and administration add a sidebar. On mobile everything moves behind the burger.
function AppLayout({ sidebar = [] }: { sidebar?: NavItem[] }) {
  const [opened, { toggle, close }] = useDisclosure()
  const { user } = useAuth()
  const { pathname } = useLocation()

  const headerLinks = visibleFor(HEADER_LINKS, user?.role)
  const sideLinks = visibleFor(sidebar, user?.role)

  const renderNavLinks = (items: NavItem[]) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        component={Link}
        to={item.to}
        label={item.label}
        leftSection={item.icon && <item.icon size={18} stroke={1.5} />}
        active={isActive(pathname, item.to)}
        onClick={close}
      />
    ))

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: sideLinks.length === 0 },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Izbornik" />
            <Anchor component={Link} to="/" underline="never" fw={700} fz="lg">
              <Group gap={6} wrap="nowrap">
                <IconSailboat size={24} stroke={1.5} />
                ChartIt
              </Group>
            </Anchor>
          </Group>

          <Group gap={4} visibleFrom="sm">
            {headerLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                variant={isActive(pathname, link.to) ? 'light' : 'subtle'}
              >
                {link.label}
              </Button>
            ))}
          </Group>

          <AccountMenu />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Box hiddenFrom="sm">
          {renderNavLinks(headerLinks)}
          {sideLinks.length > 0 && <Divider my="sm" />}
        </Box>
        {renderNavLinks(sideLinks)}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout

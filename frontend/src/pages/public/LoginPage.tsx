import { Select, Stack, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { getTestUsers, TEST_LOGIN_ENABLED, type TestUser } from '../../api/auth'
import { useAuth } from '../../auth/AuthContext'
import { HOME_BY_ROLE, ROLE_LABELS } from '../../auth/roles'

// Local development only (#49): log in as a seeded test user without OAuth.
function TestLoginSelect() {
  const { loginAsTestUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [users, setUsers] = useState<TestUser[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getTestUsers(controller.signal)
      .then((data) =>
        data.length
          ? setUsers(data)
          : setError('Nema testnih korisnika. Pokrenite python manage.py seed_test_users.'),
      )
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError('Testna prijava nije uključena na poslužitelju.')
        console.error(err)
      })
    return () => controller.abort()
  }, [])

  const onChange = async (username: string | null) => {
    if (!username) return
    try {
      const user = await loginAsTestUser(username)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? HOME_BY_ROLE[user.role], { replace: true })
    } catch (err) {
      setError('Prijava nije uspjela.')
      console.error(err)
    }
  }

  return (
    <Select
      w={320}
      label="Prijavi se kao..."
      placeholder="Testni korisnik"
      data={users.map((user) => ({
        value: user.username,
        label: `${user.name} (${ROLE_LABELS[user.role]})`,
      }))}
      error={error}
      onChange={onChange}
    />
  )
}

function LoginPage() {
  return (
    <Stack>
      <Title order={1}>Prijava</Title>
      {TEST_LOGIN_ENABLED && <TestLoginSelect />}
    </Stack>
  )
}

export default LoginPage

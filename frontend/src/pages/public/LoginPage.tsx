import { Alert, Button, Select, Stack, Title } from '@mantine/core'
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router'
import { getTestUsers, startGoogleLogin, TEST_LOGIN_ENABLED, type TestUser } from '../../api/auth'
import { useAuth } from '../../auth/AuthContext'
import { HOME_BY_ROLE, ROLE_LABELS } from '../../auth/roles'
import PageLoader from '../../components/PageLoader'

// Local development only (#49): log in as a seeded test user without OAuth.
// After the login LoginPage redirects, as it does for any logged-in user.
function TestLoginSelect() {
  const { loginAsTestUser } = useAuth()
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
      await loginAsTestUser(username)
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

// Codes the backend sends as /prijava?greska=<code> when the Google login fails
// (accounts/adapters.py). Users never see the technical cause.
const LOGIN_ERRORS = new Map([
  ['prijava_nije_uspjela', 'Prijava je prekinuta ili nije uspjela. Pokušajte ponovno.'],
  ['racun_deaktiviran', 'Vaš račun je deaktiviran. Obratite se administratoru.'],
])
const UNKNOWN_LOGIN_ERROR = 'Prijava nije uspjela. Pokušajte ponovno.'

function LoginPage() {
  const { status, user } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const errorCode = searchParams.get('greska')
  const errorMessage =
    errorCode === null ? null : (LOGIN_ERRORS.get(errorCode) ?? UNKNOWN_LOGIN_ERROR)
  // Set by RequireRole when a visitor opened a protected page.
  const from = (location.state as { from?: string } | null)?.from
  const [redirecting, setRedirecting] = useState(false)

  // Back from Google with the browser's back button: the page comes from the back-forward
  // cache with the button still loading.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setRedirecting(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  if (status === 'loading') return <PageLoader />
  // Already logged in, e.g. back from Google or /prijava opened by hand.
  if (user) return <Navigate to={from ?? HOME_BY_ROLE[user.role]} replace />

  return (
    <Stack align="flex-start">
      <Title order={1}>Prijava</Title>
      {errorMessage && (
        <Alert color="red" icon={<IconAlertCircle />} role="alert" maw={480}>
          {errorMessage}
        </Alert>
      )}
      {/* After an error this button is the retry. */}
      <Button
        leftSection={<IconBrandGoogle size={18} />}
        loading={redirecting}
        onClick={() => {
          setRedirecting(true)
          // Without a protected page to return to, the login page sends the user to their home.
          startGoogleLogin(from ?? '/prijava')
        }}
      >
        Prijava putem Googlea
      </Button>
      {TEST_LOGIN_ENABLED && <TestLoginSelect />}
    </Stack>
  )
}

export default LoginPage

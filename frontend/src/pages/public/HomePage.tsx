import { Title } from '@mantine/core'
import BackendStatus from '../../components/BackendStatus'

function HomePage() {
  return (
    <>
      <Title order={1}>Pretraživanje</Title>
      <BackendStatus />
    </>
  )
}

export default HomePage

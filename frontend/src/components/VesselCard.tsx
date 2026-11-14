import { Box, Card, Group, Stack, Text } from '@mantine/core'
import { IconSailboat } from '@tabler/icons-react'
import { useState } from 'react'
import type { VesselListItem } from '../api/catalog'
import { formatPrice } from '../utils/format'
import styles from './VesselCard.module.css'

interface VesselCardProps {
  vessel: VesselListItem
}

export function VesselCard({ vessel }: VesselCardProps) {
  // pamtimo ako se fotografija nije uspjela ucitati
  const [imageFailed, setImageFailed] = useState(false)

  // ako nema fotografije ili se nije ucitala onda zamjenski prikaz
  let imageToShow = vessel.thumbnail

  if (imageFailed) {
    imageToShow = null
  }

  return (
    <Card
      className={styles.card} //css klasa card
      component="article"
      padding="sm" //unudarnji razmak
      radius="md" //rubovi zaobljeni
      withBorder //prikazi obrub
    >
      <Box className={styles.media}>
        {imageToShow ? ( //provjera da li postoji slika
          <img
            src={imageToShow}
            alt={`Fotografija plovila ${vessel.name}`}
            className={styles.image}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div //ako ne postoji
            className={styles.placeholder}
            aria-label="Fotografija plovila nije dostupna"
          >
            <IconSailboat aria-hidden="true" size={38} stroke={1.4} />
            <Text size="xs">Fotografija nije dostupna</Text>
          </div>
        )}
      </Box>

      <Stack className={styles.content} gap="xs" mt="md">
        <div>
          <Text c="dimmed" size="xs">
            {vessel.category.name} · {vessel.home_port.name}
          </Text>

          <Text fw={700} mt={4} size="lg">
            {vessel.name}
          </Text>
        </div>

        <Text c="dimmed" size="sm">
          {' '}
          {/*naziv tvrtke  */}
          {vessel.company.name}
        </Text>

        <Group justify="space-between" mt="auto" wrap="nowrap">
          <Text size="sm">Do {vessel.max_people} osoba</Text>

          <Text fw={700} ta="right">
            {formatPrice(vessel.daily_price)}{' '}
            <Text c="dimmed" component="span" fw={400} size="xs">
              / dan
            </Text>
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}

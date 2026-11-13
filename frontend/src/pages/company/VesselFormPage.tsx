import {
  Alert,
  Box,
  Button,
  Fieldset,
  Group,
  Loader,
  NativeSelect,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type SubmitEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { catalogKeys, getCategories, getPorts } from '../../api/catalog'
import { ApiError } from '../../api/client'
import { companyKeys, createVessel, type VesselCreate } from '../../api/company'

const fleetPath = '/tvrtka/flota'
const maxSmallInteger = 32_767

function readVesselForm(form: HTMLFormElement) {
  const data = new FormData(form)
  const errors: Partial<Record<keyof VesselCreate, string>> = {}
  const read = (field: keyof VesselCreate) => String(data.get(field) ?? '').trim()

  function required(field: keyof VesselCreate) {
    const value = read(field)
    if (!value) errors[field] = 'Ovo je polje obavezno.'
    return value
  }

  function integer(field: keyof VesselCreate, min: number, max: number) {
    const value = required(field)
    const number = Number(value)
    if (value && (!/^\d+$/.test(value) || number < min || number > max)) {
      errors[field] = `Unesite cijeli broj od ${min} do ${max}.`
    }
    return number
  }

  function decimal(field: keyof VesselCreate, maxWholeDigits: number, allowZero: boolean) {
    const value = required(field)
    if (!value) return ''

    // Accept a Croatian decimal comma and keep the value as text all the way to the API.
    const [, sign, whole = '', fraction = ''] = /^([+-]?)(\d*)(?:[.,](\d{0,2}))?$/.exec(value) ?? []
    const digits = whole.replace(/^0+/, '') || '0'
    const cents = fraction.padEnd(2, '0')
    const isZero = digits === '0' && cents === '00'
    if (
      (!whole && !fraction) ||
      digits.length > maxWholeDigits ||
      (isZero ? !allowZero : sign === '-')
    ) {
      errors[field] = allowZero
        ? 'Unesite cijenu od 0 do 99999999,99 € s najviše dvije decimale.'
        : 'Unesite duljinu od 0,01 do 999,99 m s najviše dvije decimale.'
    }
    return `${digits}.${cents}`
  }

  const values: VesselCreate = {
    name: required('name'),
    category: Number(required('category')),
    home_port: Number(required('home_port')),
    length_m: decimal('length_m', 3, false),
    max_people: integer('max_people', 1, maxSmallInteger),
    cabins: integer('cabins', 0, maxSmallInteger),
    year_built: integer('year_built', 1900, new Date().getFullYear()),
    daily_price: decimal('daily_price', 8, true),
    description: read('description'),
    equipment: read('equipment'),
  }
  return { values, errors }
}

function NewVesselForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)
  const submitting = useRef(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof VesselCreate, string>>>({})
  const [formErrors, setFormErrors] = useState<string[]>([])
  const categories = useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: ({ signal }) => getCategories(signal),
  })
  const ports = useQuery({
    queryKey: catalogKeys.ports(),
    queryFn: ({ signal }) => getPorts(signal),
  })
  const { mutate, isPending } = useMutation({
    mutationFn: createVessel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
    onSettled: () => {
      submitting.current = false
    },
  })

  const loadingOptions = categories.isPending || ports.isPending
  const optionsError = categories.isError || ports.isError
  const optionsEmpty =
    !loadingOptions && !optionsError && (!categories.data?.length || !ports.data?.length)

  useEffect(() => {
    if (!isPending && Object.keys(fieldErrors).length > 0) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  }, [fieldErrors, isPending])

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || isPending || loadingOptions || optionsError || optionsEmpty) return

    const { values, errors } = readVesselForm(event.currentTarget)
    setFieldErrors(errors)
    setFormErrors([])
    if (Object.keys(errors).length > 0) return

    submitting.current = true
    mutate(values, {
      onSuccess: (vessel) => {
        void navigate(fleetPath, { replace: true, state: { createdVesselName: vessel.name } })
      },
      onError: (error) => {
        const fieldMessages: Partial<Record<keyof VesselCreate, string>> = {}
        const generalMessages: string[] = []
        if (error instanceof ApiError && error.status === 400) {
          for (const [field, messages] of Object.entries(error.errors ?? {})) {
            if (messages.length === 0) continue
            if (Object.hasOwn(values, field)) {
              fieldMessages[field as keyof VesselCreate] = messages.join(' ')
            } else {
              generalMessages.push(...messages)
            }
          }
          if (generalMessages.length === 0 && Object.keys(fieldMessages).length === 0) {
            generalMessages.push(error.message || 'Provjerite unesene podatke.')
          }
        } else {
          generalMessages.push('Plovilo nije moguće spremiti. Pokušajte ponovno.')
        }
        setFieldErrors(fieldMessages)
        setFormErrors(generalMessages)
      },
    })
  }

  return (
    <Stack maw={800}>
      <Title order={1}>Novo plovilo</Title>
      {loadingOptions && (
        <Group gap="xs" role="status">
          <Loader size="sm" />
          Učitavanje kategorija i luka…
        </Group>
      )}
      {optionsError && (
        <Alert color="red" title="Kategorije i luke nije moguće učitati.">
          <Button
            variant="light"
            size="xs"
            onClick={() => {
              if (categories.isError) void categories.refetch()
              if (ports.isError) void ports.refetch()
            }}
          >
            Pokušaj ponovno
          </Button>
        </Alert>
      )}
      {optionsEmpty && (
        <Alert color="yellow">Za dodavanje plovila potrebne su kategorije i matične luke.</Alert>
      )}
      {formErrors.length > 0 && <Alert color="red">{formErrors.join(' ')}</Alert>}
      <Box component="form" ref={formRef} onSubmit={submit} noValidate>
        <Fieldset variant="unstyled" disabled={isPending} aria-busy={isPending}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput name="name" label="Naziv" required error={fieldErrors.name} />
              <NativeSelect
                name="category"
                label="Kategorija"
                required
                disabled={!categories.data?.length}
                data={[
                  { value: '', label: 'Odaberite kategoriju' },
                  ...(categories.data ?? []).map(({ id, name }) => ({
                    value: String(id),
                    label: name,
                  })),
                ]}
                error={fieldErrors.category}
              />
              <NativeSelect
                name="home_port"
                label="Matična luka"
                required
                disabled={!ports.data?.length}
                data={[
                  { value: '', label: 'Odaberite luku' },
                  ...(ports.data ?? []).map(({ id, name }) => ({ value: String(id), label: name })),
                ]}
                error={fieldErrors.home_port}
              />
              <TextInput
                name="length_m"
                label="Duljina (m)"
                inputMode="decimal"
                required
                error={fieldErrors.length_m}
              />
              <TextInput
                name="max_people"
                label="Najveći broj osoba"
                inputMode="numeric"
                required
                error={fieldErrors.max_people}
              />
              <TextInput
                name="cabins"
                label="Broj kabina"
                inputMode="numeric"
                required
                error={fieldErrors.cabins}
              />
              <TextInput
                name="year_built"
                label="Godina izgradnje"
                inputMode="numeric"
                required
                error={fieldErrors.year_built}
              />
              <TextInput
                name="daily_price"
                label="Dnevna cijena (€)"
                inputMode="decimal"
                required
                error={fieldErrors.daily_price}
              />
              <Textarea name="description" label="Opis" rows={3} error={fieldErrors.description} />
              <Textarea name="equipment" label="Oprema" rows={3} error={fieldErrors.equipment} />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button variant="default" onClick={() => void navigate(fleetPath)}>
                Odustani
              </Button>
              <Button
                type="submit"
                leftSection={isPending && <Loader size="xs" color="currentColor" />}
                aria-busy={isPending}
                disabled={isPending || loadingOptions || optionsError || optionsEmpty}
              >
                {isPending ? 'Spremanje…' : 'Spremi plovilo'}
              </Button>
            </Group>
          </Stack>
        </Fieldset>
      </Box>
    </Stack>
  )
}

function VesselFormPage() {
  const { id } = useParams()
  return id ? <Title order={1}>Plovilo</Title> : <NewVesselForm />
}

export default VesselFormPage

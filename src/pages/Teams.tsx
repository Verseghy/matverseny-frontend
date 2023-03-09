import { Component, createSignal, Show } from 'solid-js'
import Button from '../components/Button'
import Card from '../components/Card'
import ErrorMessage from '../components/ErrorMessage'
import FormField from '../components/FormField'
import Input from '../components/Input'
import styles from './Teams.module.scss'
import * as Yup from 'yup'

export const JoinTeam: Component = () => {
  let joinCodeInput: HTMLInputElement
  const [errorCode, setErrorCode] = createSignal('')

  const onJoin = async () => {
    // TODO: join request
  }

  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <div class={styles.section}>
          <h1>Hozz létre egy csapatot</h1>
          <Button href="/team/create" kind="primary">
            Új csapat
          </Button>
        </div>
        <div class={styles.divider}>
          <span>vagy</span>
        </div>
        <div class={styles.section}>
          <h1>Csatlakozz egy csapathoz</h1>
          <Show when={errorCode() !== ''}>
            <ErrorMessage class={styles.errorMessage} code={errorCode()} />
          </Show>
          <div class={styles.join}>
            <Input
              placeholder="Csapatkód"
              ref={joinCodeInput!}
            />
            <Button kind="primary" onClick={onJoin}>
              Csatlakozás
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

const createTeamScheme = Yup.object({
  name: Yup.string()
    .max(64, 'A név maximum 64 karakter hosszú lehet')
    .required('Név megadása kötelező'),
})


export const CreateTeam: Component = () => {
  const [nameError, setNameError] = createSignal('')
  const [nameDirty, setNameDirty] = createSignal(false)
  let nameInput: HTMLInputElement

  const [errorCode, setErrorCode] = createSignal('')

  const validate = async (): Promise<any> => {
    try {
      const value = await createTeamScheme.validate(
        {
          name: nameInput.value,
        },
        {
          abortEarly: false,
        }
      )
      setNameError('')
      return value
    } catch (e: any) {
      if (!(e instanceof Yup.ValidationError)) return
      setNameError('')
      for (const error of e.inner) {
        if (error.path === 'name') {
          setNameError(error.errors[0])
        }      }
      return null
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault()

    setNameDirty(true)

    const value = await validate()
    if (value !== null) {
      // TODO: create team
    }
  }

  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <form onSubmit={submitForm}>
          <h1>Csapat létrehozása</h1>
          <ErrorMessage class={styles.errorMessage} code={errorCode()} />
          <FormField
            name="name"
            display="Csapat neve"
            autofocus
            class={styles.nameInput} 
            errorMessage={nameDirty() ? nameError() : ''}
            ref={nameInput!}
            onBlur={() => {
              setNameDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <div class={styles.buttons}>
            <Button href="/team" block>
              Vissza
            </Button>
            <Button type="submit" disabled={false} kind="primary" block>
              Létrehozás
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export const ManageTeam: Component = () => {
  return (
    <div class={styles.container}>
    </div>
  )
}

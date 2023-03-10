import { Component, createEffect, createSignal, For, from, Show } from 'solid-js'
import Button from '../components/Button'
import Card from '../components/Card'
import ErrorMessage from '../components/ErrorMessage'
import FormField from '../components/FormField'
import Input from '../components/Input'
import styles from './Teams.module.scss'
import * as Yup from 'yup'
import { FaSolidCrown, FaSolidKey, FaSolidRotateRight, FaSolidXmark } from 'solid-icons/fa'
import { jwtService, socketService, teamService } from '../App'
import { CopyButton } from '../components/CopyButton'
import { firstValueFrom } from 'rxjs'
import { TeamMember } from '../services/socket'
import { useNavigate } from '@solidjs/router'

export const JoinTeam: Component = () => {
  socketService.start()

  const info = from(socketService.teamInfo())
  const claims = from(jwtService.getClaims())
  const navigate = useNavigate()

  createEffect(() => {
    if (!claims()) navigate('/login')
    if (!!info()) navigate('/team/manage')
  })

  let joinCodeInput: HTMLInputElement
  const [errorCode, setErrorCode] = createSignal('')

  const onJoin = async () => {
    if (joinCodeInput.value) {
      try {
        await firstValueFrom(teamService.join({ code: joinCodeInput.value }))
        setErrorCode('')
        socketService.start()
      } catch (e: any) {
        setErrorCode(e.code)
      }
    }
  }

  return (
    <Show when={info() === null}>
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
    </Show>
  )
}

const createTeamScheme = Yup.object({
  name: Yup.string()
    .max(64, 'A név maximum 64 karakter hosszú lehet')
    .required('Név megadása kötelező'),
})


export const CreateTeam: Component = () => {
  socketService.start()

  const info = from(socketService.teamInfo())
  const claims = from(jwtService.getClaims())
  const navigate = useNavigate()

  createEffect(() => {
    if (!claims()) navigate('/login')
    if (!!info()) navigate('/team/manage')
  })

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
        }
      }
      return null
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault()

    setNameDirty(true)

    const value = await validate()
    if (value !== null) {
      try {
        await firstValueFrom(teamService.create(value))
        setErrorCode('')
        socketService.start()
      } catch (e: any) {
        setErrorCode(e.code)
      }
    }
  }

  return (
    <Show when={info() === null}>
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
    </Show>
  )
}

export const ManageTeam: Component = () => {
  socketService.start()

  const info = from(socketService.teamInfo())
  const claims = from(jwtService.getClaims())
  const navigate = useNavigate()

  createEffect(() => {
    if (!claims()) navigate('/login')
    if (info() === null) navigate('/team')
  })

  const [errorCode, setErrorCode] = createSignal('')
  const [editMode, setEditMode] = createSignal(false)

  const changeLock = async (value: boolean) => {
    try {
      await firstValueFrom(teamService.update({
        locked: value,
      }))
      setErrorCode('')
    } catch (e: any) {
      setErrorCode(e.code)
    }
  }

  const regenerateJoinCode = async () => {
    try {
      await firstValueFrom(teamService.regenerateCode())
      setErrorCode('')
    } catch (e: any) {
      setErrorCode(e.code)
    }
  }

  const kickMember = async (id: string) => {
    try {
      await firstValueFrom(teamService.kick({ user: id }))
      setErrorCode('')
    } catch (e: any) {
      setErrorCode(e.code)
    }
  }

  const toggleCoOwnerStatus = async (id: string) => {
    const member = getMember(id)
    if (member?.rank === 'Member') {
      try {
        await firstValueFrom(teamService.update({
          co_owner: member.id,
        }))
        setErrorCode('')
      } catch (e: any) {
        setErrorCode(e.code)
      }
    } else if (member?.rank === 'CoOwner') {
      try {
        await firstValueFrom(teamService.update({
          co_owner: null,
        }))
        setErrorCode('')
      } catch (e: any) {
        setErrorCode(e.code)
      }
    }
  }

  const leaveTeam = async () => {
    try {
      await firstValueFrom(teamService.leave())
      setErrorCode('')
    } catch (e: any) {
      setErrorCode(e.code)
    }
  }

  const deleteTeam = async () => {
    try {
      await firstValueFrom(teamService.disband())
      setErrorCode('')
    } catch (e: any) {
      setErrorCode(e.code)
    }
  }

  const getMember = (id: string): TeamMember | null => {
    if (info() === null) return null
    const member = info()!.members.find((m) => m.id === id.slice("UserID-".length)) ?? null
    return member
  }

  const user = (): TeamMember | null => {
    const user_id = claims()?.sub
    console.log('user', user_id)
    if (!user_id) return null
    return getMember(user_id)
  }

  return (
    <Show when={info() && user() !== null}>
      <div class={styles.container}>
        <Card class={styles.card}>
          <h1>{info()!.name}</h1>
          <ErrorMessage code={errorCode()} />
          <Show when={user()!.rank === 'Owner'}>
            <Show when={!editMode()}>
              <div class={styles.teamOperations}>
                <Button block onClick={() => setEditMode(true)}>
                  Csapatnév módosítása
                </Button>
                {info()!.locked ? (
                  <Button onClick={() => changeLock(false)} block>
                    Nevezés visszavonása
                  </Button>
                ) : (
                  <Button onClick={() => changeLock(true)} block>
                    Nevezése a versenyre
                  </Button>
                )}
              </div>
            </Show>
            <Show when={editMode()}>
              <form>
                <div class={styles.renameTeam}>
                  <FormField block autofocus name="name" />
                  <div class={styles.renameButtons}>
                    <Button
                      /* disabled={isSubmitting} */
                      type="submit"
                      class={styles.submitRename}
                    >
                      Átnevezés
                    </Button>
                    <Button onClick={() => setEditMode(false)}>
                      <FaSolidXmark />
                    </Button>
                  </div>
                </div>
              </form>
            </Show>
            <div class={styles.codeContainer}>
              <span class={styles.codeTitle}>Csapatkód:</span>
              <div class={styles.codeActions}>
                <Input
                  value={info()!.code}
                  readOnly
                  class={styles.code}
                  onFocus={(event) => (event.target as any).select()}
                />
                <CopyButton text={info()!.code} />
                <Button onClick={regenerateJoinCode}>
                  <FaSolidRotateRight />
                </Button>
              </div>
            </div>
          </Show>
          <span class={styles.members}>Tagok</span>
          <div>
            <For each={info()!.members}>
              {(member) => (
                <div class={styles.member}>
                  <span class={styles.memberName}>
                    <span>{member.name}</span>
                    <Show when={member.rank === 'Owner'}>
                      <FaSolidCrown size={16} class={styles.star} />
                    </Show>
                  </span>
                  <Show when={user()!.rank !== 'Member'}>
                    <div class={styles.actions}>
                      <Show when={member.rank !== 'Owner' && member.id !== user()!.id}>
                        <Show when={user()!.rank === 'Owner'}>
                          <Button
                            onClick={() => toggleCoOwnerStatus(member.id)}
                            kind={member.rank === 'CoOwner' ? 'primary' : undefined}
                          >
                            <FaSolidKey />
                          </Button>
                        </Show>
                        <Button onClick={() => kickMember(member.id)}>
                          <FaSolidXmark />
                        </Button>
                      </Show>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
          <div class={styles.buttonsContainer}>
            {/* TODO: this should go to /competition */}
            <Button block kind="primary" href="/wait" disabled={!info()!.locked}>
              Versenyhez
            </Button>
            <Show when={user()!.rank !== 'Owner'}>
              <Button block onClick={leaveTeam} kind="danger">
                Csapat elhagyása
              </Button>
            </Show>
            <Show when={user()!.rank === 'Owner'}>
              <Button block onClick={deleteTeam} kind="danger">
                Csapat törlése
              </Button>
            </Show>
          </div>
        </Card>
      </div>
    </Show>
  )
}

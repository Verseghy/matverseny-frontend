import { useNavigate } from "@solidjs/router"
import { firstValueFrom } from "rxjs"
import { Component, createSignal } from "solid-js"
import * as Yup from 'yup'
import { authService } from "../App"
import Button from "../components/Button"
import Card from "../components/Card"
import ErrorMessage from "../components/ErrorMessage"
import FormField from "../components/FormField"
import styles from './Login.module.scss'

const schema = Yup.object({
  email: Yup.string().email('Az email formátuma nem megfelelő').required('Email kötelező'),
  password: Yup.string().required('Jelszó kötelező'),
})

const LoginPage: Component = () => {
  const [isPending, setIsPending] = createSignal(false)
  const [errorCode, setErrorCode] = createSignal('')

  const [emailError, setEmailError] = createSignal('');
  const [passwordError, setPasswordError] = createSignal('');

  const [emailDirty, setEmailDirty] = createSignal(false)
  const [passwordDirty, setPasswordDirty] = createSignal(false)

  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement

  const navigate = useNavigate();

  const validate = async (): Promise<any> => {
    try {
      const value = await schema.validate(
        {
          email: emailInput.value,
          password: passwordInput.value,
        },
        {
          abortEarly: false,
        }
      )
      setEmailError('')
      setPasswordError('')
      return value
    } catch (e: any) {
      if (!(e instanceof Yup.ValidationError)) return
      setEmailError('')
      setPasswordError('')
      for (const error of e.inner) {
        if (error.path === 'email') {
          setEmailError(error.errors[0])
        } else if (error.path === 'password') {
          setPasswordError(error.errors[0])
        }
      }
      return null
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault()

    setEmailDirty(true)
    setPasswordDirty(true)

    setIsPending(true)
    const value = await validate()
    if (value !== null) {
      const login$ = authService.login(value)
      try {
        await firstValueFrom(login$)

        navigate('/teams')
      } catch (e: any) {
        setErrorCode(e.code)
      }
    }
    setIsPending(false)
  }

  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <form onSubmit={submitForm}>
          <img src="/assets/logo.svg" alt="" class={styles.logo} />
          <h1>Bejelentkezés</h1>
          <h2>
            A <span>191</span> matematikaverseny oldalára
          </h2>
          <ErrorMessage code={errorCode()} />
          <FormField
            name="email"
            display="Email"
            type="text"
            autofocus
            class={styles.field}
            errorMessage={emailDirty() ? emailError() : ''}
            ref={emailInput!}
            onBlur={() => {
              setEmailDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <FormField
            name="password"
            display="Jelszó"
            type="password"
            class={styles.field}
            errorMessage={passwordDirty() ? passwordError() : ''}
            ref={passwordInput!}
            onBlur={() => {
              setPasswordDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <div class={styles.controls}>
            <Button href="/register" block>
              Regisztráció
            </Button>
            <Button
              class={styles.button}
              kind="primary"
              disabled={isPending()}
              type="submit"
            >
              Bejelentkezés
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage

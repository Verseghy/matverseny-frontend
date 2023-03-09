import { Component, createSignal } from "solid-js"
import * as Yup from 'yup'
import Button from "../components/Button"
import Card from "../components/Card"
import FormField from "../components/FormField"
import { register } from "../state/auth"
import styles from './Register.module.scss'

const schema = Yup.object().shape({
  email: Yup.string().email('Az email formátuma nem megfelelő').required('Email kötelező'),
  password: Yup.string()
    .min(8, 'A jelszónak legalább 8 karakternek kell lennie')
    .required('Jelszó kötelező'),
  passwordRe: Yup.string()
    .oneOf([Yup.ref('password')], 'Két jelszó nem egyezik')
    .required('Jelszó ismétlés kötelező'),
  name: Yup.string().required('Név kötelező'),
  school: Yup.string().required('Iskola kötelező'),
  class: Yup.number()
    .min(9, 'Az évfolyamnak 9 és 12 között kell lennie')
    .max(12, 'Az évfolyamnak 9 és 12 között kell lennie')
    .required('Évfolyam kötelező'),
})


const RegisterPage: Component = () => {
  const [emailError, setEmailError] = createSignal('');
  const [passwordError, setPasswordError] = createSignal('');
  const [passwordReError, setPasswordReError] = createSignal('');
  const [nameError, setNameError] = createSignal('');
  const [schoolError, setSchoolError] = createSignal('');
  const [classError, setClassError] = createSignal('');

  const [emailDirty, setEmailDirty] = createSignal(false);
  const [passwordDirty, setPasswordDirty] = createSignal(false);
  const [passwordReDirty, setPasswordReDirty] = createSignal(false);
  const [nameDirty, setNameDirty] = createSignal(false);
  const [schoolDirty, setSchoolDirty] = createSignal(false);
  const [classDirty, setClassDirty] = createSignal(false);

  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let passwordReInput: HTMLInputElement
  let nameInput: HTMLInputElement
  let schoolInput: HTMLInputElement
  let classInput: HTMLInputElement

  const validate = async (): Promise<any> => {
    try {
      const value = await schema.validate(
        {
          email: emailInput.value,
          password: passwordInput.value,
          passwordRe: passwordReInput.value,
          name: nameInput.value,
          school: schoolInput.value,
          class: classInput.value || '0',
        },
        {
          abortEarly: false,
        }
      )
      setEmailError('')
      setPasswordError('')
      setPasswordReError('')
      setNameError('')
      setSchoolError('')
      setClassError('')

      return value
    } catch (e: any) {
      if (!(e instanceof Yup.ValidationError)) return
      setEmailError('')
      setPasswordError('')
      setPasswordReError('')
      setNameError('')
      setSchoolError('')
      setClassError('')

      for (const error of e.inner) {
        if (error.path === 'email') {
          setEmailError(error.errors[0])
        } else if (error.path === 'password') {
          setPasswordError(error.errors[0])
        } else if (error.path === 'passwordRe') {
          setPasswordReError(error.errors[0])
        } else if (error.path === 'name') {
          setNameError(error.errors[0])
        } else if (error.path === 'school') {
          setSchoolError(error.errors[0])
        } else if (error.path === 'class') {
          setClassError(error.errors[0])
        }
      }
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault()

    setEmailDirty(true)
    setPasswordDirty(true)
    setPasswordReDirty(true)
    setNameDirty(true)
    setSchoolDirty(true)
    setClassDirty(true)

    const value = await validate()
    // TODO: send register request
    console.log(value)
  }

  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <form onSubmit={submitForm}>
          <h1>Regisztráció</h1>
          <FormField
            name="email"
            display="Email"
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
          <FormField
            name="passwordRe"
            display="Jelszó ismétlés"
            type="password"
            class={styles.field}
            errorMessage={passwordReDirty() ? passwordReError() : ''}
            ref={passwordReInput!}
            onBlur={() => {
              setPasswordReDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <FormField
            name="name"
            display="Név"
            class={styles.field}
            errorMessage={nameDirty() ? nameError() : ''}
            ref={nameInput!}
            onBlur={() => {
              setNameDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <FormField
            name="school"
            display="Iskola"
            class={styles.field}
            errorMessage={schoolDirty() ? schoolError() : ''}
            ref={schoolInput!}
            onBlur={() => {
              setSchoolDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <FormField
            name="class"
            display="Évfolyam"
            type="number"
            class={styles.field}
            errorMessage={classDirty() ? classError() : ''}
            ref={classInput!}
            onBlur={() => {
              setClassDirty(true)
              validate()
            }}
            onInput={validate}
          />
          <div class={styles.controls}>
            <Button
              class={styles.button}
              kind="primary"
              /* disabled={isSubmitting} */
              type="submit"
            >
              Regisztráció
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage

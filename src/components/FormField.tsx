import { Component, Ref, Show, splitProps } from 'solid-js'
import Input, { InputProps } from './Input'
import styles from './FormField.module.scss'

export interface FormFieldProps extends InputProps {
  name: string
  display?: string
  errorMessage?: string
}

const FormField: Component<FormFieldProps> = (props) => {
  const [local, rest] = splitProps(props, ['name', 'display', 'errorMessage', 'class'])

  return (
    <label
      classList={{
        [styles.field]: true,
        [local.class!]: !!local.class,
      }}
    >
      <Show when={!!local.display}>
        <span>{local.display!}</span>
      </Show>
      <Input block {...rest} error={!!local.errorMessage} />
      <Show when={!!local.errorMessage}>
        <span class={styles.error}>{local.errorMessage}</span>
      </Show>
    </label>
  )
}

export default FormField

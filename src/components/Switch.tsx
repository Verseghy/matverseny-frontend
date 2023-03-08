import { Component, createEffect, createSignal, Show } from 'solid-js'
import styles from './Switch.module.scss'

export interface SwitchProps {
  value?: boolean,
  onClick?: (value: boolean) => void,
  children: string
}

const Switch: Component<SwitchProps> = (props) => {
  const [value, setValue] = createSignal(props.value ?? false);

  createEffect(() => {
    if (props.value) {
      setValue(props.value)
    }
  })

  const handleClick = () => {
    setValue(!value())

    if (props.onClick) {
      props.onClick(value())
    }
  }

  const button = (
    <button
      role="switch"
      aria-checked={value()}
      class={styles.switch}
      onClick={handleClick}
    />
  )

  return (
    <>
      <Show when={!props.children}>
        {button}
      </Show>
      <Show when={props.children}>
        <label class={styles.label}>
          {button}
          <span>{props.children}</span>
        </label>
      </Show>
    </>
  )
}

export default Switch

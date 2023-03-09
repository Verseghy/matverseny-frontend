import Button from './Button'
import type { ButtonProps } from './Button'
import styles from './CopyButton.module.scss'
import { Component, createSignal, Match, splitProps, Switch } from 'solid-js'
import { FaSolidCheck, FaSolidClipboard, FaSolidXmark } from 'solid-icons/fa'
import { debounce } from '@solid-primitives/scheduled'

export interface CopyButtonProps extends ButtonProps {
  text: string
}

type CopyButtonState = 'normal' | 'success' | 'error'

export const CopyButton: Component<CopyButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['text'])
  const [state, setState] = createSignal<CopyButtonState>('normal')

  const trigger = debounce(() => {
    setState('normal')
  }, 1000)

  const onClick = () => {
    navigator.clipboard.writeText(local.text).then(
      () => {
        setState('success')
        trigger()
      },
      () => {
        setState('error')
        trigger()
      }
    )
  }

  return (
    <Button onClick={onClick} {...rest}>
      <Switch>
        <Match when={state() === 'normal'}>
          <FaSolidClipboard />
        </Match>
        <Match when={state() === 'success'}>
          <FaSolidCheck class={styles.success} />
        </Match>
        <Match when={state() === 'error'}>
          <FaSolidXmark class={styles.error}/>
        </Match>
      </Switch>
    </Button>
  )
}

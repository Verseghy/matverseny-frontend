import { Component, JSX, splitProps } from 'solid-js'
import styles from './Input.module.scss'

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  block?: boolean
  error?: boolean
}

const Input: Component<InputProps> = (props) => {
  const [local, rest] = splitProps(props, ['block', 'error', 'class'])

  return (
    <input
      classList={{
        [styles.input]: true,
        [styles.block]: local.block,
        [styles.error]: local.error,
        [local.class!]: !!local.class,
      }}
      {...rest}
    />
  )
}

export default Input

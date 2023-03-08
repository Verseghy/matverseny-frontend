import { Link } from '@solidjs/router'
import { Component, JSX, Show, splitProps } from 'solid-js'
import styles from './Button.module.scss'

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  kind?: 'primary' | 'danger'
  block?: boolean
  label?: boolean
  href?: string
}

const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['children', 'kind', 'block', 'label', 'href', 'class'])

  return (
    <Show when={local.href}>
      <Link
        href={local.href!}
        classList={{
          [styles.button]: true,
          [styles.block]: local.block,
          [local.class!]: !!local.class,
          [styles[local.kind!]]: !!local.kind,
        }}
      >
        {local.children}
      </Link>
    </Show>
  )
}

export default Button

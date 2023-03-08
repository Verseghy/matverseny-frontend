import { Link } from '@solidjs/router'
import { Component, JSX, Show, splitProps } from 'solid-js'
import styles from './Button.module.scss'

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: 'primary' | 'danger'
  block?: boolean
  label?: boolean
  href?: string
}

const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['children', 'kind', 'block', 'label', 'href', 'class'])

  const link = () => (
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
  )

  const label = () => (
    <label
      tabIndex={0}
      classList={{
        [styles.button]: true,
        [styles.block]: local.block,
        [local.class!]: !!local.class,
        [styles[local.kind!]]: !!local.kind,
      }}
    >
      {local.children}
    </label>
  )

  const normal = () => (
    <button
      classList={{
        [styles.button]: true,
        [styles.block]: local.block,
        [local.class!]: !!local.class,
        [styles[local.kind!]]: !!local.kind,
      }}
      {...rest}
    >
      {local.children}
    </button>
  )

  return (
    <>
      <Show
        when={local.href}
        fallback={(
          <Show
            when={local.label}
            fallback={normal()}
          >
            {label()}
          </Show>
        )}
      >
        {link()}
      </Show>
    </>
  )
}

export default Button

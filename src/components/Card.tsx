import { Component, JSX, splitProps } from 'solid-js'
import styles from './Card.module.scss'

const Card: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <div
      classList={{
        [styles.card]: true,
        [local.class!]: !!local.class,
      }}
      {...rest}
    >
      {local.children}
    </div>
  )
}

export default Card


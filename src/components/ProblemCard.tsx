import { Component, createSignal, JSX, Show, splitProps } from 'solid-js'
import { Problem } from '../services/socket'
import Card from './Card'
import styles from './ProblemCard.module.scss'
import KaTeX from 'katex'
import Input from './Input'
import { debounce } from '@solid-primitives/scheduled'


export interface ProblemCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  index: number
  problem: Problem
  /* isLoading?: boolean */
}

export const ProblemCard: Component<ProblemCardProps> = (props) => {
  const [local, rest] = splitProps(props, ['index', 'problem'])

  const [answer, setAnswer] = createSignal('')
  const setDebouncedAnswer = debounce(setAnswer, 1000)

  return (
    <Card {...rest}>
      <div class={styles.header}>
        <div class={styles.titleContainer}>
          <h1 class={styles.title}>{local.index}. feladat</h1>
        </div>
      </div>
      <p class={styles.problem} innerHTML={formatText(local.problem.body)} />
      <Show when={!!local.problem.image}>
        <img class={styles.image} src={local.problem.image} alt="" />
      </Show>
      <Input
        block
        error={isNaN(Number(answer())) || !Number.isSafeInteger(Number(answer()))}
        inputMode="numeric"
        onInput={(event) => {
          setDebouncedAnswer((event.target as HTMLInputElement).value)
        }}
        onBlur={(event) => {
          setDebouncedAnswer.clear()
          setAnswer((event.target as HTMLInputElement).value)
        }}
      />
    </Card>
  )
}

const formatText = (problemText: string): string => {
  let text = problemText
  const inline = problemText.match(/\$(?!\$)([^$]*)\$(?!\$)/g) || []
  const block = problemText.match(/\$\$([^$]*)\$\$/g) || []

  for (const i of inline) {
    const a = KaTeX.renderToString(i.substring(1, i.length - 1), {
      displayMode: false,
      throwOnError: false,
      errorColor: 'var(--red)',
    })
    text = text.replace(i, a)
  }

  for (const b of block) {
    const a = KaTeX.renderToString(b.substring(2, b.length - 2), {
      displayMode: true,
      throwOnError: false,
      errorColor: 'var(--red)',
    })
    text = text.replace(b, a)
  }

  return text
}

import { Component, createEffect, createSignal, JSX, Show, splitProps } from 'solid-js'
import { Problem } from '../services/socket'
import Card from './Card'
import styles from './ProblemCard.module.scss'
import KaTeX from 'katex'
import Input from './Input'
import { debounce } from '@solid-primitives/scheduled'

export type ProblemCardProps = {
  index: number
  problem: Problem
  onAnswer?: (answer: number | null) => void
} & JSX.HTMLAttributes<HTMLDivElement>

export const ProblemCard: Component<ProblemCardProps> = (props) => {
  const [local, rest] = splitProps(props, ['index', 'problem', 'onAnswer'])

  const [answer, setAnswer] = createSignal(local.problem.solution ? String(local.problem.solution) : '')
  const setDebouncedAnswer = debounce(setAnswer, 1000)

  const isError = () => isNaN(Number(answer())) || !Number.isSafeInteger(Number(answer()))

  createEffect(() => {
    if (isError()) return
    if (answer() === (local.problem.solution ? String(local.problem.solution) : '')) return

    if (!!local.onAnswer) {
      if (answer() === '') {
        local.onAnswer(null)
      } else {
        local.onAnswer(Number(answer()))
      }
    }
  })

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
        error={isError()}
        inputMode="numeric"
        value={local.problem.solution ?? ''}
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

// TODO: this needs testing
const formatText = (problemText: string): string => {
  let text = problemText

  const block = problemText.match(/\$\$([^$]*)\$\$/g) || []

  for (const b of block) {
    const a = KaTeX.renderToString(b.substring(2, b.length - 2), {
      displayMode: true,
      throwOnError: false,
      errorColor: 'var(--red)',
    })
    text = text.replace(b, a)
  }

  problemText = text

  const inline = problemText.match(/\$(?!\$)([^$]*)\$(?!\$)/g) || []

  for (const i of inline) {
    const a = KaTeX.renderToString(i.substring(1, i.length - 1), {
      displayMode: false,
      throwOnError: false,
      errorColor: 'var(--red)',
    })
    text = text.replace(i, a)
  }

  return text
}

import { Component, For } from 'solid-js'
import Button from '../components/Button'
import { ProblemCard } from '../components/ProblemCard'
import Timer from '../components/Timer'
import { Problem } from '../services/socket'
import styles from './Competition.module.scss'

type QuickProblemButtonProps = {
  problem: Problem,
  index: number,
}

const QuickProblemButton: Component<QuickProblemButtonProps> = (props) => {
  return (
    <Button
      class={styles.problemButton}
      kind={props.problem.answer ? 'primary' : undefined}
      onClick={() => {
        window.scrollTo({
          top: document.getElementById(`card_${props.problem.id}`)!.offsetTop - 24,
          behavior: 'smooth',
        })
        const input = document.querySelector(`#card_${props.problem.id} input`) as HTMLInputElement
        input.focus({
          preventScroll: true,
        })
      }}
    >
      {props.index}
    </Button>
  )
}

const CompetitionPage: Component = () => {
  const problems: () => Problem[] = () => [{
    id: '',
    body: 'some random body $asdf$ dsa',
    image: '',
    answer: null,
  }]

  const logout = () => {
    // TODO: implement logout
  }

  return (
    <div class={styles.container}>
      <div class={styles.logoutContainer}>
        <Button href="/team/manage" class={styles.button}>
          Csapat
        </Button>
        <span class={styles.timer}>
          <Timer />
        </span>
        <Button onClick={logout} class={styles.button}>
          Kijelentkezés
        </Button>
      </div>
      {/* <Paginator */}
      {/*   onPageSwitch={(page: number) => { */}
      {/*     setActivePage(page) */}
      {/*     window.scrollTo(0, 0) */}
      {/*   }} */}
      {/* > */}
      {/*   <PaginatorControls /> */}
        <div class={styles.buttonsContainer}>
          <For each={problems()}>
            {(problem, index) => (
              <QuickProblemButton problem={problem} index={index()} />
            )}
          </For>
        </div>
        <For each={problems()}>
          {(problem, index) => (
            <ProblemCard
              id={`card_${problem.id}`}
              class={styles.card}
              index={index() + 1}
              problem={problem}
              /* onUpdate={onUpdate} */
            />
          )}
        </For>
      {/*   <PaginatorControls /> */}
      {/* </Paginator> */}
    </div>
  )
}

export default CompetitionPage

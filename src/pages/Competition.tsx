import { FaSolidChevronLeft, FaSolidChevronRight } from 'solid-icons/fa'
import { Component, createEffect, For } from 'solid-js'
import Button from '../components/Button'
import Paginator from '../components/Paginator'
import { ProblemCard } from '../components/ProblemCard'
import Timer from '../components/Timer'
import { usePaginate } from '../hooks/usePaginate'
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

const PaginatorControls = <T,>(props: {
  paginator: Paginator<T>,
}) => {
  console.log(props.paginator)

  return (
    <div class={styles.paginator}>
      <Button
        disabled={props.paginator.current === 0}
        onClick={props.paginator.prev}
      >
        <FaSolidChevronLeft />
      </Button>
      <span>
        {props.paginator.current + 1} / {props.paginator.last + 1}
      </span>
      <Button
        disabled={props.paginator.current === props.paginator.last}
        onClick={props.paginator.next}
      >
        <FaSolidChevronRight />
      </Button>
    </div>
  )
}

const CompetitionPage: Component = () => {
  const problems: () => Problem[] = () => [
    {
      id: '1',
      body: '1 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '2',
      body: '2 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '3',
      body: '3 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '4',
      body: '4 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '5',
      body: '5 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '6',
      body: '6 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '7',
      body: '7 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '8',
      body: '8 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '9',
      body: '9 some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
    {
      id: '',
      body: 'some random body $asdf$ dsa',
      image: '',
      answer: null,
    },
  ]

  const paginatedProblems = usePaginate(problems, 3);

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
        <PaginatorControls paginator={paginatedProblems} />
        <div class={styles.buttonsContainer}>
          <For each={paginatedProblems()}>
            {([problem, index]) => (
              <QuickProblemButton problem={problem} index={index + 1} />
            )}
          </For>
        </div>
        <For each={paginatedProblems()}>
          {([problem, index]) => (
            <ProblemCard
              id={`card_${problem.id}`}
              class={styles.card}
              index={index + 1}
              problem={problem}
              /* onUpdate={onUpdate} */
            />
          )}
        </For>
        <PaginatorControls paginator={paginatedProblems} />
    </div>
  )
}

export default CompetitionPage

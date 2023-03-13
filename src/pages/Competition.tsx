import { useNavigate } from '@solidjs/router'
import { FaSolidChevronLeft, FaSolidChevronRight } from 'solid-icons/fa'
import { Component, createEffect, For, from } from 'solid-js'
import { jwtService, socketService, solutionService } from '../App'
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
      kind={props.problem.solution ? 'primary' : undefined}
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
  socketService.start()

  const info = from(socketService.teamInfo())
  const claims = from(jwtService.getClaims())
  const times = from(socketService.time())
  const navigate = useNavigate()

  createEffect(() => {
    if (!claims()) navigate('/login')
    if (info() === null) navigate('/team')
    if (times() && times()!.start_time > new Date()) navigate('/wait')
  })

  const problems: () => Problem[] = () => [
    {
      id: '1',
      body: '1 some $$random$$ body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '2',
      body: '$\\frac{1}{\\Bigl(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{\\frac25 \\pi}} \\equiv 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}} {1+\\frac{e^{-8\\pi}} {1+\\cdots} } } }$',
      image: '',
      solution: null,
    },
    {
      id: '3',
      body: '$\\mathcal L_{\\mathcal T}(\\vec{\\lambda}) = \\sum_{(\\mathbf{x},\\mathbf{s})\\in \\mathcal T} \\log P(\\mathbf{s}\\mid\\mathbf{x}) - \\sum_{i=1}^m \\frac{\\lambda_i^2}{2\\sigma^2}$',
      image: '',
      solution: 123,
    },
    {
      id: '4',
      body: '4 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '5',
      body: '5 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '6',
      body: '6 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '7',
      body: '7 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '8',
      body: '8 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '9',
      body: '9 some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
    {
      id: '',
      body: 'some random body $asdf$ dsa',
      image: '',
      solution: null,
    },
  ]

  const paginatedProblems = usePaginate(problems, 10);

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
              onAnswer={(answer) => {
                console.log("answer", answer)
                solutionService.setSolution({ problem: problem.id, solution: answer })
              }}
            />
          )}
        </For>
        <PaginatorControls paginator={paginatedProblems} />
    </div>
  )
}

export default CompetitionPage

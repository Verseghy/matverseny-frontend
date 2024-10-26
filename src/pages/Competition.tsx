import { createTimer } from '@solid-primitives/timer'
import { RouteSectionProps, useNavigate } from '@solidjs/router'
import { FaSolidChevronLeft, FaSolidChevronRight } from 'solid-icons/fa'
import { Component, createEffect, For, from } from 'solid-js'
import { authService, jwtService, socketService, solutionService } from '../App'
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

const CompetitionPage: Component<RouteSectionProps<void>> = () => {
  socketService.start()

  const info = from(socketService.teamInfo())
  const claims = from(jwtService.getClaims())
  const times = from(socketService.time())
  const navigate = useNavigate()

  const delay = (): number | false => {
    if (!times()) return false
    const d = times()!.end_time.getTime() - new Date().getTime()
    return d < 0 ? 0 : d
  }

  createTimer(() => {
    if (delay() === false || delay() > 0) return
    navigate('/end')
  }, 1000, setInterval)

  createEffect(() => {
    if (!claims()) navigate('/login')
    if (info() === null) navigate('/team')
    if (times() && times()!.start_time > new Date()) navigate('/wait')
  })

  const problems = from(socketService.problems())

  const paginatedProblems = usePaginate(() => problems() ?? [], 10);

  return (
    <div class={styles.container}>
      <div class={styles.logoutContainer}>
        <Button href="/team/manage" class={styles.button}>
          Csapat
        </Button>
        <span class={styles.timer}>
          <Timer time={times()?.end_time} />
        </span>
        <Button onClick={authService.logout} class={styles.button}>
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
                solutionService.setSolution({ problem: problem.id, solution: answer }).subscribe()
              }}
            />
          )}
        </For>
        <PaginatorControls paginator={paginatedProblems} />
    </div>
  )
}

export default CompetitionPage

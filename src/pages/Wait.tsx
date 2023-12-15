import { createTimer } from '@solid-primitives/timer'
import { useNavigate } from '@solidjs/router'
import { Component, createEffect, from } from 'solid-js'
import { jwtService, socketService } from '../App'
import Button from '../components/Button'
import Card from '../components/Card'
import Timer from '../components/Timer'
import styles from './Wait.module.scss'

const WaitPage: Component = () => {
  socketService.start()

  const claims = from(jwtService.getClaims())
  const times = from(socketService.time())

  const navigate = useNavigate()

  const delay = (): number | false => {
    if (!times()) return false
    const d = times()!.start_time.getTime() - new Date().getTime()
    return d < 0 ? 0 : d
  }

  createTimer(() => {
    if (delay() === false || delay() > 0) return
    navigate('/competition')
  }, 1000, setInterval)

  createEffect(() => {
    if (!claims()) navigate('/login')
  })

  const start_time = () => times()?.start_time

  return (
    <div class={styles.container}>
      <Card>
        <h1>Kérlek várj!</h1>
        <p>A verseny kezdetéig még:</p>
        <p class={styles.time}>
          <Timer time={start_time()} />
        </p>
        <Button href="/team">Csapathoz</Button>
      </Card>
    </div>
  )
}

export default WaitPage

import { Component, createEffect, createSignal, from } from 'solid-js'
import Button from '../components/Button'
import Card from '../components/Card'
import styles from './Wait.module.scss'

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor(time / 60000) % 60
  const seconds = Math.floor(time / 1000) % 60

  const hoursString = hours < 10 ? `0${hours}` : hours
  const minutesString = `0${minutes}`.slice(-2)
  const secondsString = `0${seconds}`.slice(-2)

  return `${hoursString}:${minutesString}:${secondsString}`
}

const WaitPage: Component = () => {
  const [time, setTime] = createSignal(new Date(new Date().getTime() + 1*60000))
  const [formattedTime, setFormattedTime] = createSignal('00:00:00')

  const clock = from((set) => {
    const t = setInterval(() => set(1), 1000);
    return () => clearInterval(t);
  });

  createEffect(() => {
    clock()
    const diff = Math.abs(time().getTime() - new Date().getTime())
    setFormattedTime(formatTime(diff))
  })

  return (
    <div class={styles.container}>
      <Card>
        <h1>Kérlek várj!</h1>
        <p>A verseny kezdetéig még:</p>
        <p class={styles.time}>{formattedTime()}</p>
        <Button href="/team">Csapathoz</Button>
      </Card>
    </div>
  )
}

export default WaitPage


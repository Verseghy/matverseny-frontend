import { Component, createRenderEffect, createSignal, from } from 'solid-js'

export type TimerProps = {
  time?: Date
}

const Timer: Component<TimerProps> = (props) => {
  const [formattedTime, setFormattedTime] = createSignal('00:00:00')

  // TODO: more accurate clock
  const clock = from((set) => {
    const t = setInterval(() => set(1), 1000)
    return () => clearInterval(t)
  })

  createRenderEffect(() => {
    clock()

    if (!props.time) return

    const diff = props.time.getTime() - new Date().getTime()
    if (diff < 0) return

    setFormattedTime(formatTime(diff))
  })

  return <>{formattedTime()}</>
}

export default Timer

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor(time / 60000) % 60
  const seconds = Math.floor(time / 1000) % 60

  const hoursString = hours < 10 ? `0${hours}` : hours
  const minutesString = `0${minutes}`.slice(-2)
  const secondsString = `0${seconds}`.slice(-2)

  return `${hoursString}:${minutesString}:${secondsString}`
}

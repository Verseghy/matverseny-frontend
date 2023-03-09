import { Component } from 'solid-js'
import Button from '../components/Button'
import Card from '../components/Card'
import Timer from '../components/Timer'
import styles from './Wait.module.scss'

const WaitPage: Component = () => {
  const time = new Date(new Date().getTime() + 1*60000)

  return (
    <div class={styles.container}>
      <Card>
        <h1>Kérlek várj!</h1>
        <p>A verseny kezdetéig még:</p>
        <p class={styles.time}>
          <Timer time={time} />
        </p>
        <Button href="/team">Csapathoz</Button>
      </Card>
    </div>
  )
}

export default WaitPage

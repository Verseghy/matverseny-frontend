import { VoidComponent } from 'solid-js'
import { socketService } from '../App'
import Card from '../components/Card'
import styles from './End.module.scss'

const EndPage: VoidComponent = () => {
  socketService.stop()

  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <h1>A verseny véget ért!</h1>
        <p>Köszönjük, hogy részt vettetek a versenyen.</p>
        <p>A feladatsor alkotóközössége és technikai háttere:</p>
        <ul>
          <li>Vágó Csaba (VFG)</li>
          <li>Pécsi István (VFG)</li>
          <li>Drávucz Anita (VFG)</li>
          <li>Tornyi Bálint (VFG)</li>
          <li>Deák Gergely (VFG)</li>
          <li>Szepesi Tibor (ELTE)</li>
          <li>Szepesi Zoltán (IBM)</li>
        </ul>
      </Card>
    </div>
  )
}

export default EndPage

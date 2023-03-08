import { Component} from 'solid-js'
import Button from '../components/Button'
import Switch from '../components/Switch'
import Card from '../components/Card'
import { setTheme, theme } from '../utils/theme'
import styles from './LandingPage.module.scss'

const LandingPage: Component = () => {
  return (
    <div class={styles.container}>
      <Card class={styles.card}>
        <h1>
          Verseghy <span>191</span>
        </h1>
        <p>
          A versenyzők az oldalon tudnak regisztrálni. A csapatvezető bejelentkezés után létre tud
          hozni csapatot. A csapattagok bejelentkezés után a csapatvezetőtől kapott kóddal tudnak
          csatlakozni.
        </p>
        <p>
          A beírt megoldások a csapattagok között automatikusan szinkronizálódnak. A megoldás akkor
          tekinthető beírtnak, ha a felső sorban a feladathoz tartozó négyzet zöldre vált. Kérjük a
          kevésbé stabil internettel rendelkezőknek, hogy különös figyelemmel legyenek erre. Ha
          sehogysem vált zöldre a négyzet egy megoldás megadása után, kérjük próbáld meg újratölteni
          az oldalt. Ha ez sem működik kérjük a csapatvezetőnek kiküldött emailben lévő csatornákon
          vegyék fel a szerverzőkkel a kapcsolatot.
        </p>
        <p>
          Az OLED kijelzővel rendelkező felhasználóknak ajánljuk a sötét téma használatát, mivel ez
          nagy mértékben csökkenti az akkumulátorhasználatot. Ez a beállítás az alább található
          kapcsolóval állítható. A verseny időtartama alatt bármikor ki és be kapcsolható ezen az
          oldalon.
        </p>
        {/* <p>Technikai probléma esetén:</p> */}
        {/* <p class={styles.link}> */}
        {/*   <span> */}
        {/*     <FontAwesomeIcon icon={faEnvelope} class={styles.icon} /> */}
        {/*     <a href="mailto:contact@zoltanszepesi.com">contact@zoltanszepesi.com</a> */}
        {/*   </span> */}
        {/*   <span> */}
        {/*     <FontAwesomeIcon icon={faPhone} class={styles.icon} /> */}
        {/*     <a href="tel:+36705227252">+36 70 522 7252</a> */}
        {/*   </span> */}
        {/* </p> */}
        <div class={styles.controls}>
          <Switch
            value={theme() === 'dark'}
            onClick={(value: boolean) => {
              console.log('asd', value)
              setTheme(value ? 'dark' : 'light')
            }}
          >
            Sötét téma
          </Switch>
          <Button href="/login" kind="primary">
            Tovább
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default LandingPage

import { Component, JSX, Show, splitProps } from 'solid-js'
import styles from './ErrorMessage.module.scss'

const TRANSLATIONS: { [key: string]: string } = {
  M000: 'internal server error',
  M001: 'missing fields',
  M002: 'syntax error',
  M003: 'missing or wrong content-type',
  M004: 'invalid data',
  M005: 'A csapatnév már foglalt',
  M006: 'A kód nem található',
  M007: 'Lezárt csapat',
  M008: 'Már csapatban vagy',
  M009: 'could not get claims',
  M010: 'A felhasználó már létezik',
  M011: 'A felhasználó nincs csapatban',
  M012: 'A felhasználó nem regisztrált',
  M013: 'A felhasználónak a csapatkapitánynak kell lennie',
  M014: 'A felhasználó nem része a csapatnak',
  M015: 'A felhasználónak a csapatkapitánynak vagy a másodlagos csapatkapitánynak kell lennie',
  M016: 'A csapatkapitányt nem lehet kirúgni',
  M017: 'Magadat nem tudod kirúgni',
  M018: 'Hiba történt a kód generálása során',
  M019: 'A csapatkapitány nem hagyhatja el a csapatot',
  M020: 'invalid jwt token',
  M021: 'the message has the wrong type',
  M022: 'did not receive auth token in time',
  M023: 'no such problem',
  M024: 'database error',
  M025: 'failed to deserialize json',
  M026: 'kafka error',
  M027: 'websocket error',
  M028: 'the problem is already inserted into the order',
  M029: 'insufficient permissions',
  M030: 'failed to get name of the user from the iam',
  M031: 'seconds are out of range',

  I000: 'internal server error',
  I001: 'internal server error',
  I002: 'invalid jwt token',
  I003: 'invalid token',
  I004: 'A felhasználó nem található',
  I005: 'internal server error',
  I006: 'Rossz email vagy jelszó',
  I007: 'Ez az email már regisztrálva van',
  I008: 'not enough permission',
  I009: 'action not found',
  I010: 'group not found',
  I011: 'missing or invalid authorization header',
  I012: 'no action or group',
  I013: 'cannot set action and group at the same time',
  I014: 'missing fields',
  I015: 'syntax error',
  I016: 'missing or wrong content-type',
  I017: 'invalid data',
}
const UNKNOWN = 'unknown error'

export interface ErrorMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  code: string
}

export const ErrorMessage: Component<ErrorMessageProps> = (props) => {
  const [local, rest] = splitProps(props, ['code', 'class'])

  const translated = () => TRANSLATIONS[local.code] ?? UNKNOWN + ' (' + local.code + ')'

  return (
    <Show when={local.code}>
      <div
        classList={{
          [styles.error]: true,
          [local.class!]: !!local.class,
        }}
        {...rest}
      >
        {translated()}
      </div>
    </Show>
  )
}

export default ErrorMessage

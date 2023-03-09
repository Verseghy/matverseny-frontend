import { Component, JSX, Show, splitProps } from 'solid-js'
import styles from './ErrorMessage.module.scss'

const TRANSLATIONS: { [key: string]: string } = {
  'M000': 'internal server error',
  'M001': 'missing fields',
  'M002': 'syntax error',
  'M003': 'missing or wrong content-type',
  'M004': 'invalid data',
  'M005': 'team name exists',
  'M006': 'join code not found',
  'M007': 'locked team',
  'M008': 'already in team',
  'M009': 'could not get claims',
  'M010': 'user already exists',
  'M011': 'user is not in a team',
  'M012': 'user is not registered',
  'M013': 'user must be the owner of the team',
  'M014': 'user is not a member of the team',
  'M015': 'user must be the owner or the co-owner of the team',
  'M016': 'cannot kick the owner of a team',
  'M017': 'cannot kick yourself',
  'M018': 'failed to generate join code',
  'M019': 'the owner cannot leave the team',
  'M020': 'invalid jwt token',
  'M021': 'the message has the wrong type',
  'M022': 'did not receive auth token in time',
  'M023': 'no such problem',
  'M024': 'database error',
  'M025': 'failed to deserialize json',
  'M026': 'kafka error',
  'M027': 'websocket error',
  'M028': 'the problem is already inserted into the order',
  'M029': 'insufficient permissions',
  'M030': 'failed to get name of the user from the iam',
  'M031': 'seconds are out of range',

  'I000': 'internal server error',
  'I001': 'internal server error',
  'I002': 'invalid jwt token',
  'I003': 'invalid token',
  'I004': 'user not found',
  'I005': 'internal server error',
  'I006': 'invalid email or password',
  'I007': 'this email is already registered',
  'I008': 'not enough permission',
  'I009': 'action not found',
  'I010': 'group not found',
  'I011': 'missing or invalid authorization header',
  'I012': 'no action or group',
  'I013': 'cannot set action and group at the same time',
  'I014': 'missing fields',
  'I015': 'syntax error',
  'I016': 'missing or wrong content-type',
  'I017': 'invalid data',
}
const UNKNOWN = 'unknown error'

export interface ErrorMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  code: string
}

export const ErrorMessage: Component<ErrorMessageProps> = (props) => {
  const [local, rest] = splitProps(props, ['code', 'class'])

  const translated = () => TRANSLATIONS[local.code] ?? UNKNOWN + ' (' + local.code +')'

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

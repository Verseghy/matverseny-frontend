import { Observable, of, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/internal/observable/dom/fetch'
import { baseFetchRequest } from './fetch'

export class TeamService {
  constructor(private baseURLMathCompetition: string) {}

  regenerateCode(): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/code`, {
      ...baseFetchRequest(),
      method: 'POST',
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  create({ name }: { name: string }): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/create`, {
      ...baseFetchRequest(),
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  disband(): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/disband`, {
      ...baseFetchRequest(),
      method: 'POST',
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  join({ code }: { code: string }): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/join`, {
      ...baseFetchRequest(),
      method: 'POST',
      body: JSON.stringify({
        code,
      }),
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  kick({ user }: { user: string }): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/kick`, {
      ...baseFetchRequest(),
      method: 'POST',
      body: JSON.stringify({
        user,
      }),
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  leave(): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team/leave`, {
      ...baseFetchRequest(),
      method: 'POST',
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }

  update({
    name,
    owner,
    co_owner,
    locked,
  }: { name?: string; owner?: string; co_owner?: string | null; locked?: boolean }): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/team`, {
      ...baseFetchRequest(),
      method: 'PATCH',
      body: JSON.stringify({
        name,
        owner,
        co_owner,
        locked,
      }),
    }).pipe(
      switchMap(async (resp) => {
        if (!resp.ok) {
          const r = await resp.json()
          throw { code: r.code }
        }
      })
    )
  }
}

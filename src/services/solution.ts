import { Observable, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/internal/observable/dom/fetch'
import { baseFetchRequest } from './fetch'

export class SolutionService {
  constructor(private baseURLMathCompetition: string) {}

  setSolution({ problem, solution }: { problem: string; solution: number | null }): Observable<void> {
    return fromFetch(`${this.baseURLMathCompetition}/v1/competition/solution`, {
      ...baseFetchRequest(),
      method: 'POST',
      body: JSON.stringify({
        problem,
        solution,
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

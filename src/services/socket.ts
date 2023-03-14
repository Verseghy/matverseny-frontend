import { BehaviorSubject, debounceTime, Observable, Subject } from 'rxjs'
import { webSocket, WebSocketSubject} from 'rxjs/webSocket'
import { localStorageTokenKey} from './fetch'
import { jwtService } from '../App'

export type MemberClass = 9 | 10 | 11 | 12
export type MemberRank = 'Owner' | 'CoOwner' | 'Member'

export interface TeamMember {
    id: string
    name: string
    klass?: MemberClass
    rank?: MemberRank
}

export interface TeamInfo {
    name: string
    code: string
    locked: boolean
    members: TeamMember[]
}

export interface TimeInfo {
    start_time: Date
    end_time: Date
}

export interface Problem {
    id: string
    body: string
    image?: string
    solution: number | null
}

interface BackendEvents {
    event: string
    data: any
}

export interface BackendError {
    code: string
    error: string
}

type SocketDesiredState  = null | 'started' | 'stopped'

export class SocketServiceSingleton {
    private desiredState: SocketDesiredState = null
    private wsSubject: WebSocketSubject<BackendEvents> | null = null
    private wsErrors$ = new Subject<BackendError | string | undefined>()
    private _teamInfo$: BehaviorSubject<TeamInfo | null | undefined> = new BehaviorSubject<TeamInfo | null | undefined>(undefined)
    private _teamInfo: TeamInfo | null = null
    private _time$: BehaviorSubject<TimeInfo | undefined> = new BehaviorSubject<TimeInfo | undefined>(undefined)
    private _problems$: BehaviorSubject<Problem[] | undefined> = new BehaviorSubject<Problem[] | undefined>(undefined)
    private _problems: Problem[] = []

    constructor(private baseURL: string) {
        setInterval(() => {
            switch (this.desiredState){
                case 'started':
                    this._start()
                    break
                case 'stopped':
                    this._stop()
                    break
                case null:
                default:
                    break
            }
        }, 1000)
    }

    start() {
        this.desiredState = 'started'
    }
    stop() {
        this.desiredState = 'stopped'
    }

    // if teamInfo gets null we got kicked
    teamInfo(): Observable<TeamInfo | null | undefined> {
        return this._teamInfo$
    }

    time(): Observable<TimeInfo | undefined> {
        return this._time$
    }

    wsErrors(): Observable<BackendError | string | undefined> {
        return this.wsErrors$
    }

    problems(): Observable<Problem[] | undefined> {
        return this._problems$.pipe(
            debounceTime(1000)
        )
    }

    private _start() {
        if (this.wsSubject) {
            return
        }
        this.wsSubject = webSocket<BackendEvents>({
            url: `${this.baseURL}/ws`,
            closeObserver: {
                next: (e) => {
                    this.wsSubject = null
                    const reason = JSON.parse(e.reason)
                    if (reason.code === 'M011') {
                        this._teamInfo = null
                        this._teamInfo$.next(null)
                        this.stop()
                        return
                    }
                    if (reason.code) {
                        return
                    }
                    this.handleEvent(reason)
                }
            }
        })
        this.wsSubject.subscribe({
            next: event => this.handleEvent(event),
            complete: () => {
                this.wsSubject = null
                this._teamInfo = null
                this._problems = []
                this._time$.next(undefined)
            },
            error: (err) => {
                this.wsSubject = null
                try {
                    const reason = JSON.parse(err.reason)
                    this.wsErrors$.next(reason)
                    console.log(reason)
                } catch (e) {
                    this.wsErrors$.next(err.reason)
                    console.log(err.reason)
                }
                console.error(err)
                this._teamInfo = null
                this._problems = []
            }
        })
        this.wsSubject.next({
            // @ts-ignore
            token: localStorage.getItem(localStorageTokenKey)
        })
    }

    private _stop() {
        this.wsSubject?.complete()
        this.wsSubject = null
    }

    private handleEvent(event: BackendEvents) {
        switch (event.event) {
            case 'TEAM_INFO':
                this._teamInfo = event.data
                this._teamInfo$.next(this._teamInfo)
                break
            case 'JOIN_TEAM':
                this._teamInfo?.members.push({id: event.data.user, name: event.data.name})
                this._teamInfo$.next(this._teamInfo)
                break
            case 'KICK_USER':
            case 'LEAVE_TEAM':
                if (!this._teamInfo) break
                this._teamInfo.members = this._teamInfo?.members.filter(member => member.id !== event.data.user)
                if (jwtService.getClaimsOnce()?.sub.endsWith(event.data.user)) {
                    this._teamInfo$.next(null)
                    break
                }
                this._teamInfo$.next(this._teamInfo)
                break
            case 'UPDATE_TEAM':
                if (!this._teamInfo) break
                this._teamInfo = {
                    ...this._teamInfo,
                    ...event.data
                }
                if (event.data.co_owner) {
                    // @ts-ignore can't be null typescript is stupid
                    this._teamInfo.members =this._teamInfo?.members.map(m => {
                        return {
                            ...m,
                            rank: m.rank !== 'Owner' ? (m.id === event.data.co_owner ? 'CoOwner' : 'Member') : 'Owner'
                        }
                    })
                }
                if (event.data.co_owner == null) {
                    // @ts-ignore can't be null typescript is stupid
                    this._teamInfo.members =this._teamInfo?.members.map(m => {
                        return {
                            ...m,
                            rank: m.rank === 'Owner' ? 'Owner' : 'Member'
                        }
                    })
                }
                this._teamInfo$.next(this._teamInfo)
                break
            case 'DISBAND_TEAM':
                this._teamInfo$.next(null)
                break

            case 'UPDATE_TIME':
                this._time$.next({
                    start_time: new Date(event.data.start_time * 1000),
                    end_time: new Date(event.data.end_time * 1000)
                })
                break
            case 'SOLUTION_SET':
                this._problems = this._problems.map(problem => {
                    if (problem.id === event.data.problem) {
                        return {
                            ...problem,
                            solution: event.data.solution ?? null
                        }
                    }
                    return problem
                })
                this._problems$.next(this._problems)
                break

            case 'INSERT_PROBLEM':
                if (event.data.before) {
                    this._problems.splice(this._problems.findIndex(problem => problem.id === event.data.before), 0, {...event.data, before: undefined})
                } else {
                    this._problems.push(event.data)
                }
                this._problems$.next(this._problems)
                break

            case 'DELETE_PROBLEM':
                this._problems = this._problems.filter(problem => problem.id !== event.data.id)
                this._problems$.next(this._problems)
                break

            case 'SWAP_PROBLEMS':
                const indexA = this._problems.findIndex(problem => problem.id === event.data.id1)
                const indexB = this._problems.findIndex(problem => problem.id === event.data.id2)

                ;[this._problems[indexA], this._problems[indexB]] = [this._problems[indexB], this._problems[indexA]]
                this._problems$.next(this._problems)
                break

            case 'UPDATE_PROBLEM':
                this._problems = this._problems.map(problem => {
                    if (problem.id === event.data.id) {
                        return {
                            ...problem,
                            ...event.data,
                        }
                    }
                    return problem
                })
                this._problems$.next(this._problems)
                break
        }
    }
}

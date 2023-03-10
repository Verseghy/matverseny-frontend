import {BehaviorSubject, Observable, of, shareReplay, Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {localStorageTokenKey} from "./fetch";

export type MemberClass = 9 | 10 | 11 | 12
export type MemberRank = "Owner" | "CoOwner" | "Member"

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

interface BackendEvents {
    event: string
    data: any
}

export class SocketServiceSingleton {
    private wsSubject: WebSocketSubject<BackendEvents> | null = null
    private _teamInfo$: BehaviorSubject<TeamInfo | null | undefined> = new BehaviorSubject<TeamInfo | null | undefined>(undefined)
    private _teamInfo: TeamInfo | null = null
    private _time$: BehaviorSubject<TimeInfo | undefined> = new BehaviorSubject<TimeInfo | undefined>(undefined)

    constructor(private baseURL: string) {
    }

    start() {
        if (this.wsSubject) {
            return
        }
        this.wsSubject = webSocket<BackendEvents>(`${this.baseURL}/ws`)
        this.wsSubject.next({
            // @ts-ignore
            token: localStorage.getItem(localStorageTokenKey)
        })
        this.wsSubject.subscribe({
            next: event => {
                switch (event.event) {
                    case "TEAM_INFO":
                        this._teamInfo = event.data
                        this._teamInfo$.next(this._teamInfo)
                        break
                    case "JOIN_TEAM":
                        this._teamInfo?.members.push({id: event.data.user, name: event.data.name})
                        this._teamInfo$.next(this._teamInfo)
                        break
                    case "KICK_USER":
                    case "LEAVE_TEAM":
                        if (!this._teamInfo) break
                        this._teamInfo.members = this._teamInfo?.members.filter(member => member.id !== event.data.user)
                        this._teamInfo$.next(this._teamInfo)
                        break
                    case "UPDATE_TEAM":
                        if (!this._teamInfo) break
                        this._teamInfo = {
                            ...this._teamInfo,
                            ...event.data
                        }
                        this._teamInfo$.next(this._teamInfo)
                        break
                    case "DISBAND_TEAM":
                        this._teamInfo$.next(null)
                        break

                    case "UPDATE_TIME":
                        this._time$.next(event.data)
                }
            },
            complete: () => {
                this.wsSubject = null
                this._teamInfo = undefined
                this._teamInfo$.next(undefined)
                this._time$.next(undefined)
            },
            error: (err) => {
                console.error(err)
                this.wsSubject = null
                setTimeout(() => {
                    this.start()
                }, 2000)
            }
        })
    }
    stop() {
        this.wsSubject?.unsubscribe()
    }

    // if teamInfo completes we got kicked
    teamInfo(): Observable<TeamInfo | null | undefined> {
        return this._teamInfo$
    }

    time(): Observable<TimeInfo | undefined> {
        return this._time$
    }
}

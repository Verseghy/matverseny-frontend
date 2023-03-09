import {Observable, of, Subject} from "rxjs";
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
    type: string
    data: any
}

export class SocketServiceSingleton {
    private wsSubject: WebSocketSubject<BackendEvents> | null = null
    private _teamInfo$: Subject<TeamInfo | null> = new Subject<TeamInfo | null>()
    private _teamInfo: TeamInfo | null = null
    private _time$: Subject<TimeInfo> = new Subject<TimeInfo>()

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
        this.wsSubject.subscribe(event => {
            switch (event.type) {
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
                    this.wsSubject?.complete()
                    break

                case "UPDATE_TIME":
                    this._time$.next(event.data)
            }
        })
    }
    stop() {
        this.wsSubject?.unsubscribe()
    }

    // if teamInfo completes we got kicked
    teamInfo(): Observable<TeamInfo | null> {
        return this._teamInfo$
    }

    time(): Observable<TimeInfo> {
        return this._time$
    }
}

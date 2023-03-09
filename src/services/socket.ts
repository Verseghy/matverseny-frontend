import {Observable, of, Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {localStorageTokenKey} from "./fetch";

export type MemberClass = 9 | 10 | 11 | 12
export type MemberRank = "Owner" | "CoOwner" | "Member"

export interface TeamMember {
    id: string
    name: string
    klass: MemberClass
    rank: MemberRank
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

}

export class SocketServiceSingleton {
    wsSubject: WebSocketSubject<BackendEvents> | null = null
    _teamInfo: Subject<TeamInfo | null>

    constructor(private baseURL: string) {
    }

    start() {
        if (this.wsSubject) {
            throw {error: "socket already started"}
        }
        this.wsSubject = webSocket<BackendEvents>(`${this.baseURL}/ws`)
        this.wsSubject.next({
            // @ts-ignore
            token: localStorage.getItem(localStorageTokenKey)
        })
        this.wsSubject.subscribe(event => {
            console.log(event)
        })
    }
    stop() {
        this.wsSubject?.unsubscribe()
    }

    // if teamInfo completes we got kicked
    teamInfo(): Observable<TeamInfo | null> {
        return this._teamInfo
    }

    time(): Observable<TimeInfo> {
        return of({start_time: new Date(), end_time: new Date()})
    }
}

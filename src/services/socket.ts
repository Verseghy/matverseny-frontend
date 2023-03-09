import {Observable, of} from "rxjs";

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

export class SocketServiceSingleton {
    constructor(private baseURL: string) {
    }

    start() {}
    stop() {}

    // if teamInfo completes we got kicked
    teamInfo(): Observable<TeamInfo | null> {
        return of(null)
    }
}

import {Observable, of} from "rxjs";

export class TeamService {
    constructor(private baseURLIAM: string, private baseURLMathCompetition: string) {
    }

    regenerateCode(): Observable<string> {
        return of("")
    }

    create({name}: {name: string}): Observable<void> {
        return of()
    }

    disband(): Observable<void> {
        return of()
    }

    join({code}: {code: string}): Observable<void> {
        return of()
    }

    kick({user}: {user: string}): Observable<void> {
        return of()
    }

    leave(): Observable<void> {
        return of()
    }

    update({name, owner, co_owner, locked}: {name?: string, owner?: string, co_owner?: string | null, locked?: boolean}): Observable<void> {
        return of()
    }
}

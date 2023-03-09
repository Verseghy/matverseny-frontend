import {map, Observable, of, switchMap, throwError} from "rxjs";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {baseFetchRequest} from "./fetch";

const localStorageTokenKey = "IAMToken"

export class AuthService {
    constructor(private baseURLIAM: string, private baseURLMathCompetition: string) {
    }

    login({email, password}: {email: string, password: string}): Observable<string> {
        return fromFetch(`${this.baseURLIAM}/v1/users/login`, {
            ...baseFetchRequest,
            method: "POST",
            body: JSON.stringify({
                email,
                password
            }) as any
        }).pipe(
            switchMap(resp => resp.json()),
            map(r => {
                if (r.error) {
                    console.error(r)
                    throw {code: r.code}
                }

                localStorage.setItem(localStorageTokenKey, r.token)
                return r.token
            })
        )
    }

    register({email, password, name, school, klass}: {email: string, password: string, name: string, school: string, klass: string}): Observable<string> {
        return fromFetch(`${this.baseURLIAM}/v1/users/register`, {
            ...baseFetchRequest,
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                name
            }) as any
        }).pipe(
            switchMap(resp => resp.json()),
            switchMap(r => {
                if (r.error && r.code != 'I007') {
                    console.error(r)
                    throw {code: r.code}
                }

                return this.login({email, password})
            })
        )
    }
}

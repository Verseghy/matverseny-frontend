import {map, Observable, switchMap} from "rxjs";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {baseFetchRequest } from "./fetch";
import {MemberClass} from "./socket";
import {jwtService, socketService} from "../App";

export class AuthService {
    constructor(private baseURLIAM: string, private baseURLMathCompetition: string) {
    }

    login({email, password}: {email: string, password: string}): Observable<string> {
        return fromFetch(`${this.baseURLIAM}/v1/users/login`, {
            ...baseFetchRequest(),
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }).pipe(
            switchMap(resp => resp.json()),
            map(r => {
                if (r.error) {
                    console.error(r)
                    throw {code: r.code}
                }

                jwtService.setToken(r.token)
                return r.token
            })
        )
    }

    register({email, password, name, school, klass}: {email: string, password: string, name: string, school: string, klass: MemberClass}): Observable<void> {
        return fromFetch(`${this.baseURLIAM}/v1/users/register`, {
            ...baseFetchRequest(),
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                name
            })
        }).pipe(
            switchMap(resp => resp.json()),
            switchMap(r => {
                if (r.error && r.code != 'I007') {
                    console.error(r)
                    throw {code: r.code}
                }

                return this.login({email, password})
            }),
            switchMap(() => {
                return fromFetch(`${this.baseURLMathCompetition}/register`, {
                    ...baseFetchRequest(),
                    method: "POST",
                    body: JSON.stringify({
                        school,
                        "class": klass
                    })
                }).pipe(
                    switchMap(async resp => {
                        if (!resp.ok) {
                            const r = await resp.json()
                            throw {code: r.code}
                        }
                    })
                )
            })
        )
    }

    logout() {
        socketService.stop()
        jwtService.setToken(undefined)
    }
}

import { jwtDecode } from "jwt-decode";
import {BehaviorSubject, map, Observable} from "rxjs";

export const localStorageTokenKey = "IAMToken"

export const baseFetchRequest: () => Request = () => ({
    cache: "no-cache",
    credentials: "omit",
    headers: {
        // @ts-ignore
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem(localStorageTokenKey)}`
    },
    mode: "cors",
    redirect: "follow",
    referrerPolicy: "no-referrer",
})

export interface JWTClaims {
    sub: string
    exp: number
}

export class JWTService {
    private _jwtToken$ = new BehaviorSubject<string | undefined>(undefined)

    setToken(t: string | undefined) {
        if (t) {
          localStorage.setItem(localStorageTokenKey, t)
        } else {
          localStorage.removeItem(localStorageTokenKey)
        }
        this._jwtToken$.next(t)
    }

    getClaimsOnce(): JWTClaims | undefined {
        if (!localStorage.getItem(localStorageTokenKey)) {
            return undefined
        }
        const claims = jwtDecode<JWTClaims>(localStorage.getItem(localStorageTokenKey)!)
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        if (new Date(claims.exp * 1000) < date) {
            return undefined
        }
        return claims
    }

    getClaims(): Observable<JWTClaims | undefined> {
        return this._jwtToken$.pipe(
            map(() => {
                if (!localStorage.getItem(localStorageTokenKey)) {
                    return undefined
                }
                const claims = jwtDecode<JWTClaims>(localStorage.getItem(localStorageTokenKey)!)
                const date = new Date()
                date.setHours(0, 0, 0, 0)
                if (new Date(claims.exp * 1000) < date) {
                    return undefined
                }
                return claims
            })
        )
    }
}

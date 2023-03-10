import jwt_decode from "jwt-decode";
import {BehaviorSubject, map, Observable} from "rxjs";

export const localStorageTokenKey = "IAMToken"

export const baseFetchRequest: Request = {
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
}

export interface JWTClaims {
    sub: string
}

export class JWTService {
    private _jwtToken$ = new BehaviorSubject<string | undefined>(undefined)

    setToken(t: string) {
        localStorage.setItem(localStorageTokenKey, t)
        this._jwtToken$.next(t)
    }

    getClaims(): Observable<JWTClaims | undefined> {
        return this._jwtToken$.pipe(
            map(() => {
                if (!localStorage.getItem(localStorageTokenKey)) {
                    return undefined
                }
                return jwt_decode<JWTClaims>(localStorage.getItem(localStorageTokenKey)!)
            })
        )
    }
}

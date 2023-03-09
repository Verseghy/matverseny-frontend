import jwt_decode from "jwt-decode";

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

export function jwtClaims(): JWTClaims | null {
    if (!localStorage.getItem(localStorageTokenKey)) {
        return null
    }
    return jwt_decode<JWTClaims>(localStorage.getItem(localStorageTokenKey)!)
}

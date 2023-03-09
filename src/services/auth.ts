import {Observable, of} from "rxjs";

export class AuthService {
    constructor(private baseURL: string) {
    }

    login({email, password}: {email: string, password: string}): Observable<string> {
        return of("")
    }

    register({email, password, name, school, klass}: {email: string, password: string, name: string, school: string, klass: string}): Observable<string> {
        return of("")
    }
}

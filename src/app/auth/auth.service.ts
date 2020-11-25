import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
    providedIn: "root"
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { };
    private isAuthenticated = false;
    private token;
    private authListener = new Subject<boolean>();
    private tokenTimer: any;
    private userId: string;

    getToken() {
        return this.token;
    }

    getUserid() {
        return this.userId;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authListener.asObservable();
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authListener.next(true);
        }
    }

    createUser(email: String, password: String) {
        const authData: AuthData = { email: email, password: password };
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(response => {
                this.router.navigate(['/']);
            }, error => {
                this.authListener.next(false);
            });
    }

    login(email: String, password: String) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    //console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, response.userId);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authListener.next(false);
            });
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if (!token && !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}
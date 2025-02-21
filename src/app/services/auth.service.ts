import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private username: string | null = null;

  constructor() {
    // Try to get token and username from localStorage on service initialization
    this.token = localStorage.getItem('auth_token');
    this.username = localStorage.getItem('username');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return this.username;
  }

  clearToken() {
    this.token = null;
    this.username = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { Utilizador } from '../../model/db.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/utilizadores'; 
  private currentUser = new BehaviorSubject<Utilizador | null>(null); 

  private errorHandler(error: HttpErrorResponse){
    if(error.status===404){
      return throwError(() => error.message)
    }else {
      return throwError(() => "Ocorreu um erro")
    }
  }

  constructor(private http: HttpClient) {
    this.loadUserFromSessionStorage(); 
  }

  // Método para fazer login
  login(email: string, senha: string): Observable<boolean> {
    return this.http.get<Utilizador[]>(`${this.authUrl}?email=${email}&senha=${senha}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.currentUser.next(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        }
        return false;
      }),
      catchError(this.errorHandler)
    );
  }

  
  logout(): void {
    this.currentUser.next(null);
    sessionStorage.removeItem('currentUser');
  }

 
  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }

 
  user(): Observable<Utilizador | null> {
    return this.currentUser.asObservable();
  }

  
  private loadUserFromSessionStorage(): void {
    let userStored = sessionStorage.getItem('currentUser');
    if (userStored) {
      // let user = JSON.parse(userStored) as Utilizador;
      this.currentUser.next(JSON.parse(userStored));
    }
  }

  registerUser(utilizador: Utilizador): Observable<Utilizador> {
    return this.http.post<Utilizador>(this.authUrl, utilizador);
  }

  updateUser(user: Utilizador): Observable<Utilizador> {
    return this.http.put<Utilizador>(`${this.authUrl}/${user.id}`, user);
  }

  getCurrentUser(): Observable<Utilizador | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): number | null {
    let currentUser2 = this.currentUser.value;
    return currentUser2 ? currentUser2.id : null;
  }

  
}

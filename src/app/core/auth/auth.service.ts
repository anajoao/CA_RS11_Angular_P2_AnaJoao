import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { Utilizador } from '../../model/db.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/utilizadores'; 
  private authStatus = new BehaviorSubject<boolean>(false); 
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
          this.authStatus.next(true);
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
    this.authStatus.next(false);
    this.currentUser.next(null);
    sessionStorage.removeItem('currentUser'); 
  }

 
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

 
  user(): Observable<Utilizador | null> {
    return this.currentUser.asObservable();
  }

  
  private loadUserFromSessionStorage(): void {
    let user = sessionStorage.getItem('currentUser');
    if (user) {
      let user2 = JSON.parse(user);
      this.authStatus.next(true); 
      this.currentUser.next(user2);
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<Utilizador[]>(`${this.authUrl}?email=${email}`).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }

  registerUser(utilizador: Utilizador): Observable<Utilizador> {
    return this.http.post<Utilizador>(this.authUrl, utilizador);
  }

  updateUser(user: Utilizador): Observable<Utilizador> {
    return this.http.put<Utilizador>(`${this.authUrl}/${user.id}`, user);
  }

  getCurrentUserId(): number | null {
    const currentUser2 = this.currentUser.value;
    return currentUser2 ? currentUser2.id : null;
  }

  
}

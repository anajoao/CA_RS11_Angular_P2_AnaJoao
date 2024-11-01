import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../model/db.type';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  private urlAPI="http://localhost:3000/produtos";

  constructor(private http : HttpClient){}

  getProdutosEmDestaque(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.urlAPI}?destaque=true`);
  }

  getProductById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.urlAPI}/${id}`);
  }

}

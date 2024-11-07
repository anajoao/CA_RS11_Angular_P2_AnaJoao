import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Produto } from '../model/db.type';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  private urlAPI="http://localhost:3000/produtos";

  constructor(private http : HttpClient){}

  private errorHandler(error: HttpErrorResponse){
    if(error.status===404){
      return throwError(() => error.message)
    }else {
      return throwError(() => "Ocorreu um erro")
    }
  }

  getProdutosEmDestaque(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.urlAPI}?destaque=true`);
  }

  getProductById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.urlAPI}/${id}`);
  }

  getProdutos(filtro?: { tipo?: string; cor?: string }): Observable<Produto[]> {
    let filterUrl = `${this.urlAPI}`;

    // Aplicar os filtros se existirem
    if (filtro && (filtro.tipo || filtro.cor)) {
      filterUrl += '?';
      if (filtro.tipo) {
        filterUrl += `tipo_de_produto=${filtro.tipo}&`;
      }
      if (filtro.cor) {
        filterUrl += `cor=${filtro.cor}&`;
      }
      filterUrl = filterUrl.slice(0, -1);
    }

    return this.http.get<Produto[]>(filterUrl);
  }

}

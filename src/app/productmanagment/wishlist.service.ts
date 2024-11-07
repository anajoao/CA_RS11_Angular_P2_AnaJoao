import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, forkJoin, map, mergeMap, Observable, switchMap, tap, throwError } from 'rxjs';
import { Produto, Wishlist } from '../model/db.type';
import { ProductserviceService } from './productservice.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistUrl = 'http://localhost:3000/wishlist';
  private productsUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient, private productService: ProductserviceService) {}

  private errorHandler(error: HttpErrorResponse){
    if(error.status===404){
      return throwError(() => error.message)
    }else {
      return throwError(() => "Ocorreu um erro")
    }
  }

  getUserWishlist(userId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.wishlistUrl}?userId=${userId}`);
  }

  removeFromWishlist(userId: number, productId: number): Observable<void> {
    
    const url = `${this.wishlistUrl}?userId=${userId}&productId=${productId}`;
  
  
    return this.http.get<{ id: number }[]>(url).pipe(
    
      switchMap(items => {
        if (items.length > 0) {
          const wishlistItemId = items[0].id;
          return this.http.delete<void>(`${this.wishlistUrl}/${wishlistItemId}`);
        } else {
        
          return throwError(() => new Error("Item não encontrado na wishlist"));
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getWishlistWithProducts(userId: number): Observable<Produto[]> {
    return this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`).pipe(
      mergeMap((wishlistItems: Wishlist[]) => {
        
        let productIds = wishlistItems.map(item => item.produtoId);
  
    
        let productRequests = productIds.map(id => this.productService.getProductById(id));
  
       
        return forkJoin(productRequests);
      }),
      catchError(this.errorHandler)
    );
  }

}


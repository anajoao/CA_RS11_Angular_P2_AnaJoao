import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, forkJoin, map, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Produto, Wishlist } from '../model/db.type';
import { ProductserviceService } from './productservice.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistUrl = 'http://localhost:3000/wishlist';
  private produtosNaWishlist: number[] = [];

  constructor(private http: HttpClient, private productService: ProductserviceService) {}

  private errorHandler(error: HttpErrorResponse){
    if(error.status===404){
      return throwError(() => error.message)
    }else {
      return throwError(() => "Ocorreu um erro")
    }
  }

  removeFromWishlist(userId: number, productId: number): Observable<void> {
    const url = `${this.wishlistUrl}?userId=${userId}&productId=${productId}`;

  // Primeiro, obtém o item da wishlist a ser removido
    return this.http.get<{ id: number, produtoId: number }[]>(url).pipe(
      map(items => {
        const itemToRemove = items.find(item => item.produtoId === productId);
        
        if (!itemToRemove) {
          throw new Error("Item não encontrado na wishlist");
        }

        // Faz a remoção do item encontrado
        this.http.delete<void>(`${this.wishlistUrl}/${itemToRemove.id}`).subscribe(() => {
          // Atualiza o estado local e o sessionStorage
          this.produtosNaWishlist = this.produtosNaWishlist.filter(id => id !== productId);
        });
    }),
    catchError(this.errorHandler)
  );
  }

  getAllWishlists(userId: number): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`).pipe(
      map(wishlist => {
        console.log('Wishlist recebida:', wishlist);
        if (Array.isArray(wishlist)) {
          this.produtosNaWishlist = wishlist.map(item => item.produtoId);
          return wishlist;
        } else {
          throw new Error('Formato de resposta inválido da API');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getWishlistWithProducts(userId: number): Observable<Produto[]> {
    return this.getAllWishlists(userId).pipe(
      map(wishlistItems => {
        const productIds = wishlistItems.map(item => item.produtoId);
        let products: Produto[] = [];
        productIds.forEach(id => {
          this.productService.getProductById(id).subscribe(prod => {
            products.push(prod);
          });
        });
        return products;
      }),
      catchError(this.errorHandler)
    );
    
  }

  addToWishlist(userId: number, produtoId: number): Observable<Wishlist> {
    let item = { userId, produtoId };
    return this.http.post<Wishlist>(this.wishlistUrl, item).pipe(
      map(response => {this.produtosNaWishlist.push(produtoId);
        return response;
      })
    );
  }

  isInWishlist(userId: number, produtoId: number): boolean {
    return this.produtosNaWishlist.includes(produtoId);
  }

}


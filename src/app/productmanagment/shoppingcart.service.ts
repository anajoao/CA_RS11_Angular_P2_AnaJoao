import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Produto, Shoopingcart } from '../model/db.type';
import { ProductserviceService } from './productservice.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {

  private cartUrl = 'http://localhost:3000/shoppingcart';
  produtosNoCarrinho: number[] = [];

  constructor(private http: HttpClient, private productService: ProductserviceService) {}

  private errorHandler(error: HttpErrorResponse){
    if(error.status===404){
      return throwError(() => error.message)
    }else {
      return throwError(() => "Ocorreu um erro")
    }
  }

  getAllCartItems(userId: number): Observable<Shoopingcart[]> {
    return this.http.get<Shoopingcart[]>(`${this.cartUrl}?userId=${userId}`).pipe(
      map(cart => {
        console.log('cart recebida:', cart);
        if (Array.isArray(cart)) {
          this.produtosNoCarrinho = cart.map(item => item.produtoId);
          return cart;
        } else {
          throw new Error('Formato de resposta inválido da API');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getCartProducts(userId: number): Observable<Produto[]> {
    return this.getAllCartItems(userId).pipe(
      map(cartItems => {
        const productIds = cartItems.map(item => item.produtoId);
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

  // Método para adicionar um produto ao carrinho
  addToCart(userId: number, produtoId: number): Observable<Shoopingcart> {
    let cartItem = { userId, produtoId };
    return this.http.post<Shoopingcart>(this.cartUrl, cartItem).pipe(
      map(response => {
        this.produtosNoCarrinho.push(produtoId);
        return response; 
      })
    );
  }

  // Método para remover um item do carrinho
  removeFromCart(userId: number, productId: number): Observable<void> {
    const url = `${this.cartUrl}?userId=${userId}&productId=${productId}`;

    return this.http.get<{ id: number, produtoId: number }[]>(url).pipe(
      map(items => {
        const itemToRemove = items.find(item => item.produtoId === productId);
        if (itemToRemove) {
          this.http.delete<void>(`${this.cartUrl}/${itemToRemove.id}`).subscribe(() => {
            // Atualiza o estado local e o sessionStorage
            this.produtosNoCarrinho = this.produtosNoCarrinho.filter(id => id !== productId);
          });
        } else {
          console.warn("Item não encontrado no carrinho");
        }
      }),
      catchError(this.errorHandler)
    );
  }

  // Verificar se o produto está no carrinho
  isInCart(userId: number, productId: number): boolean {
    return this.produtosNoCarrinho.includes(productId);
  }

}

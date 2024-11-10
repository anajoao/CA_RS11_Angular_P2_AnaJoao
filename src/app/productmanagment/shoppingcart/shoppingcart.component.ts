import { Component } from '@angular/core';
import { Produto } from '../../model/db.type';
import { ShoppingcartService } from '../shoppingcart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoppingcart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingcart.component.html',
  styleUrl: './shoppingcart.component.css'
})
export class ShoppingcartComponent {
  cartProducts: Produto[] = [];

  constructor(private cartService: ShoppingcartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    this.loadCartProducts(userId!);
  }

  loadCartProducts(userId: number) {
    this.cartService.getCartProducts(userId).subscribe({
      next: (products) => {
        console.log("Produtos carregados:", products);
        this.cartProducts = products;
      }
    });
  }

  removeFromCart(productId: number, event: MouseEvent): void {
    event.stopPropagation();
    const userId = this.authService.getCurrentUserId();
    this.cartService.removeFromCart(userId!, productId).subscribe(() => {
      this.cartProducts = this.cartProducts.filter(produto => produto.id !== productId);
    });
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/produto', productId]);
  }

  getTotalPrice(): number {
    return this.cartProducts.reduce((total, product) => total + product.preco, 0);
  }
}

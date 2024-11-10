import { Component } from '@angular/core';
import { Produto } from '../../model/db.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductserviceService } from '../productservice.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ShoppingcartService } from '../shoppingcart.service';

@Component({
  selector: 'app-productinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productinfo.component.html',
  styleUrl: './productinfo.component.css'
})
export class ProductinfoComponent {
  productInfo!: Produto;
  nonExistingIdError: boolean = false;
  isAuthenticated = false;
  cartProducts: Produto[] = [];

  constructor(private activeroute: ActivatedRoute, private productService: ProductserviceService, private router: Router, private authService: AuthService, private cartService: ShoppingcartService) {}

  ngOnInit(): void {
    const paramId = this.activeroute.snapshot.paramMap.get('id');
    if (Number(paramId)) {
      const id = Number(paramId);
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.productInfo = product;
          console.log(this.productInfo);
        },
        error: (error) => {
          console.error(error);
          this.nonExistingIdError = true;
        }
      });
    } else {
      this.router.navigate(['error']);
    }
    this.loadCartProducts();
    this.authService.getCurrentUser().subscribe(user => {
      this.isAuthenticated = user ? true : false;
    });
  }

  loadCartProducts() {
    const userId = this.authService.getCurrentUserId();
    this.cartService.getCartProducts(userId!).subscribe({
      next: (products) => {
        this.cartProducts = products;
        console.log("Produtos no carrinho:", this.cartProducts);
      }
    });
  }

  addToCart(produto: Produto) {
    const userId = this.authService.getCurrentUserId();
  
    if (this.cartService.isInCart(userId!, produto.id)) {
      alert("Produto já está no carrinho!");
    } else {
      // Usar apenas o serviço para adicionar ao carrinho
      this.cartService.addToCart(userId!, produto.id).subscribe(() => {
        alert("Produto adicionado ao carrinho!");
      });
    }
  }

  isInCart(productId: number): boolean {
    const userId = this.authService.getCurrentUserId();
    return this.cartService.isInCart(userId!, productId);
  }

}

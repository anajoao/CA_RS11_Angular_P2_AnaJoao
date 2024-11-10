import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Produto } from '../../model/db.type';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistProducts: Produto[] = [];
  userId!: number;

  constructor(
    private wishlistService: WishlistService, private authService: AuthService, private route: ActivatedRoute) {}

    ngOnInit(): void {
      const userId = this.authService.getCurrentUserId();
      this.loadWishlistProducts(userId!);
    }
    
    loadWishlistProducts(userId: number) {
      this.wishlistService.getWishlistWithProducts(userId).subscribe({
        next: (products) => {
          console.log("Produtos carregados:", products);
          this.wishlistProducts = products;
        }
      });
    }

  removeItem(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.wishlistService.removeFromWishlist(userId, productId).subscribe(() => {
        this.wishlistProducts = this.wishlistProducts.filter(p => p.id !== productId);
      });
    }
  }
}

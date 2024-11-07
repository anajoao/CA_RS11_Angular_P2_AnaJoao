import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Produto } from '../../model/db.type';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistProducts: Produto[] = [];

  constructor(private wishlistService: WishlistService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.wishlistService.getWishlistWithProducts(userId).subscribe((products) => {
        this.wishlistProducts = products;
      });
    }
  }

  removeItem(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.wishlistService.removeFromWishlist(userId, productId).subscribe(() => {
        this.wishlistProducts = this.wishlistProducts.filter(product => product.id !== productId);
      });
    }
  }
}

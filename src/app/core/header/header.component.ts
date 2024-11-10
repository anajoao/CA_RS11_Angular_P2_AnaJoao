import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginmodalComponent } from "../auth/loginmodal/loginmodal.component";
import { AuthService } from '../auth/auth.service';
import { Utilizador } from '../../model/db.type';
import { LogoutmodalComponent } from "../auth/logoutmodal/logoutmodal.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginmodalComponent, LogoutmodalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false; 
  isLoginModalOpen = false; 
  isLogoutModalOpen = false;
  userName: string = "";
  currentUser: Utilizador | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = user ? true : false;
    });
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegister() {
    this.router.navigate(['/register']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToWishlist() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.router.navigate([`/wishlist/${userId}`]);
    } 
  }

  goToShoppingcart(){
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.router.navigate([`/shoppingcart/${userId}`]);
    } 
  }

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }
}

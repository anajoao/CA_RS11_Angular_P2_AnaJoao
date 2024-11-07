import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginmodalComponent } from "../auth/loginmodal/loginmodal.component";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginmodalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false; 
  isLoginModalOpen = false; 
  userName: string = "";

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    
    this.authService.isAuthenticated().subscribe(status => {
      this.isAuthenticated = status;
      if (status) {
    
        this.authService.user().subscribe(user => {
          this.userName = user ? user.nome : ""; 
        });
      } else {
        this.userName = ""; 
      }
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
    this.router.navigate(['/wishlist']);
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/']); 
  }
}

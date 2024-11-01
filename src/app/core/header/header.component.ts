import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Variável para controlar o estado de autenticação do usuário
  isAuthenticated = false;

  constructor(private router: Router) {}

  // Método para abrir o modal de login
  openLogin() {
    // Lógica para abrir o modal de login
    console.log("Abrir modal de login");
  }

  // Método para abrir o modal de registro
  openRegister() {
    // Lógica para abrir o modal de registro
    console.log("Abrir modal de registro");
  }

  // Método para navegar para a página de perfil do usuário
  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  // Método para navegar para a página de wishlist do usuário
  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  // Método para realizar o logout do usuário
  logout() {
    this.isAuthenticated = false;
    // Redireciona para a página inicial após o logout
    this.router.navigate(['/']);
    console.log("Usuário deslogado");
  }
}

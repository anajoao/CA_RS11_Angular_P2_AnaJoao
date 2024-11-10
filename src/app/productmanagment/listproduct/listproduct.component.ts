import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductserviceService } from '../productservice.service';
import { Produto, Utilizador, Wishlist } from '../../model/db.type';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../../core/auth/auth.service';
import { ShoppingcartService } from '../shoppingcart.service';

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {
  isAuthenticated = false; 
  currentUser: Utilizador | null = null;
  produtos: Produto[] = []; 
  produtosVisiveis: Produto[] = []; 
  todosProdutos: Produto[] = [];
  totalProdutos: number = 0; 
  produtosPorPagina: number = 6; 
  paginaAtual: number = 1;
  wishlistProducts: Produto[] = [];
  cartProducts: Produto[] = [];
  selectedProductId!: number;

  filtro = {
    tipo: 'Todos',
    cor: 'Todos'
  };

  constructor(private produtoService: ProductserviceService, private router: Router, private wishlistService: WishlistService, private authService: AuthService, private cartService: ShoppingcartService) {}

  ngOnInit(): void {
    this.getProdutos(); 
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = user ? true : false;
    });
    const userId = this.authService.getCurrentUserId();
    this.loadWishlistProducts(userId!);
    this.loadCartProducts(userId!);
  }

  loadWishlistProducts(userId: number) {
    this.wishlistService.getWishlistWithProducts(userId).subscribe({
      next: (products) => {
        console.log("Produtos carregados:", products);
        this.wishlistProducts = products;
      }
    });
  }

  loadCartProducts(userId: number) {
    this.cartService.getCartProducts(userId).subscribe({
      next: (products) => {
        console.log("Produtos carregados:", products);
        this.cartProducts = products;
      }
    });
  }

  getProdutos(): void {
    let filtro = {
      tipo: this.filtro.tipo !== 'Todos' ? this.filtro.tipo : '',
      cor: this.filtro.cor !== 'Todos' ? this.filtro.cor : ''
    };
    this.produtoService.getProdutos(filtro).subscribe((produtos) => {
      this.todosProdutos = produtos; 
      this.produtosVisiveis = this.todosProdutos.slice(0, this.produtosPorPagina); 
      this.totalProdutos = produtos.length; 
      this.paginaAtual = 1; 
    });
  }

  carregarMais(): void {
    this.paginaAtual++;
    let start = (this.paginaAtual - 1) * this.produtosPorPagina;
    let end = start + this.produtosPorPagina;
    this.produtosVisiveis = [
      ...this.produtosVisiveis,
      ...this.todosProdutos.slice(start, end)
    ];
  }

  aplicarFiltros(): void {
    this.getProdutos(); 
  }

  ShowInfo(produtoId: number): void {
    this.router.navigate(['/produto', produtoId]); 
  }

  isInWishlist(produtoId: number): boolean {
    const userId = this.authService.getCurrentUserId();
    return this.wishlistService.isInWishlist(userId!, produtoId);
  }

  // Adiciona ou remove um produto da wishlist
  toggleWishlist(produto: Produto) {
    let userId = this.currentUser?.id;
   
    if (this.wishlistService.isInWishlist(userId!, produto.id)) {
      this.wishlistService.removeFromWishlist(userId!, produto.id).subscribe(() => {
        this.wishlistService.isInWishlist(userId!, produto.id);
        alert("Produto removido da wishlist!");
      });
    } else {
      this.wishlistService.addToWishlist(userId!, produto.id).subscribe(() => {
        alert("Produto adicionado à wishlist!");
      });
    }
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

  loggedUser() {
    return this.authService.getCurrentUserId();
  }
  
}

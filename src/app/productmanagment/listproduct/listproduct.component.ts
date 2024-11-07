import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductserviceService } from '../productservice.service';
import { Produto, Wishlist } from '../../model/db.type';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {
  produtos: Produto[] = []; 
  produtosVisiveis: Produto[] = []; 
  todosProdutos: Produto[] = [];
  totalProdutos: number = 0; 
  produtosPorPagina: number = 6; 
  paginaAtual: number = 1;
  wishlistprodutos: Wishlist[] = []

  filtro = {
    tipo: 'Todos',
    cor: 'Todos'
  };

  constructor(private produtoService: ProductserviceService, private router: Router, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.getProdutos(); 
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

  
}

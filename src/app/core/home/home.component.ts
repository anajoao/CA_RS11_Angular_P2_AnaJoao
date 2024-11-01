import { Component } from '@angular/core';
import { CarouselComponent } from "../../shared/carousel/carousel.component";
import { ProductserviceService } from '../../productmanagment/productservice.service';
import { CommonModule } from '@angular/common';
import { Produto } from '../../model/db.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  homeSlides = [
    { image: 'imagens/slider1.jpg', text: 'Saldos' },
    { image: 'imagens/slider2.jpg', text: 'Saldos' },
    { image: 'imagens/slider3.jpg', text: 'Saldos' }
  ];

  produtosDestaque: Produto[] = [];

  constructor(private productService: ProductserviceService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProdutosEmDestaque().subscribe(
      (produtos) => {
        this.produtosDestaque = produtos;
        console.log('Produtos em destaque:', this.produtosDestaque);
      },
      (error) => {
        console.error('Erro ao carregar produtos em destaque:', error);
      }
    );
  }

  ShowInfo(produtoId: number): void {
    this.router.navigate(['/produto', produtoId]); 
  }
}

import { Component } from '@angular/core';
import { Produto } from '../../model/db.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductserviceService } from '../productservice.service';
import { CommonModule, Location } from '@angular/common';

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

  constructor(private activeroute: ActivatedRoute, private productService: ProductserviceService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    const paramId = this.activeroute.snapshot.paramMap.get('id');
    if (Number(paramId)) {
      const id = Number(paramId);
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.productInfo = product;
          console.log(this.productInfo); // Verifique se os dados estão sendo logados no console
        },
        error: (error) => {
          console.error(error);
          this.nonExistingIdError = true;
        }
      });
    } else {
      this.router.navigate(['error']);
    }
  }

}

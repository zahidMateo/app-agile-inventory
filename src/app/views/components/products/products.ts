import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Product, ProductsService } from '../../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'zm-products',
  imports: [MatTabsModule, MatCardModule,HttpClientModule, CommonModule],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.scss',
  providers: [ProductsService]
})
export class ProductsComponent {
  totalProducts:number = 0;
  products: Product[] = [];

  /**
   *
   */
  constructor(private api: ProductsService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts(): void {
    this.api.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products', err)
    });
  }


 editProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: { product }
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result) {
        this.api.editProduct(result).subscribe({
          next: () => this.loadProducts(),
          error: err => console.error('Error al editar', err)
        });
      }
    });
  }


  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.api.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Product deleted');
        this.loadProducts(); // refrescar lista
      },
      error: (err) => console.error('Error deleting product', err)
    });
  }
}

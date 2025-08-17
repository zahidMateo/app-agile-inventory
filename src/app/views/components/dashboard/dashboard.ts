import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TransactionsService } from '../../../services/transactions.api.service';
import { ProductsService } from '../../../services/product.api.service';

@Component({
  selector: 'zm-dashboard',
  imports: [MatCardModule, MatTabsModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  providers: [ProductsService, TransactionsService],
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalTransactions: number = 0;
  totalStock: number = 0;
  lowStockProducts!: number;
  totalInventoryValue!: number;

  /**
   *
   */
  constructor(
    private apiTransaction: TransactionsService,
    private apiProduct: ProductsService
  ) {}

  ngOnInit(): void {
    this.apiTransaction.getAllTransactions().subscribe((transactions) => {
      this.totalTransactions = transactions.length;
    });

    this.apiProduct.getAllProducts().subscribe((products) => {
      this.totalProducts = products.length;
      this.totalStock = products.reduce(
        (acc, product) => acc + product.stock,
        0
      );

      // Productos con stock bajo (ejemplo <= 5)
      this.lowStockProducts = products.filter((p) => p.stock <= 5).length;

      // 👇 Suma de todos los totales (stock * precio unitario)
      this.totalInventoryValue = products.reduce((acc, product) => {
        const unitPrice = product.price ?? 0; // seguridad por si viene null
        return acc + product.stock * unitPrice;
      }, 0);
    });
  }
}

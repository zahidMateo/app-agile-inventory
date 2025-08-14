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
  providers: [ProductsService, TransactionsService]
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalTransactions: number = 0;

  /**
   *
   */
  constructor(private apiTransaction: TransactionsService, private apiProduct: ProductsService) {

  }

  ngOnInit(): void {
    this.apiTransaction.getAllTransactions().subscribe(transactions => {
      this.totalTransactions = transactions.length;
    });
    this.apiProduct.getAllProducts().subscribe(products => {
      this.totalProducts = products.length;
    });
  }



}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Transactions, TransactionsService } from '../../../services/transactions.api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from './add/add';

@Component({
  selector: 'zm-transactions',
  imports: [MatTabsModule, MatCardModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  providers: [TransactionsService]
})
export class TransactionsComponent {

  totalTransactions: number = 0;
  transactions: Transactions[] = [];
  filteredTransactions: Transactions[] = [];
  pagedTransactions: Transactions[] = [];
  searchTerm: string = '';
  searchby: string = '';
  currentPage: number = 1;
  pageSize: number = 3;
  searchType: string = 'name';
  totalPages: number = 1;

  /**
   *
   */
  constructor(private api: TransactionsService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts(): void {
    this.api.getAllTransactions().subscribe({
      next: (data) => {

        this.transactions = data;
        console.log("Transactions fetched successfully:", this.transactions);
        this.filterProducts();
      },
      error: (err) => console.error('Error fetching transactions', err)
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredTransactions = term
      ? this.transactions.filter(t =>
        t.detail.toLowerCase().includes(term) ||
        (t.transactionType || '').toLowerCase().includes(term) ||
        t.quantity.toString().includes(term) ||
        t.unitPrice.toString().includes(term) ||
        t.totalPrice.toString().includes(term)
      )
      : [...this.transactions];
    this.totalTransactions = this.filteredTransactions.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalTransactions / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagedProducts();
  }

  updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTransactions = this.filteredTransactions.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedProducts();
    }
  }


  editProduct(transactions: Transactions): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { transactions }
    });

    dialogRef.afterClosed().subscribe((result: Transactions | undefined) => {
      if (result) {
        console.log("result", result);

        this.api.editTransaction(result).subscribe({
          next: () => this.loadProducts(),
          error: err => console.error('Error al editar', err)
        });
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { isAdd: true }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {
        this.loadProducts();


      }
    });
  }

  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.api.deleteTransaction(productId).subscribe({
      next: () => {
        console.log('Transactions deleted');
        this.loadProducts();


      },
      error: (err) => console.error('Error deleting product', err)
    });
  }

  search() {

    if (this.searchType.trim() === '') {
      this.loadProducts();
      return;
    }

    this.api.getTransactionByFilter(this.searchType).subscribe({
      next: (data) => {
        this.transactions = data;
        this.filterProducts();
      },
      error: (err) => console.error('Error ', err)
    });
  }

}

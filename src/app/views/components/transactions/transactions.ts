import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TransactionsService } from '../../../services/transactions.api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from './add/add';
import { Transactions } from '../../../../models/trasaction.model';
import { ProductsService } from '../../../services/product.api.service';
import { Product } from '../../../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'zm-transactions',
  imports: [
    MatTabsModule,
    MatCardModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  providers: [TransactionsService, ProductsService],
})
export class TransactionsComponent {
  //#region properties
  totalTransactions: number = 0;
  transactions: Transactions[] = [];
  filteredTransactions: Transactions[] = [];
  pagedTransactions: Transactions[] = [];

  products: Product[] = [];
  searchTerm: string = '';
  searchby: string = '';
  currentPage: number = 1;
  pageSize: number = 3;
  searchType: string = 'all';
  product: string = 'all';
  totalPages: number = 1;
  //#endregion

  /**
   *Contructor
   */
  constructor(
    private api: TransactionsService,
    private dialog: MatDialog,
    private apiProducts: ProductsService
  ) {}

  //#region initialization
  ngOnInit(): void {
    this.loadProducts();
    this.loadTransactions();
  }
  //#endregion
  //#region methods

  loadProducts(): void {
    this.apiProducts.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }
  loadTransactions() {
    this.api.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...this.transactions];
        this.totalTransactions = this.filteredTransactions.length;
        this.totalPages = Math.ceil(this.totalTransactions / this.pageSize);
        this.updatePagedProducts();
      },
      error: (err) => console.error('Error fetching transactions', err),
    });
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

  applyFilters(): void {
    const selectedProductId =
      this.product === 'all' ? null : Number(this.product);

    this.filteredTransactions = this.transactions.filter((t) => {
      const matchesProduct =
        !selectedProductId || t.productID === selectedProductId;
      const matchesType =
        this.searchType === 'all' || t.transactionType === this.searchType;
      return matchesProduct && matchesType;
    });

    this.totalTransactions = this.filteredTransactions.length;
    this.totalPages = Math.ceil(this.totalTransactions / this.pageSize);
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  getProductName(productId: number): string {
    const product = this.products.find((p) => p.productID === productId);
    return product ? product.name : 'Eliminado';
  }

  //#endregion
  //#region actions

  editTransaction(transaction: Transactions): void {

    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { transaction },
    });

    dialogRef.afterClosed().subscribe((resp) => {

       if(!resp.result){
          Swal.fire('Error', `Error: ${resp.message}`, 'error');
          return;
        }
        this.loadTransactions();
        Swal.fire('Guardado', 'La transacción ha sido guardado correctamente.', 'success');
    });
  }

  addTransaction() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { isAdd: true },
    });

    dialogRef.afterClosed().subscribe((resp) => {
        if(!resp.result){
          Swal.fire('Error', `Error: ${resp.message}`, 'error');
          return;
        }
        this.loadTransactions();
        Swal.fire('Guardado', 'La transacción ha sido guardado correctamente.', 'success');
    });
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente el rol.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default',
        denyButton: 'btn btn-danger',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteTransaction(productId).subscribe((resp:any)=>{
          if(resp){
              this.loadTransactions();
            Swal.fire('Eliminado', 'La transacción ha sido eliminada.', 'success');
          }
        });
      }
    });
  }

  //#endregion
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TransactionsService } from '../../../../services/transactions.api.service';
import { ProductsService } from '../../../../services/product.api.service';
import { Transactions } from '../../../../../models/trasaction.model';
import { Product } from '../../../../../models/product.model';

@Component({
  selector: 'zm-add',
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  standalone: true,
  providers: [TransactionsService, ProductsService],
})
export class AddComponent implements OnInit {
  transactionForm!: FormGroup;

  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private apiProducts: ProductsService,
    private dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { transaction?: Transactions; isAdd?: boolean },
    private apiTrasactions: TransactionsService
  ) {}
  //#region inits
  ngOnInit(): void {
    this.initForm();
    this.getProducts();
    // Si estamos editando, rellenamos los datos
    if (this.data?.transaction) {
      this.setData(this.data.transaction);
    }
  }
  initForm() {
    this.transactionForm = this.fb.group({
      productID: [1, Validators.required],
      transactionType: ['Compra', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      detail: ['', Validators.required],
    });
  }
  //#endregion

  //#region methods

  setData(data: Transactions): void {
    this.transactionForm.patchValue({
      productID: data.productID,
      transactionType: data.transactionType,
      quantity: data.quantity,
      detail: data.detail,
    });
  }

  getProducts(): void {
    if (!this.data?.transaction && this.products.length) {
      this.transactionForm.patchValue({
        productID: this.products[0].productID,
      });
    }

    this.apiProducts.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        if (!this.data?.transaction && this.products.length) {
          this.transactionForm.patchValue({ productID: this.products[0].productID });
        }
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }

  close() {
    this.dialogRef.close();
  }

  save(): void {
    const controls = this.transactionForm.controls;
    //Validar formulario
    if (this.transactionForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      return;
    }
    const data: Transactions = { ...this.transactionForm.value };

    if (this.data.isAdd) {
      this.apiTrasactions.addTransaction(data).subscribe((resp) => {
        this.dialogRef.close(resp);
      });
    } else {
      data.transactionID = this.data.transaction?.transactionID || 0;
      this.apiTrasactions.editTransaction(data).subscribe((resp) =>{
        this.dialogRef.close(resp);
      });
    }
  }

  //#endregion

  //#region  getters

  get productID() {
    return this.transactionForm.get('productID') as FormControl;
  }

  get transactionType() {
    return this.transactionForm.get('transactionType') as FormControl;
  }

  get quantity() {
    return this.transactionForm.get('quantity') as FormControl;
  }

  get detail() {
    return this.transactionForm.get('detail') as FormControl;
  }
  //#endregion
}

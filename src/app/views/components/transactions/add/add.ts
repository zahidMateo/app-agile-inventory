import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TransactionsService, Transactions } from '../../../../services/transactions.api.service';

@Component({
  selector: 'zm-add',
  imports: [ReactiveFormsModule, HttpClientModule, MatDialogModule, CommonModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  standalone: true,
  providers: [TransactionsService]
})
export class AddComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: TransactionsService, private dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transactions?: Transactions, isAdd?: boolean }) { }

  ngOnInit(): void {

    this.initForm();
    if (this.data != null) {
      this.setData();
    }


  }

  initForm(): void {
    this.productForm = this.fb.group({
      detail: ['', Validators.required],
      quantity: [0, Validators.required],
      unitPrice: [0, Validators.required],
      transactionType: ['', Validators.required],
      totalPrice: [0, Validators.required]
    });
  }

  save(): void {
    const productData: Transactions = { ...this.data.transactions, ...this.productForm.value };

    if (this.data.isAdd) {
      this.api.addTransaction(productData).subscribe({
        next: (transactions) => {
          this.dialogRef.close(transactions);
        },
        error: (err: any) => console.error('Error adding transaction', err)
      });
    }
    if (this.productForm.valid) {
      this.dialogRef.close(productData);
    }

  }

  setData(): void {
    if (this.data.transactions) {
      this.productForm.patchValue(this.data.transactions);
    }
  }
}

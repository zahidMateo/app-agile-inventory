import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductsService } from '../../../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zm-add',
  imports: [ReactiveFormsModule, HttpClientModule, MatDialogModule,CommonModule],
  templateUrl: './add.html',
  standalone: true,
  styleUrl: './add.scss',
  providers: [ProductsService]
})
export class AddComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ProductsService,  private dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      category: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

save(): void {
    if (this.productForm.valid) {
      const productData: Product = { ...this.data.product, ...this.productForm.value };
      this.dialogRef.close(productData);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

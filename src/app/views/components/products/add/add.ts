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
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../services/product.api.service';
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
  standalone: true,
  styleUrl: './add.scss',
  providers: [ProductsService],
})
export class AddComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ProductsService,
    private dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; isAdd?: boolean }
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data != null) {
      this.setData();
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('electronics', Validators.required),
      price: new FormControl(1, [Validators.required, Validators.min(0)]),
      stock: new FormControl(1, [Validators.required, Validators.min(0)]),
    });
  }

  save(): void {
    const controls = this.productForm.controls;
    //Validar formulario
    if (this.productForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      return;
    }
    const productData: Product = {
      ...this.productForm.value,
    };
    productData.isActive = true;

    if (this.data.isAdd) {
      this.api.addProduct(productData).subscribe((resp) => {
        this.dialogRef.close(resp);
      });
    } else {
      productData.productID = Number(this.data.product?.productID);
      this.api.editProduct(productData).subscribe((resp) => {
        this.dialogRef.close(resp);
      });
    }
  }

  setData(): void {
    if (this.data.product) {
      this.productForm.patchValue(this.data.product);
    }
  }
  close() {
    this.dialogRef.close();
  }

  //#region getters
  get name() {
    return this.productForm.get('name') as FormControl;
  }

  get description() {
    return this.productForm.get('description') as FormControl;
  }

  get category() {
    return this.productForm.get('category') as FormControl;
  }

  get price() {
    return this.productForm.get('price') as FormControl;
  }

  get stock() {
    return this.productForm.get('stock') as FormControl;
  }

  //#endregion
}

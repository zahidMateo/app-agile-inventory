import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../../services/product.api.service';
import { Product } from '../../../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'zm-products',
  imports: [
    MatTabsModule,
    MatCardModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.scss',
  providers: [ProductsService],
})
export class ProductsComponent {
  //#region Properties
  totalProducts: number = 0;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 3;
  searchType: string = 'name';
  totalPages: number = 1;
  appliedFilters: { label: string; value: any; type?: string }[] = [];
  formProducts!: FormGroup;
  //#endregion

  /**
   *
   */
  constructor(
    private api: ProductsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  //#region init
  ngOnInit(): void {
    this.loadProducts();
    //init
    this.initForm();
  }

  initForm() {
    this.formProducts = this.fb.group({
      generalSearch: new FormControl(''),
      category: new FormControl('all'),
      supplier: new FormControl('all'),
      minPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      maxPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      minStock: new FormControl(0, [Validators.required, Validators.min(0)]),
      maxStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }
  //#endregion

  //#region methods
  searchByFilter() {
    const filters = this.formProducts.value;

    this.filteredProducts = this.products.filter((p) => {
      const matchesGeneral =
        !filters.generalSearch ||
        p.name.toLowerCase().includes(filters.generalSearch.toLowerCase()) ||
        (p.description || '')
          .toLowerCase()
          .includes(filters.generalSearch.toLowerCase());

      const matchesCategory =
        filters.category === 'all' || p.category === filters.category;

      const matchesMinPrice = !filters.minPrice || p.price >= filters.minPrice;

      const matchesMaxPrice = !filters.maxPrice || p.price <= filters.maxPrice;

      const matchesMinStock = !filters.minStock || p.stock >= filters.minStock;

      const matchesMaxStock = !filters.maxStock || p.stock <= filters.maxStock;

      return (
        matchesGeneral &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinStock &&
        matchesMaxStock
      );
    });

    this.totalProducts = this.filteredProducts.length;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.totalProducts / this.pageSize)
    );
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagedProducts();
  }

  filterStockLow() {
    this.formProducts.patchValue({ maxStock: 5 });
    this.addOrUpdateFilter('Stock Bajo', 'stockLow');
    this.searchByFilter();
  }

  filterPriceUnder100() {
    this.formProducts.patchValue({ maxPrice: 100 });
    this.addOrUpdateFilter('Precio < $100', 'priceUnder100');
    this.searchByFilter();
  }

  filterPriceAbove500() {
    this.formProducts.patchValue({ minPrice: 500 });
    this.addOrUpdateFilter('Precio > $500', 'priceAbove500');
    this.searchByFilter();
  }
  addOrUpdateFilter(label: string, value: any) {
    const index = this.appliedFilters.findIndex((f) => f.value === value);
    if (index === -1) {
      this.appliedFilters.push({ label, value });
    }
  }
  removeFilter(index: number) {
    const filter = this.appliedFilters[index];

    // Resetea el filtro correspondiente del formulario
    switch (filter.value) {
      case 'stockLow':
        this.formProducts.patchValue({ maxStock: 0 });
        break;
      case 'priceUnder100':
        this.formProducts.patchValue({ maxPrice: 0 });
        break;
      case 'priceAbove500':
        this.formProducts.patchValue({ minPrice: 0 });
        break;
    }

    // Elimina el filtro de la lista
    this.appliedFilters.splice(index, 1);

    // Reaplica los filtros
    this.searchByFilter();
  }

  //#endregion

  //trae todos los productos desde la base de datos
  loadProducts(): void {
    this.api.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filterProducts();
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = term
      ? this.products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        )
      : [...this.products];
    this.totalProducts = this.filteredProducts.length;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.totalProducts / this.pageSize)
    );
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagedProducts();
  }

  updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, end);
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

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result) {
        this.loadProducts();
        Swal.fire(
          'Guardado',
          'La transacción ha sido guardado correctamente.',
          'success'
        );
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '500px',
      data: { isAdd: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {
        Swal.fire(
          'Guardado',
          'La transacción ha sido guardado correctamente.',
          'success'
        );
        this.loadProducts();
      }
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
        this.api.deleteProduct(productId).subscribe((resp) => {
          if (resp) {
            this.loadProducts();
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
          }
        });
      }
    });
  }

  //#region getters

  get generalSearch() {
    return this.formProducts.get('generalSearch');
  }

  get category() {
    return this.formProducts.get('category');
  }

  get supplier() {
    return this.formProducts.get('supplier');
  }

  get minPrice() {
    return this.formProducts.get('minPrice');
  }

  get maxPrice() {
    return this.formProducts.get('maxPrice');
  }

  get minStock() {
    return this.formProducts.get('minStock');
  }

  get maxStock() {
    return this.formProducts.get('maxStock');
  }

  //#endregion
}

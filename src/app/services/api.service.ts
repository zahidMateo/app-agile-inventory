import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productID: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://localhost:7253/api/Products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get-allProducts`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-product`, product);
  }

  editProduct( product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-products/`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-product/${id}`);
  }
}

export interface Product {
  productID: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

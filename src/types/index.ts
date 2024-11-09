export type Category = 'Coffees' | 'Teas' | 'Cakes' | 'Hot Chocolate';

export interface Option {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  options?: {
    hasOptions: boolean;
    selectedOptions?: string[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  options: {
    selectedOption?: string;
  };
}
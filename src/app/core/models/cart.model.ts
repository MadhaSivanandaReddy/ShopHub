export interface CartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
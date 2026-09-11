export interface ProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  active: boolean;
}

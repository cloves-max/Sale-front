export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  items: SaleItemRequest[];
}

export interface SaleItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleResponse {
  id: number;
  sellerId: number;
  sellerName: string;
  status: SaleStatus;
  totalAmount: number;
  items: SaleItemResponse[];
  createdAt: string;
}

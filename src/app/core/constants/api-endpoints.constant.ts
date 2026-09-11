export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  products: {
    root: '/products',
    byId: (productId: number): string => `/products/${productId}`,
  },
  sales: {
    root: '/sales',
    me: '/sales/me',
    byId: (saleId: number): string => `/sales/${saleId}`,
  },
} as const;

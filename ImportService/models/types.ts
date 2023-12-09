export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
}

export interface ImportResponse {
  code: number;
  signedUrl: string;
}

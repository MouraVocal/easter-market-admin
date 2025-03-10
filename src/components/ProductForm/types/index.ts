export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_highlighted: boolean;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
}

export interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}
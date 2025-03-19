interface CustomUser {
  id: string;
  email: string;
  username?: string;
  whatsapp_number?: number;
}

import { Product } from ".";

export enum OrderStatus {
  CREATED = 1,
  IN_PREPARATION = 2,
  WAITING_FOR_RETREAT = 3,
  FINISHED = 4,
}

export const OrderStatusTranslations: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Criado",
  [OrderStatus.IN_PREPARATION]: "Em preparação",
  [OrderStatus.WAITING_FOR_RETREAT]: "Aguardando retirada",
  [OrderStatus.FINISHED]: "Finalizado",
};

export interface OrderProduct {
  order: string;
  product: Product;
  product_quantity: number;
}

export interface Order {
  id: string;
  created_at: Date;
  full_price: number;
  updated_at: Date;
  updated_by: string;
  status: OrderStatus;
  user: CustomUser;
  products: OrderProduct[];
}
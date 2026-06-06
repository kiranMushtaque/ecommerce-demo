export interface Product {
  id: number;
  name: string;
  nameUr: string;
  nameRoman: string;
  price: number;
  category: string;
  categoryUr: string;
  categoryRoman: string;
  description: string;
  descriptionUr: string;
  descriptionRoman: string;
  stock: number;
  rating: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  descriptionUr: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  address: string;
  isLoggedIn: boolean;
  provider: "Google" | "GitHub" | "Facebook" | "None" | "Email";
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  date: string;
  couponCode?: string;
}

export type AppLanguage = "EN" | "UR" | "ROMAN";

export type AppTheme = "light" | "dark";

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  timestamp: string;
}

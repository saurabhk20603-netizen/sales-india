export type UserRole = 'customer' | 'seller' | 'rider' | 'admin';

export type Language = 'en' | 'hi';

export type CategoryId = 
  | 'electronics' 
  | 'fashion' 
  | 'grocery' 
  | 'beauty' 
  | 'appliances' 
  | 'furniture' 
  | 'sports' 
  | 'accessories';

export interface Category {
  id: CategoryId;
  nameEn: string;
  nameHi: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Midnight Blue - 128GB" or "Size: XL" or "Pack of 2"
  price: number;
  mrp: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleHi?: string;
  brand: string;
  category: CategoryId;
  price: number; // in INR ₹
  mrp: number; // original price in INR ₹
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  descriptionHi?: string;
  specifications: Record<string, string>;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  isLocalVocal: boolean;
  isAssured: boolean;
  fastDeliveryHours?: number; // e.g., 2 hours or same day
  isLocalShopProduct?: boolean;
  shopDistanceKm?: number; // Distance from customer, e.g. 1.2 km
  shopAddress?: string; // Exact local shop location
  variants?: ProductVariant[];
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  flat: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'placed' 
  | 'accepted' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'rider_assigned' 
  | 'picked_up' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
  variantName?: string;
}

export interface DeliveryDetails {
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderPhoto?: string;
  riderVehicle?: string;
  riderRating?: number;
  deliveryOtp: string; // 4-digit secret OTP needed for completion
  estimatedMinutes: number;
  currentLat?: number;
  currentLng?: number;
  progressPercent: number;
  pickupPhotoUrl?: string; // Photo clicked by rider at the local store counter
  pickupPhotoTimestamp?: string;
  pickupStoreName?: string;
  pickupStoreLocation?: string;
  pickupVerificationNotes?: string;
  customerVerifiedPhoto?: boolean;
  deliveryConfirmationPhotoUrl?: string; // Photo snapped by rider at customer doorstep after delivery
  deliveryConfirmationTimestamp?: string;
  deliveryProofNotes?: string;
}

export interface Order {
  id: string; // e.g. "SI-83921"
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  deliveryAddress: Address;
  status: OrderStatus;
  deliveryDetails: DeliveryDetails;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  couponCode?: string;
  cancellationReason?: string;
  returnReason?: string;
  refundStatus?: 'none' | 'processing' | 'refunded';
}

export interface Seller {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  sellerType: 'Kirana / Local Shop' | 'Manufacturer' | 'Wholesaler' | 'Brand';
  city: string;
  state: string;
  pincode: string;
  address: string;
  gstin: string;
  pan: string;
  bankAccount: string;
  ifsc: string;
  isVerified: boolean;
  joinedDate: string;
  rating: number;
  totalProducts: number;
  totalSales: number; // in INR ₹
  commissionRate: number; // percentage, e.g. 8
  logo: string;
  isNeighborhoodShop?: boolean;
  marketArea?: string; // e.g. "Main Market, Sector 62"
  shopDistanceKm?: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'Motorcycle' | 'Scooter' | 'Electric Vehicle' | 'Bicycle';
  vehiclePlate: string;
  drivingLicense: string;
  city: string;
  preferredZone: string;
  isOnline: boolean;
  isVerified: boolean;
  rating: number;
  totalTrips: number;
  todayEarnings: number;
  todayTrips: number;
  walletBalance: number;
  upiId: string;
  avatar: string;
  workingHoursType: 'Part-Time' | 'Full-Time' | 'Weekend Special';
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  descriptionHi?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'offer' | 'delivery' | 'rider' | 'seller';
  read: boolean;
}

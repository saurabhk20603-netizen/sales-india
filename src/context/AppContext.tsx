import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Product, 
  CartItem, 
  Address, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  Seller, 
  Rider, 
  Coupon, 
  NotificationItem,
  ProductVariant
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SELLERS, 
  INITIAL_RIDERS, 
  INITIAL_ADDRESSES, 
  AVAILABLE_COUPONS 
} from '../data/mockData';
import { translations } from '../i18n/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  updateProductStock: (id: string, newStock: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Addresses
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;

  // Orders
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  placeOrder: (paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  verifyOrderOtpAndDeliver: (orderId: string, otp: string) => { success: boolean; message: string };
  uploadRiderPickupPhoto: (orderId: string, photoUrl: string, notes?: string) => void;
  customerVerifyPickupPhoto: (orderId: string) => void;
  uploadDeliveryConfirmationPhoto: (orderId: string, photoUrl: string, notes?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  requestReturn: (orderId: string, reason: string) => void;

  // Sellers
  sellers: Seller[];
  activeSeller: Seller;
  setActiveSeller: (seller: Seller) => void;
  registerSeller: (sellerData: Partial<Seller>) => void;
  approveSeller: (sellerId: string) => void;

  // Riders
  riders: Rider[];
  activeRider: Rider;
  setActiveRider: (rider: Rider) => void;
  toggleRiderOnline: (riderId: string) => void;
  registerRider: (riderData: Partial<Rider>) => void;
  approveRider: (riderId: string) => void;
  withdrawRiderEarnings: (riderId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markNotificationAsRead: (id: string) => void;
  unreadNotificationCount: number;

  // Modals & UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (category: string | null) => void;

  // AI & Photo Search
  isAiSearchOpen: boolean;
  setIsAiSearchOpen: (open: boolean) => void;
  aiSearchInitialTab: 'photo' | 'ai';
  setAiSearchInitialTab: (tab: 'photo' | 'ai') => void;
  openAiPhotoSearch: (tab?: 'photo' | 'ai') => void;

  // PWA Fast Install Modal
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;

  // Fast Service Provider (10-15 Min Express)
  fastServiceFilterOnly: boolean;
  setFastServiceFilterOnly: (fast: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Sample Orders to show tracking immediately
const INITIAL_ORDERS: Order[] = [
  {
    id: 'SI-92841',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    items: [
      {
        productId: 'prod-boat-rockerz',
        title: 'boAt Rockerz 450 Bluetooth Headphones',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        sellerId: 'seller-delhi-elec',
        sellerName: 'Delhi Electronics Wholesale Hub'
      }
    ],
    subtotal: 1299,
    deliveryFee: 0,
    platformFee: 5,
    discount: 100,
    gstAmount: 215,
    total: 1419,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    status: 'out_for_delivery',
    deliveryDetails: {
      riderId: 'rider-ramesh',
      riderName: 'Ramesh Kumar',
      riderPhone: '+91 97118 64210',
      riderVehicle: 'Hero Splendor (DL 03 CA 8492)',
      riderRating: 4.9,
      deliveryOtp: '6294',
      estimatedMinutes: 8,
      progressPercent: 78,
      pickupPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      pickupPhotoTimestamp: '15 mins ago',
      pickupStoreName: 'Delhi Electronics Wholesale Hub',
      pickupStoreLocation: 'Shop 42, Chandni Chowk Electronic Market',
      pickupVerificationNotes: 'Rider Ramesh verified product barcode, packaging seal & warranty card directly at the shop counter.',
      customerVerifiedPhoto: true
    },
    timeline: [
      { status: 'placed', timestamp: '25 mins ago', description: 'Order verified & paid via UPI (PhonePe)' },
      { status: 'accepted', timestamp: '20 mins ago', description: 'Seller Delhi Electronics accepted order' },
      { status: 'ready_for_pickup', timestamp: '14 mins ago', description: 'Packed & handed over to delivery hub' },
      { status: 'picked_up', timestamp: '10 mins ago', description: 'Rider Ramesh Kumar collected parcel' },
      { status: 'out_for_delivery', timestamp: '5 mins ago', description: 'Rider is 1.2 km away from your location' }
    ]
  },
  {
    id: 'SI-73910',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      {
        productId: 'prod-tata-tea-gold',
        title: 'Tata Tea Gold 1kg Royal Blend',
        price: 520,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
        sellerId: 'seller-mumbai-kirana',
        sellerName: 'Bharat Pure Grocery & Spices'
      }
    ],
    subtotal: 1040,
    deliveryFee: 0,
    platformFee: 5,
    discount: 0,
    gstAmount: 187,
    total: 1232,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    status: 'delivered',
    deliveryDetails: {
      riderId: 'rider-amit',
      riderName: 'Amit Vikram Singh',
      riderPhone: '+91 98991 32456',
      riderVehicle: 'Ola Electric S1 (DL 01 EV 4109)',
      riderRating: 4.8,
      deliveryOtp: '4821',
      estimatedMinutes: 0,
      progressPercent: 100,
      pickupPhotoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      pickupPhotoTimestamp: '2 days ago',
      pickupStoreName: 'Bharat Pure Grocery & Spices',
      pickupVerificationNotes: 'Rider verified sealed Tata tea bags and grocery pack at store shelf.',
      customerVerifiedPhoto: true,
      deliveryConfirmationPhotoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      deliveryConfirmationTimestamp: 'Yesterday, 4:15 PM',
      deliveryProofNotes: 'Handed over directly to customer at doorstep with OTP verification.'
    },
    timeline: [
      { status: 'placed', timestamp: '2 days ago', description: 'Order placed via Cash on Delivery' },
      { status: 'accepted', timestamp: '2 days ago', description: 'Packed by Bharat Pure Grocery' },
      { status: 'delivered', timestamp: 'Yesterday', description: 'Handed over to customer with OTP verification' }
    ]
  },
  {
    id: 'SI-85219',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    items: [
      {
        productId: 'prod-fire-boltt-smartwatch',
        title: 'Fire-Boltt Ninja Call Pro Plus 1.83" Bluetooth Calling Smartwatch',
        price: 1499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80',
        sellerId: 'seller-delhi-elec',
        sellerName: 'Delhi Electronics Wholesale Hub'
      }
    ],
    subtotal: 1499,
    deliveryFee: 0,
    platformFee: 5,
    discount: 150,
    gstAmount: 242,
    total: 1596,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    status: 'delivered',
    deliveryDetails: {
      riderId: 'rider-ramesh',
      riderName: 'Ramesh Kumar',
      riderPhone: '+91 97118 64210',
      riderVehicle: 'Hero Splendor (DL 03 CA 8492)',
      riderRating: 4.9,
      deliveryOtp: '7419',
      estimatedMinutes: 0,
      progressPercent: 100,
      pickupPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      pickupPhotoTimestamp: '3 hours ago',
      pickupStoreName: 'Delhi Electronics Wholesale Hub',
      pickupStoreLocation: 'Shop 42, Chandni Chowk Electronic Market',
      pickupVerificationNotes: 'Rider Ramesh inspected sealed Smartwatch box, serial number & warranty card at shop counter.',
      customerVerifiedPhoto: true,
      deliveryConfirmationPhotoUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      deliveryConfirmationTimestamp: 'Today, 1:20 PM',
      deliveryProofNotes: 'Safely handed over smartwatch package to customer at doorstep after 4-digit secret OTP verification.'
    },
    timeline: [
      { status: 'placed', timestamp: '4 hours ago', description: 'Order placed & paid via UPI' },
      { status: 'accepted', timestamp: '3.5 hours ago', description: 'Packed & ready at Delhi Electronics counter' },
      { status: 'picked_up', timestamp: '2.5 hours ago', description: 'Rider snapped verification photo and picked up' },
      { status: 'delivered', timestamp: 'Today, 1:20 PM', description: 'Delivered at doorstep with live photo confirmation' }
    ]
  },
  {
    id: 'SI-81903',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    items: [
      {
        productId: 'prod-fortune-oil',
        title: 'Fortune Sunlite Refined Sunflower Oil 5L Jar',
        price: 740,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
        sellerId: 'seller-noida-kirana',
        sellerName: 'Sharmaji Daily Kirana & Dairy'
      }
    ],
    subtotal: 740,
    deliveryFee: 0,
    platformFee: 5,
    discount: 50,
    gstAmount: 37,
    total: 732,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    status: 'delivered',
    deliveryDetails: {
      riderId: 'rider-ramesh',
      riderName: 'Ramesh Kumar',
      riderPhone: '+91 97118 64210',
      riderVehicle: 'Hero Splendor (DL 03 CA 8492)',
      riderRating: 4.9,
      deliveryOtp: '3902',
      estimatedMinutes: 0,
      progressPercent: 100,
      pickupPhotoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
      pickupPhotoTimestamp: '7 hours ago',
      pickupStoreName: 'Sharmaji Daily Kirana & Dairy',
      pickupStoreLocation: 'Shop 4, Main Market, Sector 62',
      pickupVerificationNotes: 'Rider verified factory seal on 5L oil can at kirana store counter.',
      customerVerifiedPhoto: true,
      deliveryConfirmationPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      deliveryConfirmationTimestamp: 'Today, 10:45 AM',
      deliveryProofNotes: 'Package placed safely at doorstep entrance for contactless handover upon OTP check.'
    },
    timeline: [
      { status: 'placed', timestamp: '8 hours ago', description: 'Order placed via Cash on Delivery' },
      { status: 'picked_up', timestamp: '7 hours ago', description: 'Picked up from Sharmaji Kirana with parcel snap' },
      { status: 'delivered', timestamp: 'Today, 10:45 AM', description: 'Delivered and ₹732 cash collected' }
    ]
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('si_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('si_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem('si_riders');
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [activeSeller, setActiveSeller] = useState<Seller>(sellers[0] || INITIAL_SELLERS[0]);
  const [activeRider, setActiveRider] = useState<Rider>(riders[0] || INITIAL_RIDERS[0]);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('si_cart');
    return saved ? JSON.parse(saved) : [
      { product: INITIAL_PRODUCTS[0], quantity: 1 } // Pre-seed 1 item for quick testing
    ];
  });
  const [wishlist, setWishlist] = useState<string[]>(['prod-fire-boltt-smartwatch']);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(AVAILABLE_COUPONS[0]); // default coupon applied

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('si_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0] || INITIAL_ADDRESSES[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('si_orders');
    if (!saved) return INITIAL_ORDERS;
    try {
      const parsed: Order[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(o => o.id));
      const missingInitial = INITIAL_ORDERS.filter(o => !existingIds.has(o.id));
      return [...parsed, ...missingInitial];
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // AI & Photo Search state
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [aiSearchInitialTab, setAiSearchInitialTab] = useState<'photo' | 'ai'>('photo');

  const openAiPhotoSearch = (tab: 'photo' | 'ai' = 'photo') => {
    setAiSearchInitialTab(tab);
    setIsAiSearchOpen(true);
  };

  // PWA Fast Install Modal state
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Fast Service Provider (10-15 Min Express) state
  const [fastServiceFilterOnly, setFastServiceFilterOnly] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '⚡ 60% Off Flash Sale Live!',
      message: 'Exclusive electronics and festive sarees sale started on Sales India Shopping Bazar.',
      timestamp: '10m ago',
      type: 'offer',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Order SI-92841 is Out for Delivery',
      message: 'Rider Ramesh Kumar is arriving with your boAt Headphones in 8 mins.',
      timestamp: '5m ago',
      type: 'delivery',
      read: false
    }
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('si_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('si_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('si_riders', JSON.stringify(riders));
  }, [riders]);

  useEffect(() => {
    localStorage.setItem('si_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('si_orders', JSON.stringify(orders));
  }, [orders]);

  const t = translations[language];

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && (!variant || item.selectedVariant?.id === variant.id));
      if (existing) {
        return prev.map(item => 
          (item.product.id === product.id && (!variant || item.selectedVariant?.id === variant.id))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });

    addNotification(
      'Added to Cart',
      `${product.title.slice(0, 30)}... added to your shopping bag.`,
      'order'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const applyCouponCode = (code: string) => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try BHAARAT100 or FESTIVE20' };
    }
    if (cartSubtotal < coupon.minOrderValue) {
      return { 
        success: false, 
        message: `Min order value for ${coupon.code} is ₹${coupon.minOrderValue}. Add more items!` 
      };
    }
    setAppliedCoupon(coupon);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const created: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [created, ...prev]);
    setSelectedAddress(created);
  };

  // Place Order workflow
  const placeOrder = async (paymentMethod: PaymentMethod): Promise<Order> => {
    // Generate 4-digit OTP for secure rider handover
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `SI-${Math.floor(10000 + Math.random() * 90000)}`;

    const deliveryFee = cartSubtotal >= 499 ? 0 : 40;
    const platformFee = 5;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'fixed') {
        discount = appliedCoupon.discountValue;
      } else {
        discount = Math.min((cartSubtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 9999);
      }
    }

    const discountedSubtotal = Math.max(0, cartSubtotal - discount);
    const gstAmount = Math.round(discountedSubtotal * 0.18);
    const total = discountedSubtotal + deliveryFee + platformFee + gstAmount;

    // Pick an available active rider
    const availableRider = riders.find(r => r.isOnline) || riders[0];

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        variantName: item.selectedVariant?.name
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      platformFee,
      discount,
      gstAmount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryAddress: selectedAddress,
      status: 'placed',
      deliveryDetails: {
        riderId: availableRider?.id,
        riderName: availableRider?.name,
        riderPhone: availableRider?.phone,
        riderVehicle: `${availableRider?.vehicleType} (${availableRider?.vehiclePlate})`,
        riderRating: availableRider?.rating,
        deliveryOtp: randomOtp,
        estimatedMinutes: 25,
        progressPercent: 15
      },
      timeline: [
        {
          status: 'placed',
          timestamp: 'Just now',
          description: `Order placed successfully via ${paymentMethod.toUpperCase()}`
        }
      ],
      couponCode: appliedCoupon?.code
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger celebration
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });

    addNotification(
      'Order Confirmed! 🎉',
      `Your order #${orderId} for ₹${total} has been confirmed. OTP for delivery is ${randomOtp}.`,
      'order'
    );

    // Auto-progress simulation: Seller accepts after 6 seconds
    setTimeout(() => {
      updateOrderStatus(orderId, 'accepted');
    }, 6000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      let desc = '';
      let progress = order.deliveryDetails.progressPercent;
      let estMinutes = order.deliveryDetails.estimatedMinutes;

      switch(newStatus) {
        case 'accepted':
          desc = 'Seller confirmed and started packing item';
          progress = 30;
          estMinutes = 20;
          break;
        case 'preparing':
          desc = 'Order packed with security seal';
          progress = 45;
          estMinutes = 18;
          break;
        case 'ready_for_pickup':
          desc = 'Ready at seller counter for delivery rider';
          progress = 60;
          estMinutes = 15;
          break;
        case 'rider_assigned':
          desc = `Delivery partner ${order.deliveryDetails.riderName || 'Rider'} assigned`;
          progress = 70;
          estMinutes = 12;
          break;
        case 'picked_up':
          desc = 'Rider picked up order from store';
          progress = 80;
          estMinutes = 10;
          break;
        case 'out_for_delivery':
          desc = 'Rider is on the way to your delivery doorstep';
          progress = 90;
          estMinutes = 5;
          break;
        case 'delivered':
          desc = 'Order safely delivered to recipient';
          progress = 100;
          estMinutes = 0;
          break;
        case 'cancelled':
          desc = 'Order cancelled by user';
          progress = 0;
          estMinutes = 0;
          break;
        case 'returned':
          desc = 'Return request accepted. Rider pickup scheduled';
          progress = 0;
          estMinutes = 0;
          break;
      }

      const updated: Order = {
        ...order,
        status: newStatus,
        paymentStatus: newStatus === 'delivered' ? 'paid' : order.paymentStatus,
        deliveryDetails: {
          ...order.deliveryDetails,
          progressPercent: progress,
          estimatedMinutes: estMinutes
        },
        timeline: [
          ...order.timeline,
          {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: desc
          }
        ]
      };

      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder(updated);
      }

      return updated;
    }));
  };

  const verifyOrderOtpAndDeliver = (orderId: string, otp: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found' };
    }

    if (targetOrder.deliveryDetails.deliveryOtp !== otp.trim()) {
      return { success: false, message: 'Incorrect OTP! Ask customer for their 4-digit secret delivery code.' };
    }

    // OTP matched! Complete delivery
    updateOrderStatus(orderId, 'delivered');

    // Credit earnings to active rider
    const deliveryEarning = 65; // ₹65 per delivery payout
    setRiders(prev => prev.map(r => {
      if (r.id === activeRider.id || r.id === targetOrder.deliveryDetails.riderId) {
        return {
          ...r,
          todayEarnings: r.todayEarnings + deliveryEarning,
          todayTrips: r.todayTrips + 1,
          totalTrips: r.totalTrips + 1,
          walletBalance: r.walletBalance + deliveryEarning
        };
      }
      return r;
    }));

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    addNotification(
      'Delivery Completed! 🚀',
      `Order #${orderId} delivered! ₹${deliveryEarning} added to rider wallet.`,
      'rider'
    );

    return { success: true, message: `OTP verified! Delivery marked complete. ₹${deliveryEarning} credited.` };
  };

  const uploadRiderPickupPhoto = (orderId: string, photoUrl: string, notes?: string) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updated: Order = {
        ...order,
        deliveryDetails: {
          ...order.deliveryDetails,
          pickupPhotoUrl: photoUrl,
          pickupPhotoTimestamp: timestampStr,
          pickupStoreName: order.items[0]?.sellerName || 'Local Shop',
          pickupVerificationNotes: notes || 'Rider clicked photo at shop counter to verify item packaging and condition before departure.'
        },
        timeline: [
          ...order.timeline,
          {
            status: order.status,
            timestamp: timestampStr,
            description: `📸 Rider captured and shared local shop parcel photo to customer ID #${orderId}`
          }
        ]
      };

      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder(updated);
      }

      return updated;
    }));

    addNotification(
      '📸 Live Parcel Photo Shared with Customer!',
      `Rider uploaded verification photo from store counter for Order #${orderId}. Visible on customer tracking screen.`,
      'delivery'
    );
  };

  const customerVerifyPickupPhoto = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const updated: Order = {
        ...order,
        deliveryDetails: {
          ...order.deliveryDetails,
          customerVerifiedPhoto: true
        }
      };
      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder(updated);
      }
      return updated;
    }));

    addNotification(
      'Parcel Condition Verified ✓',
      `You verified the shop pickup photo for Order #${orderId}. Rider is en route!`,
      'order'
    );
  };

  const uploadDeliveryConfirmationPhoto = (orderId: string, photoUrl: string, notes?: string) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updated: Order = {
        ...order,
        deliveryDetails: {
          ...order.deliveryDetails,
          deliveryConfirmationPhotoUrl: photoUrl,
          deliveryConfirmationTimestamp: timestampStr,
          deliveryProofNotes: notes || 'Rider snapped doorstep delivery confirmation photo with device camera upon successful handover.'
        },
        timeline: [
          ...order.timeline,
          {
            status: 'delivered',
            timestamp: timestampStr,
            description: `📸 Rider snapped and attached doorstep delivery confirmation photo (Proof of Delivery) to order #${orderId}`
          }
        ]
      };

      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder(updated);
      }

      return updated;
    }));

    addNotification(
      '📸 Proof of Delivery Attached!',
      `Doorstep delivery confirmation photo saved for Order #${orderId}. Visible in customer tracking screen.`,
      'delivery'
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'cancelled',
      cancellationReason: reason,
      refundStatus: o.paymentMethod !== 'cod' ? 'processing' : 'none'
    } : o));

    addNotification(
      'Order Cancelled',
      `Order #${orderId} has been cancelled. Refund initiated to original payment method.`,
      'order'
    );
  };

  const requestReturn = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'returned',
      returnReason: reason,
      refundStatus: 'processing'
    } : o));

    addNotification(
      'Return Request Registered',
      `Return for #${orderId} requested. Free pickup by Sales India rider scheduled within 24 hours.`,
      'order'
    );
  };

  // Product addition by seller
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Verified Buyer',
          rating: 5,
          date: 'Just now',
          comment: 'Genuine original item from seller.',
          verifiedPurchase: true
        }
      ]
    };

    setProducts(prev => [newProduct, ...prev]);

    // Update seller product count
    setSellers(prev => prev.map(s => s.id === productData.sellerId ? {
      ...s,
      totalProducts: s.totalProducts + 1
    } : s));

    addNotification(
      'Product Listed Successfully',
      `"${newProduct.title.slice(0, 30)}..." is now live on Sales India Shopping Bazar.`,
      'seller'
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  // Seller management
  const registerSeller = (sellerData: Partial<Seller>) => {
    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      storeName: sellerData.storeName || 'New Indian Store',
      ownerName: sellerData.ownerName || 'Store Owner',
      phone: sellerData.phone || '+91 98000 00000',
      email: sellerData.email || 'seller@salesindia.in',
      sellerType: sellerData.sellerType || 'Kirana / Local Shop',
      city: sellerData.city || 'New Delhi',
      state: sellerData.state || 'Delhi',
      pincode: sellerData.pincode || '110001',
      address: sellerData.address || 'Market Road',
      gstin: sellerData.gstin || '07TESTG1234F1Z1',
      pan: sellerData.pan || 'TESTP1234F',
      bankAccount: sellerData.bankAccount || '123456789012',
      ifsc: sellerData.ifsc || 'SBIN0001111',
      isVerified: true, // auto-approve for seamless testing
      joinedDate: 'Today',
      rating: 5.0,
      totalProducts: 0,
      totalSales: 0,
      commissionRate: 8,
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
      ...sellerData
    };

    setSellers(prev => [newSeller, ...prev]);
    setActiveSeller(newSeller);
    setRole('seller');

    addNotification(
      'Seller Store Created!',
      `Welcome to Sales India Seller Hub, ${newSeller.storeName}! Start adding products now.`,
      'seller'
    );
  };

  const approveSeller = (sellerId: string) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, isVerified: true } : s));
  };

  // Rider management
  const toggleRiderOnline = (riderId: string) => {
    setRiders(prev => prev.map(r => {
      if (r.id === riderId) {
        const nextState = !r.isOnline;
        return { ...r, isOnline: nextState };
      }
      return r;
    }));

    if (activeRider.id === riderId) {
      setActiveRider(prev => ({ ...prev, isOnline: !prev.isOnline }));
    }
  };

  const registerRider = (riderData: Partial<Rider>) => {
    const newRider: Rider = {
      id: `rider-${Date.now()}`,
      name: riderData.name || 'New Delivery Partner',
      phone: riderData.phone || '+91 99000 11223',
      email: riderData.email || 'rider@salesindia.in',
      vehicleType: riderData.vehicleType || 'Motorcycle',
      vehiclePlate: riderData.vehiclePlate || 'DL 01 AA 1234',
      drivingLicense: riderData.drivingLicense || 'DL-142024001122',
      city: riderData.city || 'New Delhi',
      preferredZone: riderData.preferredZone || 'Central Delhi',
      isOnline: true,
      isVerified: true,
      rating: 5.0,
      totalTrips: 0,
      todayEarnings: 0,
      todayTrips: 0,
      walletBalance: 200, // Joining bonus ₹200
      upiId: riderData.upiId || 'rider@upi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      workingHoursType: riderData.workingHoursType || 'Part-Time',
      ...riderData
    };

    setRiders(prev => [newRider, ...prev]);
    setActiveRider(newRider);
    setRole('rider');

    confetti({ particleCount: 80, spread: 60 });
    addNotification(
      'Rider Onboarding Complete! 🛵',
      `Welcome to Sales India Delivery Fleet! ₹200 welcome bonus added to your wallet. You are now ONLINE!`,
      'rider'
    );
  };

  const approveRider = (riderId: string) => {
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, isVerified: true } : r));
  };

  const withdrawRiderEarnings = (riderId: string) => {
    setRiders(prev => prev.map(r => {
      if (r.id === riderId && r.walletBalance > 0) {
        const bal = r.walletBalance;
        confetti({ particleCount: 60, spread: 70 });
        addNotification(
          'Payout Transferred to UPI 💸',
          `₹${bal} successfully transferred to ${r.upiId}. Reference: UPI/${Date.now().toString().slice(-6)}`,
          'rider'
        );
        return { ...r, walletBalance: 0 };
      }
      return r;
    }));
  };

  // Notifications
  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        isMobileFrame,
        setIsMobileFrame,

        products,
        addProduct,
        updateProductStock,
        selectedProduct,
        setSelectedProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,

        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,

        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        placeOrder,
        updateOrderStatus,
        verifyOrderOtpAndDeliver,
        uploadRiderPickupPhoto,
        customerVerifyPickupPhoto,
        uploadDeliveryConfirmationPhoto,
        cancelOrder,
        requestReturn,

        sellers,
        activeSeller,
        setActiveSeller,
        registerSeller,
        approveSeller,

        riders,
        activeRider,
        setActiveRider,
        toggleRiderOnline,
        registerRider,
        approveRider,
        withdrawRiderEarnings,

        notifications,
        addNotification,
        markNotificationAsRead,
        unreadNotificationCount,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,

        isAiSearchOpen,
        setIsAiSearchOpen,
        aiSearchInitialTab,
        setAiSearchInitialTab,
        openAiPhotoSearch,

        isInstallModalOpen,
        setIsInstallModalOpen,

        fastServiceFilterOnly,
        setFastServiceFilterOnly
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

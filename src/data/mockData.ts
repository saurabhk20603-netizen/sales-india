import { Product, Category, Seller, Rider, Address, Coupon } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    nameEn: 'Electronics',
    nameHi: 'इलेक्ट्रॉनिक्स',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    itemCount: 1420
  },
  {
    id: 'fashion',
    nameEn: 'Fashion & Ethnic',
    nameHi: 'फैशन व परिधान',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
    itemCount: 2840
  },
  {
    id: 'grocery',
    nameEn: 'Grocery & Spices',
    nameHi: 'किराना व मसाले',
    icon: 'ShoppingBasket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
    itemCount: 3120
  },
  {
    id: 'appliances',
    nameEn: 'Home Appliances',
    nameHi: 'घरेलू उपकरण',
    icon: 'Refrigerator',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80',
    itemCount: 890
  },
  {
    id: 'beauty',
    nameEn: 'Beauty & Wellness',
    nameHi: 'सौंदर्य व वेलनेस',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
    itemCount: 1650
  },
  {
    id: 'furniture',
    nameEn: 'Furniture & Living',
    nameHi: 'फर्नीचर व गृह सज्जा',
    icon: 'Armchair',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    itemCount: 640
  },
  {
    id: 'sports',
    nameEn: 'Sports & Fitness',
    nameHi: 'खेल व फिटनेस',
    icon: 'Trophy',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80',
    itemCount: 780
  },
  {
    id: 'accessories',
    nameEn: 'Accessories & Bags',
    nameHi: 'एक्सेसरीज़ व बैग्स',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    itemCount: 1120
  }
];

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-delhi-elec',
    storeName: 'Delhi Electronics Wholesale Hub',
    ownerName: 'Sunil Gupta',
    phone: '+91 98112 44521',
    email: 'sunil@delhielectronics.in',
    sellerType: 'Wholesaler',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110006',
    address: 'Shop 42, Chandni Chowk Electronic Market',
    gstin: '07AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    bankAccount: '918800293121',
    ifsc: 'SBIN0001234',
    isVerified: true,
    joinedDate: '15 Jan 2024',
    rating: 4.8,
    totalProducts: 48,
    totalSales: 485000,
    commissionRate: 8,
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'seller-surat-silk',
    storeName: 'Surat Handloom & Silk Weavers',
    ownerName: 'Rajeshbhai Patel',
    phone: '+91 98251 33411',
    email: 'contact@surathandloom.com',
    sellerType: 'Manufacturer',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395002',
    address: 'Plot 108, Ring Road Textile Market',
    gstin: '24BBBBB1111B1Z2',
    pan: 'FGHIJ5678K',
    bankAccount: '112049283719',
    ifsc: 'HDFC0000456',
    isVerified: true,
    joinedDate: '02 Feb 2024',
    rating: 4.9,
    totalProducts: 85,
    totalSales: 720000,
    commissionRate: 8,
    logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'seller-mumbai-kirana',
    storeName: 'Bharat Pure Grocery & Spices',
    ownerName: 'Mahesh Deshmukh',
    phone: '+91 98200 99482',
    email: 'mahesh@bharatgrocery.in',
    sellerType: 'Kirana / Local Shop',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    address: 'Shop 12, Hill Road, Bandra West',
    gstin: '27CCCCC2222C1Z8',
    pan: 'KLMNO9012P',
    bankAccount: '501002384712',
    ifsc: 'ICIC0000102',
    isVerified: true,
    joinedDate: '10 Mar 2024',
    rating: 4.7,
    totalProducts: 110,
    totalSales: 310000,
    commissionRate: 6,
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    isNeighborhoodShop: true,
    marketArea: 'Hill Road Market',
    shopDistanceKm: 2.1
  },
  {
    id: 'seller-noida-kirana',
    storeName: 'Sharmaji Daily Kirana & Dairy (शर्मा जी किराना)',
    ownerName: 'Ramesh Sharma',
    phone: '+91 98104 55123',
    email: 'sharmaji.kirana@gmail.com',
    sellerType: 'Kirana / Local Shop',
    city: 'Noida / Delhi NCR',
    state: 'Uttar Pradesh',
    pincode: '201309',
    address: 'Shop 4, Main Market, Sector 62',
    gstin: '09EEEEE4444E1Z7',
    pan: 'VWXYZ7890A',
    bankAccount: '203918239012',
    ifsc: 'PUNB0019200',
    isVerified: true,
    joinedDate: '01 Jan 2024',
    rating: 4.9,
    totalProducts: 65,
    totalSales: 215000,
    commissionRate: 5,
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=150&q=80',
    isNeighborhoodShop: true,
    marketArea: 'Sector 62 Main Market',
    shopDistanceKm: 1.2
  },
  {
    id: 'seller-blore-appliances',
    storeName: 'Deccan Home Essentials',
    ownerName: 'Kavita Murthy',
    phone: '+91 98450 77123',
    email: 'kavita@deccanhome.co.in',
    sellerType: 'Brand',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    address: '4th Block, Jayanagar',
    gstin: '29DDDDD3333D1Z9',
    pan: 'QRSTU3456V',
    bankAccount: '338291039481',
    ifsc: 'UTIB0000213',
    isVerified: true,
    joinedDate: '20 Apr 2024',
    rating: 4.6,
    totalProducts: 34,
    totalSales: 540000,
    commissionRate: 8,
    logo: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'rider-ramesh',
    name: 'Ramesh Kumar',
    phone: '+91 97118 64210',
    email: 'ramesh.rider@gmail.com',
    vehicleType: 'Motorcycle',
    vehiclePlate: 'DL 03 CA 8492',
    drivingLicense: 'DL-142018003912',
    city: 'New Delhi',
    preferredZone: 'Central & South Delhi',
    isOnline: true,
    isVerified: true,
    rating: 4.9,
    totalTrips: 842,
    todayEarnings: 680,
    todayTrips: 7,
    walletBalance: 2450,
    upiId: 'ramesh.delivery@okhdfcbank',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    workingHoursType: 'Part-Time'
  },
  {
    id: 'rider-amit',
    name: 'Amit Vikram Singh',
    phone: '+91 98991 32456',
    email: 'amit.singh@gmail.com',
    vehicleType: 'Electric Vehicle',
    vehiclePlate: 'DL 01 EV 4109',
    drivingLicense: 'DL-142020005521',
    city: 'New Delhi',
    preferredZone: 'West Delhi & Connaught Place',
    isOnline: true,
    isVerified: true,
    rating: 4.8,
    totalTrips: 620,
    todayEarnings: 520,
    todayTrips: 5,
    walletBalance: 1820,
    upiId: 'amitsingh@paytm',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    workingHoursType: 'Full-Time'
  },
  {
    id: 'rider-priya',
    name: 'Priya Sharma',
    phone: '+91 98103 98214',
    email: 'priya.sharma99@gmail.com',
    vehicleType: 'Scooter',
    vehiclePlate: 'DL 05 AC 1928',
    drivingLicense: 'DL-142021008892',
    city: 'New Delhi',
    preferredZone: 'East Delhi & Noida Border',
    isOnline: false,
    isVerified: true,
    rating: 5.0,
    totalTrips: 310,
    todayEarnings: 380,
    todayTrips: 4,
    walletBalance: 950,
    upiId: 'priyasharma@ybl',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    workingHoursType: 'Weekend Special'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'prod-boat-rockerz',
    title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones with 15H Playtime, 40mm Dynamic Drivers',
    titleHi: 'बोट रॉकर्स 450 ब्लूटूथ ऑन-ईयर हेडफ़ोन, 15 घंटे प्लेटाइम, डीप बास',
    brand: 'boAt',
    category: 'electronics',
    price: 1299,
    mrp: 3990,
    discountPercent: 67,
    rating: 4.4,
    reviewCount: 14200,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse into nirvana with boAt Rockerz 450. Equipped with 40mm dynamic drivers that deliver punchy bass and crystal clear Indian acoustic profile. Enjoy non-stop music for up to 15 hours with soft adaptive ear cushions.',
    descriptionHi: '40 मिमी डायनामिक ड्राइवर्स के साथ शानदार बास और स्पष्ट आवाज। 15 घंटे की नॉन-स्टॉप बैटरी लाइफ और आरामदायक ईयर कुशन।',
    specifications: {
      'Battery Life': '15 Hours',
      'Driver Size': '40 mm',
      'Connectivity': 'Bluetooth v5.0 / AUX 3.5mm',
      'Charging Time': '2.5 Hours Micro-USB',
      'Warranty': '1 Year boAt Brand Warranty'
    },
    stock: 45,
    sellerId: 'seller-delhi-elec',
    sellerName: 'Delhi Electronics Wholesale Hub',
    sellerCity: 'New Delhi',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 2,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aakash Verma',
        rating: 5,
        date: '3 days ago',
        comment: 'Super fast 2 hour delivery in Delhi! Bass is very punchy, great value for money.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Pooja Nair',
        rating: 4,
        date: '1 week ago',
        comment: 'Nice battery life and sturdy headband. Cushion is soft.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-fire-boltt-smartwatch',
    title: 'Fire-Boltt Ninja Call Pro Plus 1.83 inch Bluetooth Calling Smart Watch, 120 Sports Modes, AI Voice',
    titleHi: 'फायर-बोल्ट निंजा कॉल प्रो प्लस स्मार्टवॉच, 1.83 इंच डिस्प्ले, ब्लूटूथ कॉलिंग',
    brand: 'Fire-Boltt',
    category: 'electronics',
    price: 1499,
    mrp: 7999,
    discountPercent: 81,
    rating: 4.3,
    reviewCount: 9840,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Track your health metrics with SpO2, real-time heart rate, and clear Bluetooth calling. Large 1.83" HD display with metallic finish.',
    specifications: {
      'Display': '1.83 inch HD 240x284 px',
      'Calling': 'Bluetooth Calling with Mic & Speaker',
      'Battery': 'Up to 6 Days standard use',
      'Water Resistance': 'IP67 Water & Dust Proof'
    },
    stock: 60,
    sellerId: 'seller-delhi-elec',
    sellerName: 'Delhi Electronics Wholesale Hub',
    sellerCity: 'New Delhi',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 4,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Rohit Sharma',
        rating: 5,
        date: 'Yesterday',
        comment: 'The call clarity is crisp even in traffic. Totally worth ₹1499!',
        verifiedPurchase: true
      }
    ]
  },

  // Fashion & Ethnic
  {
    id: 'prod-surat-banarasi-saree',
    title: 'Surat Handloom Kanjivaram Soft Silk Saree with Rich Zari Woven Pallu & Blouse Piece',
    titleHi: 'सूरत हैंडलूम कांजीवरम सॉफ्ट सिल्क साड़ी, जरी पल्लू एवं ब्लाउज पीस के साथ',
    brand: 'Surat Handloom',
    category: 'fashion',
    price: 1899,
    mrp: 5499,
    discountPercent: 65,
    rating: 4.7,
    reviewCount: 3820,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted directly by heritage weavers of Surat. Features traditional peacock motif zari border, lustrous sheen, lightweight drape, and matching 0.8m unstitched jacquard blouse piece.',
    descriptionHi: 'सूरत के बुनकरों द्वारा तैयार पारंपरिक मोर मोटिफ और समृद्ध जरी बॉर्डर वाली शुद्ध सिल्क साड़ी।',
    specifications: {
      'Fabric': 'Art Silk / Litchi Silk',
      'Length': 'Saree: 5.5 Mtr, Blouse: 0.8 Mtr',
      'Occasion': 'Festive, Wedding, Pooja',
      'Wash Care': 'Dry Clean Recommended'
    },
    stock: 32,
    sellerId: 'seller-surat-silk',
    sellerName: 'Surat Handloom & Silk Weavers',
    sellerCity: 'Surat',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 24,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Sunita Mehra',
        rating: 5,
        date: '4 days ago',
        comment: 'The zari work looks so regal. Received so many compliments at my nephew wedding!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-cotton-kurta-men',
    title: 'Manyavar Style Pure Cotton Chikankari Embroidered Men Long Kurta with Mandarin Collar',
    titleHi: 'शुद्ध कॉटन चिकनकारी कढ़ाईदार पुरुषों का कुर्ता, मंदारिन कॉलर',
    brand: 'Royal Awadh',
    category: 'fashion',
    price: 999,
    mrp: 2499,
    discountPercent: 60,
    rating: 4.5,
    reviewCount: 1940,
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic Lucknowi style fine thread embroidery on 100% breathable combed cotton. Perfect for Indian summers, family festivities, and casual ethnic wear.',
    specifications: {
      'Fabric': '100% Combed Cotton',
      'Sleeve Length': 'Full Sleeves',
      'Fit': 'Regular Fit',
      'Country of Origin': 'India'
    },
    stock: 55,
    sellerId: 'seller-surat-silk',
    sellerName: 'Surat Handloom & Silk Weavers',
    sellerCity: 'Surat',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 24,
    reviews: [
      {
        id: 'rev-5',
        userName: 'Gaurav Dubey',
        rating: 5,
        date: '5 days ago',
        comment: 'Very breathable cotton fabric, Lucknowi thread work is neat and premium.',
        verifiedPurchase: true
      }
    ]
  },

  // Grocery & Spices
  {
    id: 'prod-local-amul-combo',
    title: 'Amul Taaza Milk 1L & Fresh Malai Paneer 200g Daily Combo (Fresh from Local Shop)',
    titleHi: 'अमुल ताज़ा दूध 1 लीटर व ताज़ा पनीर 200 ग्राम (स्थानीय दुकान से ताजा)',
    brand: 'Amul Dairy',
    category: 'grocery',
    price: 145,
    mrp: 160,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Fresh morning stock directly from your neighborhood Sharmaji Kirana & Dairy. Guaranteed fresh date batch, stored in refrigerated chiller.',
    descriptionHi: 'आपके नजदीकी शर्मा जी किराना से ताजा दूध और मलाई पनीर। राइडर दुकान से बिल और सामान की लाइव फोटो खींचकर शेयर करेगा।',
    specifications: {
      'Shelf Life': 'Fresh Today',
      'Source Shop': 'Sharmaji Daily Kirana & Dairy (1.2 km away)',
      'Delivery Time': '30 Minutes Express',
      'Photo Verification': 'Rider captures live photo at store pickup'
    },
    stock: 40,
    sellerId: 'seller-noida-kirana',
    sellerName: 'Sharmaji Daily Kirana & Dairy (शर्मा जी किराना)',
    sellerCity: 'Noida / Delhi NCR',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 1,
    isLocalShopProduct: true,
    shopDistanceKm: 1.2,
    shopAddress: 'Shop 4, Main Market, Sector 62',
    reviews: [
      {
        id: 'rev-l1',
        userName: 'Priya Narang',
        rating: 5,
        date: 'Today',
        comment: 'Rider took photo of the milk & paneer at the shop counter and shared it on app before coming. So reassuring!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-tata-tea-gold',
    title: 'Tata Tea Gold 1kg Royal Blend with Gently Rolled Aromatic Long Leaves (Rich Aroma)',
    titleHi: 'टाटा टी गोल्ड 1 किग्रा चाय पत्ती, सुगंधित लंबी पत्तियां',
    brand: 'Tata Tea',
    category: 'grocery',
    price: 520,
    mrp: 650,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 28900,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A delicate blend of Assam CTC teas along with 15% long tea leaves for irresistible aroma and strong brisk cup. Sourced from the finest Indian tea gardens.',
    specifications: {
      'Net Quantity': '1000 g (1 kg)',
      'Form': 'Loose Tea Leaves',
      'Shelf Life': '12 Months',
      'FSSAI Lic.': '10014031001025'
    },
    stock: 120,
    sellerId: 'seller-mumbai-kirana',
    sellerName: 'Bharat Pure Grocery & Spices',
    sellerCity: 'Mumbai',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 2,
    reviews: [
      {
        id: 'rev-6',
        userName: 'Meenakshi Iyer',
        rating: 5,
        date: '2 days ago',
        comment: 'Original pack, fresh batch, delivered in 45 minutes by Sales India rider!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-daawat-basmati-rice',
    title: 'Daawat Rozana Super Basmati Rice 5kg, Aged Long Grain for Daily Pulao & Biryani',
    titleHi: 'दावत रोज़ाना सुपर बासमती चावल 5 किग्रा, लंबे दाने',
    brand: 'Daawat',
    category: 'grocery',
    price: 435,
    mrp: 580,
    discountPercent: 25,
    rating: 4.6,
    reviewCount: 15400,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Naturally aged Himalayan basmati rice that cooks up non-sticky, fluffy, and pleasantly fragrant. Ideal for everyday Indian meals.',
    specifications: {
      'Weight': '5 kg Bag',
      'Grain Length': 'Up to 2x elongation on cooking',
      'Dietary Preference': 'Vegetarian, Gluten Free'
    },
    stock: 90,
    sellerId: 'seller-mumbai-kirana',
    sellerName: 'Bharat Pure Grocery & Spices',
    sellerCity: 'Mumbai',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 2,
    reviews: [
      {
        id: 'rev-7',
        userName: 'Deepak Joshi',
        rating: 4,
        date: '3 days ago',
        comment: 'Great daily rice, good aroma and reasonable price.',
        verifiedPurchase: true
      }
    ]
  },

  // Home Appliances
  {
    id: 'prod-prestige-mixer-grinder',
    title: 'Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars and 1 Juicer Jar',
    titleHi: 'प्रेस्टीज आइरिस 750 वॉट मिक्सर ग्राइंडर, 3 स्टील जार + 1 जूसर जार',
    brand: 'Prestige',
    category: 'appliances',
    price: 3199,
    mrp: 6195,
    discountPercent: 48,
    rating: 4.4,
    reviewCount: 19800,
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy duty 750W motor with overload protection, ideal for grinding tough South Indian dosa batter, turmeric, and fresh ginger-garlic paste.',
    specifications: {
      'Wattage': '750 Watts',
      'No. of Jars': '4 Jars (Wet, Dry, Chutney, Juicer)',
      'Blade Material': 'High Grade Stainless Steel 304',
      'Warranty': '2 Years on Product'
    },
    stock: 22,
    sellerId: 'seller-blore-appliances',
    sellerName: 'Deccan Home Essentials',
    sellerCity: 'Bengaluru',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 6,
    reviews: [
      {
        id: 'rev-8',
        userName: 'Ananya S.',
        rating: 5,
        date: '1 week ago',
        comment: 'Grinds idli batter in 2 minutes. Transparent juicer jar is also very handy.',
        verifiedPurchase: true
      }
    ]
  },

  // Beauty & Wellness
  {
    id: 'prod-mamaearth-facewash',
    title: 'Mamaearth Vitamin C Face Wash with Turmeric for Skin Illumination (250ml Jumbo Pack)',
    titleHi: 'मामाअर्थ विटामिन सी फेस वॉश हल्दी के साथ, 250 मिली',
    brand: 'Mamaearth',
    category: 'beauty',
    price: 349,
    mrp: 499,
    discountPercent: 30,
    rating: 4.5,
    reviewCount: 11200,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Toxin-free face wash infused with natural Vitamin C and Turmeric to reverse sun tan, fight pollution, and impart natural glow. Made Safe Certified.',
    specifications: {
      'Volume': '250 ml',
      'Key Ingredients': 'Vitamin C, Turmeric, Aloe Vera',
      'Skin Type': 'All Skin Types',
      'Cruelty Free': 'Yes, PETA Certified'
    },
    stock: 75,
    sellerId: 'seller-mumbai-kirana',
    sellerName: 'Bharat Pure Grocery & Spices',
    sellerCity: 'Mumbai',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 2,
    reviews: [
      {
        id: 'rev-9',
        userName: 'Rhea Sengupta',
        rating: 5,
        date: 'Yesterday',
        comment: 'Gentle on skin and does not dry out face. Smells very fresh!',
        verifiedPurchase: true
      }
    ]
  },

  // Furniture & Living
  {
    id: 'prod-wakefit-ergonomic-chair',
    title: 'Wakefit Orthopedic High Back Ergonomic Mesh Office & Study Chair with Adjustable Lumbar',
    titleHi: 'वेकफिट ऑर्थोपेडिक हाई बैक एर्गोनोमिक मेश ऑफिस चेयर',
    brand: 'Wakefit',
    category: 'furniture',
    price: 4999,
    mrp: 9499,
    discountPercent: 47,
    rating: 4.6,
    reviewCount: 4310,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c999c016e138?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed for long working hours with breathable Korean mesh back, synchro-tilt lock, heavy duty gas lift tested for up to 125 kg weight.',
    specifications: {
      'Dimensions': '65 x 65 x 120 cm',
      'Back Rest': 'Breathable Mesh with Lumbar Support',
      'Weight Capacity': '125 kg',
      'Warranty': '3 Years Manufacturer Warranty'
    },
    stock: 18,
    sellerId: 'seller-blore-appliances',
    sellerName: 'Deccan Home Essentials',
    sellerCity: 'Bengaluru',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 24,
    reviews: [
      {
        id: 'rev-10',
        userName: 'Karan Mehra',
        rating: 5,
        date: '6 days ago',
        comment: 'Fixed my lower back pain completely. Assembled in 10 minutes.',
        verifiedPurchase: true
      }
    ]
  },

  // Sports & Fitness
  {
    id: 'prod-cosco-cricket-bat',
    title: 'Cosco Master English Willow Grade 1 Cricket Bat (Full Adult Size, 1180g Light Pickup)',
    titleHi: 'कॉस्को मास्टर इंग्लिश विलो क्रिकेट बैट, एडल्ट साइज',
    brand: 'Cosco',
    category: 'sports',
    price: 2499,
    mrp: 4999,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 1680,
    images: [
      'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted English Willow cricket bat with curved blade, thick edges (38mm) and superb ping. Comes with padded bat cover.',
    specifications: {
      'Wood Type': 'Grade 1 English Willow',
      'Weight': '1180 grams',
      'Handle': 'Singapore Cane 3-Piece Rubber',
      'Size': 'Full Size SH (Short Handle)'
    },
    stock: 25,
    sellerId: 'seller-delhi-elec',
    sellerName: 'Delhi Electronics Wholesale Hub',
    sellerCity: 'New Delhi',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 4,
    reviews: [
      {
        id: 'rev-11',
        userName: 'Vikas Kohli',
        rating: 5,
        date: '3 days ago',
        comment: 'Great stroke and balance. Hit two sixes in my weekend match!',
        verifiedPurchase: true
      }
    ]
  },

  // Accessories & Bags
  {
    id: 'prod-wildcraft-backpack',
    title: 'Wildcraft 35 Litres Water Resistant Laptop Backpack with Rain Cover & 3 Compartments',
    titleHi: 'वाइल्डक्राफ्ट 35 लीटर वाटर रेसिस्टेंट लैपटॉप बैकपैक',
    brand: 'Wildcraft',
    category: 'accessories',
    price: 1399,
    mrp: 2999,
    discountPercent: 53,
    rating: 4.6,
    reviewCount: 7420,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy duty ripstop polyester bag with padded sleeve for up to 15.6 inch laptops, organizer pockets, ergonomic shoulder straps, and built-in bottom rain cover.',
    specifications: {
      'Capacity': '35 Litres',
      'Compartments': '3 Main + 1 Front Quick Access',
      'Material': 'Polyester Ripstop Coated',
      'Warranty': '5 Years Brand Warranty'
    },
    stock: 40,
    sellerId: 'seller-delhi-elec',
    sellerName: 'Delhi Electronics Wholesale Hub',
    sellerCity: 'New Delhi',
    isLocalVocal: true,
    isAssured: true,
    fastDeliveryHours: 2,
    reviews: [
      {
        id: 'rev-12',
        userName: 'Sanjay Rawat',
        rating: 5,
        date: '5 days ago',
        comment: 'Solid build quality. Survives monsoon rain without any seepage.',
        verifiedPurchase: true
      }
    ]
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Saurabh Kumar',
    phone: '+91 98712 34567',
    flat: 'Flat 402, Block C, Royal Palm Heights',
    street: 'Sector 62, Near Electronic City Metro Station',
    landmark: 'Opposite Fortis Hospital',
    city: 'Noida / Delhi NCR',
    state: 'Uttar Pradesh',
    pincode: '201309',
    type: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Saurabh Kumar (Office)',
    phone: '+91 98712 34567',
    flat: 'Tower B, 7th Floor, Cyber Hub Tech Park',
    street: 'DLF Phase 2, MG Road',
    landmark: 'Near Cyber City Rapid Metro',
    city: 'Gurugram / Delhi NCR',
    state: 'Haryana',
    pincode: '122002',
    type: 'Work',
    isDefault: false
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BHAARAT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 499,
    description: 'Flat ₹100 instant discount on orders above ₹499',
    descriptionHi: '₹499 से अधिक के ऑर्डर पर तुरंत ₹100 की छूट'
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 999,
    maxDiscount: 500,
    description: '20% discount (up to ₹500) for festive season shopping',
    descriptionHi: 'त्योहारी सीजन पर 20% तक (अधिकतम ₹500) की छूट'
  },
  {
    code: 'FREEDEL',
    discountType: 'fixed',
    discountValue: 40,
    minOrderValue: 299,
    description: 'Save ₹40 on delivery fees on your order',
    descriptionHi: 'अपने ऑर्डर पर ₹40 डिलीवरी शुल्क बचाएं'
  }
];

export const HERO_BANNERS = [
  {
    id: 'banner-1',
    title: 'Maha Shopping Bazar 2026',
    titleHi: 'महा शॉपिंग बाज़ार 2026',
    tagline: 'Up to 70% Off on Indian Brands & Local Sellers',
    taglineHi: 'भारतीय ब्रांड्स और स्थानीय विक्रेताओं पर 70% तक की छूट',
    badge: 'GRAND INDIAN FESTIVAL',
    badgeHi: 'भव्य भारतीय उत्सव',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-orange-600 via-amber-600 to-rose-700',
    buttonText: 'Shop Deals Now',
    buttonTextHi: 'अभी डील्स खरीदें'
  },
  {
    id: 'banner-2',
    title: 'Vocal For Local Super Express',
    titleHi: 'वोकल फॉर लोकल सुपर एक्सप्रेस',
    tagline: 'Direct from Surat Weavers, Delhi Wholesalers & Local Kirana',
    taglineHi: 'सूरत के बुनकरों और स्थानीय दुकानदारों से सीधा आपके घर',
    badge: '100% INDIAN SOURCED',
    badgeHi: '100% भारतीय उत्पाद',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    buttonText: 'Explore Local Hubs',
    buttonTextHi: 'लोकल हब्स देखें'
  },
  {
    id: 'banner-3',
    title: 'Earn ₹800+ Daily as Sales India Rider',
    titleHi: 'सेल्स इंडिया राइडर बनकर प्रतिदिन ₹800+ कमाएं',
    tagline: 'Flexible 2-3 hours shifts. Work with your bike, scooter, or EV.',
    taglineHi: 'सुविधानुसार समय। अपनी बाइक या स्कूटर से स्वतंत्र डिलीवरी करें।',
    badge: 'INSTANT UPI PAYOUTS',
    badgeHi: 'तुरंत यूपीआई भुगतान',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    buttonText: 'Join as Delivery Partner',
    buttonTextHi: 'डिलीवरी पार्टनर बनें'
  }
];

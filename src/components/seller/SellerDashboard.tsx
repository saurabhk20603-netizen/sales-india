import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Seller, OrderStatus, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { 
  Store, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Upload, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  X, 
  Layers, 
  ArrowUpRight,
  Sparkles,
  Search,
  Eye,
  Percent
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { 
    activeSeller, 
    sellers, 
    setActiveSeller, 
    products, 
    addProduct, 
    updateProductStock, 
    orders, 
    updateOrderStatus,
    registerSeller,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'finances' | 'profile'>('orders');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isRegisterStoreModalOpen, setIsRegisterStoreModalOpen] = useState(false);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    titleHi: '',
    brand: activeSeller.storeName,
    category: 'electronics' as CategoryId,
    price: 999,
    mrp: 1999,
    stock: 50,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    fastDeliveryHours: 2,
    isLocalVocal: true,
    isAssured: true,
    specKey: 'Warranty',
    specVal: '1 Year Brand Warranty'
  });

  // Onboarding Store Form state
  const [onboardingStore, setOnboardingStore] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    sellerType: 'Kirana / Local Shop' as Seller['sellerType'],
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    address: '',
    gstin: '07ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    bankAccount: '1234567890',
    ifsc: 'SBIN0001234'
  });

  // Filter products belonging to this seller
  const sellerProducts = products.filter(p => p.sellerId === activeSeller.id || p.sellerName === activeSeller.storeName);

  // Filter orders containing items from this seller
  const sellerOrders = orders.filter(o => o.items.some(it => it.sellerId === activeSeller.id || it.sellerName === activeSeller.storeName));

  // Financial calculations
  const grossSales = sellerOrders.reduce((sum, o) => {
    const itemTotal = o.items
      .filter(it => it.sellerId === activeSeller.id || it.sellerName === activeSeller.storeName)
      .reduce((sub, it) => sub + (it.price * it.quantity), 0);
    return sum + itemTotal;
  }, 0);

  const platformFee = Math.round(grossSales * 0.08); // 8% platform fee
  const netEarnings = grossSales - platformFee;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    const discountPercent = Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100);

    addProduct({
      title: newProduct.title,
      titleHi: newProduct.titleHi,
      brand: newProduct.brand || activeSeller.storeName,
      category: newProduct.category,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      discountPercent: Math.max(0, discountPercent),
      images: [newProduct.imageUrl],
      description: newProduct.description || 'Authentic quality product from verified Indian seller.',
      descriptionHi: 'भारतीय विक्रेता से प्रमाणित गुणवत्ता वाला उत्पाद।',
      specifications: {
        [newProduct.specKey]: newProduct.specVal,
        'Dispatched by': activeSeller.storeName,
        'Origin': 'Made in India'
      },
      stock: Number(newProduct.stock),
      sellerId: activeSeller.id,
      sellerName: activeSeller.storeName,
      sellerCity: activeSeller.city,
      isLocalVocal: newProduct.isLocalVocal,
      isAssured: newProduct.isAssured,
      fastDeliveryHours: Number(newProduct.fastDeliveryHours),
      isLocalShopProduct: activeSeller.sellerType === 'Kirana / Local Shop' || Boolean(activeSeller.isNeighborhoodShop),
      shopDistanceKm: activeSeller.shopDistanceKm || 1.2,
      shopAddress: `${activeSeller.address}, ${activeSeller.city}`
    });

    setIsAddProductModalOpen(false);
    // Reset
    setNewProduct({
      title: '',
      titleHi: '',
      brand: activeSeller.storeName,
      category: 'electronics',
      price: 999,
      mrp: 1999,
      stock: 50,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      fastDeliveryHours: 2,
      isLocalVocal: true,
      isAssured: true,
      specKey: 'Warranty',
      specVal: '1 Year Brand Warranty'
    });
  };

  const handleRegisterNewStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingStore.storeName || !onboardingStore.ownerName) return;

    registerSeller({
      ...onboardingStore,
      rating: 5.0,
      totalSales: 0,
      totalProducts: 0
    });

    setIsRegisterStoreModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Seller Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white/10 shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{activeSeller.storeName}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>GSTIN Verified</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Owner: <strong>{activeSeller.ownerName}</strong> • {activeSeller.city}, {activeSeller.state} • {activeSeller.sellerType}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              GSTIN: {activeSeller.gstin} | PAN: {activeSeller.pan}
            </p>
          </div>
        </div>

        {/* Store switch or register new shopkeeper */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch existing store */}
          <select
            value={activeSeller.id}
            onChange={(e) => {
              const selected = sellers.find(s => s.id === e.target.value);
              if (selected) setActiveSeller(selected);
            }}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            {sellers.map(s => (
              <option key={s.id} value={s.id}>
                Store: {s.storeName} ({s.city})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsRegisterStoreModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard New Store</span>
          </button>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">{t.grossSales}</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{grossSales.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this month</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">{t.netSettlement}</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            ₹{netEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-slate-600 mt-1">
            8% platform fee deducted transparently
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">{t.activeOrders}</p>
          <p className="text-xl sm:text-2xl font-black text-orange-600 mt-1">
            {sellerOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
          </p>
          <p className="text-[10px] text-slate-600 mt-1">Ready for pickup & packing</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">{t.catalogCount}</p>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">
            {sellerProducts.length}
          </p>
          <p className="text-[10px] text-slate-600 mt-1">Live in Sales India Bazar</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders to Fulfill ({sellerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Inventory & Products ({sellerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'finances' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Bank Settlements & Fee (8%)</span>
        </button>
      </div>

      {/* TAB 1: ORDERS FULFILLMENT PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {sellerOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800">No Orders in Queue</h4>
              <p className="text-xs text-slate-500 mt-1">
                When customers purchase from {activeSeller.storeName}, orders will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sellerOrders.map(order => {
                const isReady = order.status === 'ready_for_pickup' || order.status === 'picked_up' || order.status === 'out_for_delivery' || order.status === 'delivered';
                const isDelivered = order.status === 'delivered';

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">Order #{order.id}</span>
                        <span className="text-slate-500">• {new Date(order.createdAt).toLocaleTimeString()}</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          Status: {t.stages[order.status] || order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items for this seller */}
                    <div className="space-y-2">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <img src={it.image} alt={it.title} className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border" />
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{it.title}</p>
                            <p className="text-slate-500 text-[11px]">Qty: {it.quantity} × ₹{it.price}</p>
                          </div>
                          <span className="font-black text-slate-900">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Seller action controls: Accept -> Pack -> Ready for rider */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="text-slate-600">
                        Customer Destination: <strong>{order.deliveryAddress.city} ({order.deliveryAddress.pincode})</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Accept Order
                          </button>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Pack & Mark Ready for Rider Pickup
                          </button>
                        )}

                        {isReady && !isDelivered && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                            ✓ Ready / Dispatched with Rider {order.deliveryDetails.riderName}
                          </span>
                        )}

                        {isDelivered && (
                          <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-xl">
                            ✓ Order Delivered & Handover Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Your Store Catalog</h4>
              <p className="text-xs text-slate-500">Live prices and instant stock quantity updates</p>
            </div>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sellerProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <img src={prod.images[0]} alt={prod.title} className="w-20 h-20 rounded-xl object-contain bg-slate-50 p-1 border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-orange-600">{prod.category}</span>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">{prod.title}</h5>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-black text-sm text-slate-900">₹{prod.price}</span>
                      <span className="text-xs text-slate-600 line-through">₹{prod.mrp}</span>
                      <span className="text-[11px] text-emerald-600 font-bold">{prod.discountPercent}% off</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-[11px]">Stock:</span>
                    <input
                      type="number"
                      value={prod.stock}
                      onChange={(e) => updateProductStock(prod.id, parseInt(e.target.value) || 0)}
                      className="w-16 p-1 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prod.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {prod.stock > 10 ? 'In Stock' : 'Low Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BANK SETTLEMENTS & FINANCES */}
      {activeTab === 'finances' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Sales Settlements & Platform Commission</h3>
            <p className="text-xs text-slate-500">
              Direct automated bank settlement via NEFT/IMPS to your registered Indian business bank account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Registered Bank Account</span>
              <p className="text-sm font-bold text-slate-900 mt-1">State Bank of India</p>
              <p className="text-xs font-mono text-slate-600">A/C: {activeSeller.bankAccount}</p>
              <p className="text-xs font-mono text-slate-600">IFSC: {activeSeller.ifsc}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Platform Fee Agreement</span>
              <p className="text-xl font-black text-indigo-700 mt-1">8.0% Flat</p>
              <p className="text-xs text-slate-600 mt-0.5">Includes gateway charges, customer service & hosting</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Next Payout Cycle</span>
              <p className="text-sm font-bold text-emerald-950 mt-1">T+2 Daily Rolling</p>
              <p className="text-xs text-emerald-700 mt-0.5">Cleared balance: ₹{netEarnings.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Add New Product to Store Catalog</h3>
              <button onClick={() => setIsAddProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Copper Water Dispenser 5L"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title (Hindi - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. शुद्ध तांबे का वाटर डिस्पेंसर"
                  value={newProduct.titleHi}
                  onChange={(e) => setNewProduct({ ...newProduct, titleHi: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory / Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bazar Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original M.R.P. (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Key features and specifications"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONBOARD NEW STORE MODAL */}
      {isRegisterStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Onboard Indian Seller / Kirana Shop</h3>
              <button onClick={() => setIsRegisterStoreModalOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewStore} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store / Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laxmi Handlooms & Textiles"
                  value={onboardingStore.storeName}
                  onChange={(e) => setOnboardingStore({ ...onboardingStore, storeName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proprietor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vijay Sharma"
                    value={onboardingStore.ownerName}
                    onChange={(e) => setOnboardingStore({ ...onboardingStore, ownerName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seller Type</label>
                  <select
                    value={onboardingStore.sellerType}
                    onChange={(e) => setOnboardingStore({ ...onboardingStore, sellerType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="Kirana / Local Shop">Kirana / Local Shop</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Brand">Direct Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    required
                    value={onboardingStore.gstin}
                    onChange={(e) => setOnboardingStore({ ...onboardingStore, gstin: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City & State</label>
                  <input
                    type="text"
                    required
                    value={onboardingStore.city}
                    onChange={(e) => setOnboardingStore({ ...onboardingStore, city: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterStoreModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { MobileFrameWrapper } from './components/common/MobileFrameWrapper';
import { CustomerHome } from './components/customer/CustomerHome';
import { ProductModal } from './components/customer/ProductModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { AiPhotoSearchModal } from './components/common/AiPhotoSearchModal';
import { InstallAppModal } from './components/common/InstallAppModal';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, Order } from './types';
import { CATEGORIES } from './data/mockData';

const MainContent: React.FC = () => {
  const { 
    role, 
    selectedProduct, 
    setSelectedProduct, 
    isCheckoutOpen, 
    setIsCheckoutOpen,
    activeTrackingOrder,
    setActiveTrackingOrder,
    addToCart,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    language,
    isAiSearchOpen,
    setIsAiSearchOpen,
    aiSearchInitialTab,
    isInstallModalOpen,
    setIsInstallModalOpen
  } = useApp();

  // Customer navigation state
  const [customerTab, setCustomerTab] = useState<'home' | 'categories' | 'orders' | 'profile'>('home');

  // Direct checkout product if user clicked "Buy Now"
  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <Header 
        onOpenOrders={() => setCustomerTab('orders')}
        onOpenProfile={() => setCustomerTab('profile')}
      />

      {/* Main View Area based on active Role */}
      <main className="flex-1">
        {role === 'customer' && (
          <>
            {customerTab === 'home' && (
              <CustomerHome 
                onOpenProductDetails={(prod) => setSelectedProduct(prod)}
                onBuyNow={handleBuyNow}
              />
            )}

            {customerTab === 'categories' && (
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <h2 className="text-xl font-black text-slate-900">
                  {language === 'hi' ? 'सभी श्रेणियां' : 'All Product Categories'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.id);
                        setCustomerTab('home');
                      }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer group"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-slate-100">
                        <img 
                          src={cat.image} 
                          alt={cat.nameEn} 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="p-3.5">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition">
                          {language === 'hi' ? cat.nameHi : cat.nameEn}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.itemCount}+ products listed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerTab === 'orders' && (
              <CustomerOrders 
                onTrackOrder={(order) => setActiveTrackingOrder(order)}
                onBackToShopping={() => setCustomerTab('home')}
              />
            )}

            {customerTab === 'profile' && (
              <CustomerProfile 
                onBackToShopping={() => setCustomerTab('home')}
              />
            )}
          </>
        )}

        {role === 'seller' && <SellerDashboard />}

        {role === 'rider' && <RiderDashboard />}

        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Mobile Bottom Navigation for Customer Role */}
      {role === 'customer' && (
        <BottomNav 
          currentTab={customerTab}
          setCurrentTab={setCustomerTab}
        />
      )}

      {/* MODALS */}
      {/* 1. Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer 
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* 4. Live Order Tracking Modal with Map & OTP */}
      {activeTrackingOrder && (
        <OrderTrackingModal
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* 5. AI & Photo Visual Search Modal */}
      <AiPhotoSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        initialTab={aiSearchInitialTab}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* 6. PWA Fast App Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Footer (Desktop) */}
      <footer className="bg-slate-900 text-white mt-12 py-10 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-sm">
                SI
              </div>
              <span className="font-black text-base">Sales India</span>
            </div>
            <p className="text-slate-400">
              India&apos;s homegrown multi-vendor e-commerce marketplace and flexible last-mile logistics partner.
            </p>
            <p className="text-amber-400 font-bold">Shop Smart. Sell More. Earn Anytime.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">For Customers</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Track Active Deliveries</li>
              <li>Vocal for Local Indian Sellers</li>
              <li>7-Day Hassle-Free Returns</li>
              <li>Sales India Assured Guarantee</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">For Sellers & Brands</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Low 8% Transparent Commission</li>
              <li>Instant Daily T+2 Bank Settlement</li>
              <li>GST Verification Support</li>
              <li>Bulk Product Catalog Upload</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">For Rider Delivery Partners</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Work Flexibly Anytime (Part-Time / Full-Time)</li>
              <li>Deliver with Bike, Scooter, or EV</li>
              <li>Instant UPI Wallet Payouts</li>
              <li>₹65+ Per Delivery + Daily Milestone Bonuses</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <p>© 2026 Sales India Marketplace Pvt Ltd. Built with pride in India 🇮🇳</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Grievance Officer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MobileFrameWrapper>
        <MainContent />
      </MobileFrameWrapper>
    </AppProvider>
  );
}

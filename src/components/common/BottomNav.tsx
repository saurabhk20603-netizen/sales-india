import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'categories' | 'orders' | 'profile';
  setCurrentTab: (tab: 'home' | 'categories' | 'orders' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { role, cartTotalCount, setIsCartOpen, t } = useApp();

  if (role !== 'customer') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
          currentTab === 'home' ? 'text-orange-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t.home}</span>
      </button>

      <button
        onClick={() => setCurrentTab('categories')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
          currentTab === 'categories' ? 'text-orange-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t.categories}</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center py-1 px-2 rounded-lg relative text-slate-600 hover:text-orange-600 transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartTotalCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartTotalCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">{t.cart}</span>
      </button>

      <button
        onClick={() => setCurrentTab('orders')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
          currentTab === 'orders' ? 'text-orange-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t.orders}</span>
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
          currentTab === 'profile' ? 'text-orange-600 font-bold' : 'text-slate-600'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t.profile}</span>
      </button>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SearchAutocomplete } from './SearchAutocomplete';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Heart, 
  Bell, 
  Globe, 
  Smartphone, 
  Laptop, 
  Store, 
  Bike, 
  ShieldCheck, 
  User, 
  X,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Download,
  Zap,
  Camera
} from 'lucide-react';

interface HeaderProps {
  onOpenOrders: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrders, onOpenProfile }) => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    cartTotalCount, 
    cartSubtotal, 
    setIsCartOpen,
    wishlist,
    isMobileFrame,
    setIsMobileFrame,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedAddress,
    addresses,
    setSelectedAddress,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    openAiPhotoSearch,
    setIsInstallModalOpen,
    fastServiceFilterOnly,
    setFastServiceFilterOnly
  } = useApp();

  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const rolesList: { id: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: 'customer', 
      label: t.customer, 
      icon: User, 
      color: 'bg-orange-500 text-white', 
      desc: 'Browse & Buy Indian Products' 
    },
    { 
      id: 'seller', 
      label: t.seller, 
      icon: Store, 
      color: 'bg-indigo-600 text-white', 
      desc: 'Manage Store, Catalog & Orders' 
    },
    { 
      id: 'rider', 
      label: t.rider, 
      icon: Bike, 
      color: 'bg-emerald-600 text-white', 
      desc: 'Earn with Flexible Deliveries' 
    },
    { 
      id: 'admin', 
      label: t.admin, 
      icon: ShieldCheck, 
      color: 'bg-slate-900 text-white', 
      desc: 'Platform Master Controls' 
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      {/* Top Banner: Indian Festive & Free Delivery Offer */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">
            🇮🇳 BHARAT BAZAR
          </span>
          <span className="truncate">
            {language === 'en' 
              ? '✨ Mega Shopping Festival: Free Express Delivery on orders above ₹499! Vocal for Local Indian Sellers' 
              : '✨ महा शॉपिंग उत्सव: ₹499 से अधिक पर मुफ़्त एक्सप्रेस डिलीवरी! भारतीय दुकानदारों का समर्थन करें'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] shrink-0">
          {/* Mobile Bezel preview toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden md:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition font-semibold"
            title="Toggle Android Phone Frame"
          >
            {isMobileFrame ? <Laptop className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{isMobileFrame ? 'Desktop View' : '📱 Android App View'}</span>
          </button>

          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded-full font-bold transition"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setRole('customer');
              setSelectedCategoryFilter(null);
            }} 
            className="text-left flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
              SI
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Sales India
                </span>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200">
                  बाज़ार
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                {t.appTagline}
              </p>
            </div>
          </button>

          {/* Delivery Location Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <div className="text-left max-w-[140px] truncate">
                <p className="text-[10px] text-slate-600">{t.deliverTo}:</p>
                <p className="font-semibold text-slate-800 text-xs truncate">
                  {selectedAddress.city} - {selectedAddress.pincode}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-600" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <p className="text-xs font-bold text-slate-700 px-2 py-1">Saved Delivery Addresses</p>
                <div className="space-y-1">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setIsLocationMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition ${
                        selectedAddress.id === addr.id 
                          ? 'bg-orange-50 border border-orange-200 text-orange-900 font-semibold' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{addr.type}</span>
                        <span className="text-[10px] text-slate-500">{addr.pincode}</span>
                      </div>
                      <p className="text-[11px] truncate text-slate-500">{addr.flat}, {addr.street}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar (for customer mode) */}
        {role === 'customer' && (
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <SearchAutocomplete />
          </div>
        )}

        {/* Role Switcher Pill & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-xs cursor-pointer bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
            >
              {role === 'customer' && <User className="w-3.5 h-3.5 text-orange-400" />}
              {role === 'seller' && <Store className="w-3.5 h-3.5 text-indigo-400" />}
              {role === 'rider' && <Bike className="w-3.5 h-3.5 text-emerald-400" />}
              {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              <span className="capitalize">{role === 'customer' ? 'Customer' : role === 'seller' ? 'Seller Hub' : role === 'rider' ? 'Rider Partner' : 'Admin'}</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{t.switchRole}</p>
                  <p className="text-xs text-slate-700">Explore Sales India from any perspective</p>
                </div>
                <div className="space-y-1">
                  {rolesList.map(item => {
                    const Icon = item.icon;
                    const isActive = role === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setRole(item.id);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition ${
                          isActive 
                            ? 'bg-orange-50 border border-orange-200 text-orange-950 font-bold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold">{item.label}</p>
                          <p className="text-[10px] text-slate-600 font-normal">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Notifications
                  </h4>
                  <span className="text-[10px] text-slate-600 font-medium">Real-time updates</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                        notif.read ? 'bg-slate-50 text-slate-600' : 'bg-orange-50/80 border border-orange-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <p className="font-bold text-[11px]">{notif.title}</p>
                        <span className="text-[9px] text-slate-600 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Specific Controls */}
          {role === 'customer' && (
            <>
              {/* My Orders Button */}
              <button
                onClick={onOpenOrders}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
              >
                <span>{t.orders}</span>
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-slate-950 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {cartTotalCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">₹{cartSubtotal}</span>
              </button>

              {/* Profile button */}
              <button
                onClick={onOpenProfile}
                className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hidden sm:block"
                title="Account"
              >
                <User className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Input (Visible only on mobile for Customer role) */}
      {role === 'customer' && (
        <div className="px-4 pb-2.5 sm:hidden">
          <SearchAutocomplete isMobile={true} />
        </div>
      )}
    </header>
  );
};

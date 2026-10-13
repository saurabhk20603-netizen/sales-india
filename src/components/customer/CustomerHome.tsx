import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { CATEGORIES, HERO_BANNERS } from '../../data/mockData';
import { ProductCard } from './ProductCard';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  ArrowRight, 
  Zap, 
  Filter, 
  SlidersHorizontal, 
  Store, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CustomerHomeProps {
  onOpenProductDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ 
  onOpenProductDetails, 
  onBuyNow 
}) => {
  const { 
    products, 
    searchQuery, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter, 
    language, 
    t,
    setRole
  } = useApp();

  // Hero Banner slider
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Sorting & Filter state
  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh' | 'rating' | 'discount'>('featured');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [vocalLocalOnly, setVocalLocalOnly] = useState(false);
  const [localShopsOnly, setLocalShopsOnly] = useState(false);

  // Flash Deals Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Banner auto scroll
  useEffect(() => {
    const autoScroll = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(autoScroll);
  }, []);

  // Filtered & Sorted products
  const filteredProducts = products.filter(prod => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchSeller = prod.sellerName.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchSeller && !matchCategory) return false;
    }

    // Category filter
    if (selectedCategoryFilter && prod.category !== selectedCategoryFilter) {
      return false;
    }

    // Fast express filter
    if (fastDeliveryOnly && (!prod.fastDeliveryHours || prod.fastDeliveryHours > 4)) {
      return false;
    }

    // Vocal for local filter
    if (vocalLocalOnly && !prod.isLocalVocal) {
      return false;
    }

    // Local neighborhood shops filter
    if (localShopsOnly && !prod.isLocalShopProduct) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0; // featured default
  });

  // Flash deals subset
  const flashDealProducts = products.filter(p => p.discountPercent >= 50);

  // Vocal for local subset
  const vocalLocalProducts = products.filter(p => p.isLocalVocal);

  // Local neighborhood shops subset
  const localShopProducts = products.filter(p => p.isLocalShopProduct);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO CAROUSEL */}
      {!searchQuery && !selectedCategoryFilter && (
        <div className="relative max-w-7xl mx-auto px-4 pt-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[220px] sm:min-h-[300px] md:min-h-[360px] flex items-center">
            {HERO_BANNERS.map((banner, idx) => {
              const isActive = idx === currentBannerIdx;
              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 bg-cover bg-center flex items-center ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.2) 100%), url(${banner.image})`
                  }}
                >
                  <div className="p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-2 sm:space-y-3">
                    <span className="inline-block bg-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {language === 'hi' ? banner.badgeHi : banner.badge}
                    </span>

                    <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                      {language === 'hi' ? banner.titleHi : banner.title}
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium">
                      {language === 'hi' ? banner.taglineHi : banner.tagline}
                    </p>

                    <div className="pt-2 sm:pt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (banner.id === 'banner-3') {
                            setRole('rider');
                          } else if (banner.id === 'banner-2') {
                            setVocalLocalOnly(true);
                          } else {
                            // scroll to deals
                            const el = document.getElementById('deals-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95 transition cursor-pointer"
                      >
                        <span>{language === 'hi' ? banner.buttonTextHi : banner.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-xs text-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Sales India Assured Guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Carousel navigation controls */}
            <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
              <button
                onClick={() => setCurrentBannerIdx((currentBannerIdx - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5 px-2">
                {HERO_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBannerIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentBannerIdx === i ? 'w-6 bg-orange-500' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentBannerIdx((currentBannerIdx + 1) % HERO_BANNERS.length)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATEGORY PILLS / GRID */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>{t.categories}</span>
            <span className="text-xs font-normal text-slate-600 hidden sm:inline">
              (Handpicked from verified Indian wholesale markets)
            </span>
          </h2>
          {selectedCategoryFilter && (
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Clear Filter ({selectedCategoryFilter})
            </button>
          )}
        </div>

        {/* Scrollable Category Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.id)}
                className={`flex flex-col items-center p-2.5 rounded-2xl transition border cursor-pointer group text-center ${
                  isSelected 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' 
                    : 'bg-white hover:bg-orange-50/50 text-slate-800 border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden mb-1.5 relative shrink-0 shadow-xs">
                  <img
                    src={cat.image}
                    alt={cat.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className={`text-[11px] font-bold truncate max-w-full leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {language === 'hi' ? cat.nameHi : cat.nameEn}
                </span>
                <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-orange-100' : 'text-slate-600'}`}>
                  {cat.itemCount}+ items
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FLASH DEALS WITH COUNTDOWN */}
      {!searchQuery && !selectedCategoryFilter && (
        <div id="deals-section" className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl">
            {/* Header with ticking timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
                  <Flame className="w-5 h-5 fill-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl tracking-tight">{t.flashDeals}</h3>
                  <p className="text-xs text-orange-100">Massive 50%+ discounts from manufacturers</p>
                </div>
              </div>

              {/* Ticking countdown clock */}
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 self-start sm:self-auto text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.endsIn}:</span>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black text-rose-600">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Flash products horizontal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-900">
              {flashDealProducts.slice(0, 4).map(prod => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onOpenDetails={onOpenProductDetails} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. VOCAL FOR LOCAL INDIAN SELLERS STRIP */}
      {!searchQuery && !selectedCategoryFilter && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇮🇳</span>
                    <h3 className="font-extrabold text-lg text-white">
                      {t.vocalForLocal}
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {t.vocalSubtitle}
                  </p>
                </div>
                <button
                  onClick={() => setVocalLocalOnly(!vocalLocalOnly)}
                  className="self-start sm:self-auto text-xs font-bold bg-emerald-700/80 hover:bg-emerald-700 px-4 py-2 rounded-xl border border-emerald-500/40 transition"
                >
                  {vocalLocalOnly ? 'Show All Products' : 'Filter Vocal Local Only'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-900">
                {vocalLocalProducts.slice(0, 4).map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    onOpenDetails={onOpenProductDetails} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4B. LOCAL NEIGHBORHOOD SHOPS & RIDER PHOTO PROOF STRIP */}
      {!searchQuery && !selectedCategoryFilter && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <h3 className="font-extrabold text-lg text-white">
                      Local Neighborhood Shops (स्थानीय दुकानें - 30 Min Delivery)
                    </h3>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Order fresh milk, dairy, atta, groceries & electronics from shops near you. Rider snaps & shares live parcel photo at the counter!
                  </p>
                </div>
                <button
                  onClick={() => setLocalShopsOnly(!localShopsOnly)}
                  className="self-start sm:self-auto text-xs font-bold bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl border border-indigo-400/40 transition flex items-center gap-1.5"
                >
                  <span>{localShopsOnly ? 'Show All Products' : 'Filter Local Shops Only'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-900">
                {localShopProducts.slice(0, 4).map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    onOpenDetails={onOpenProductDetails} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN CATALOG WITH FILTERS & SORT */}
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Controls Toolbar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {selectedCategoryFilter 
                ? `Products in ${CATEGORIES.find(c => c.id === selectedCategoryFilter)?.nameEn}` 
                : 'All Marketplace Products'}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {sortedProducts.length} items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Local neighborhood shops toggle */}
            <button
              onClick={() => setLocalShopsOnly(!localShopsOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                localShopsOnly 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>🏪 Local Shops (1-2 km) • 📸 Photo Proof</span>
            </button>

            {/* Fast 2-hr delivery toggle */}
            <button
              onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                fastDeliveryOnly 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Express 2-Hr Delivery</span>
            </button>

            {/* Vocal local toggle */}
            <button
              onClick={() => setVocalLocalOnly(!vocalLocalOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                vocalLocalOnly 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>🇮🇳 Vocal for Local</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured Deals</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base font-bold text-slate-800">No matching products found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search filters or browse other categories.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setFastDeliveryOnly(false);
                setVocalLocalOnly(false);
              }}
              className="mt-4 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {sortedProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

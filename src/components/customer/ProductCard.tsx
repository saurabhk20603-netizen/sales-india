import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Heart, Zap, Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    wishlist, 
    toggleWishlist, 
    language,
    t 
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find(item => item.product.id === product.id);
  const isItemInCart = Boolean(cartItem);

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative"
      onClick={() => onOpenDetails(product)}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs tracking-tight">
            {product.discountPercent}% {t.off}
          </span>
        )}
        {product.isLocalShopProduct ? (
          <span className="bg-indigo-600/95 backdrop-blur-xs text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <span>🏪</span> {product.shopDistanceKm ? `${product.shopDistanceKm} km` : 'Local Shop'} • 📸 Photo Proof
          </span>
        ) : product.isLocalVocal ? (
          <span className="bg-orange-500/90 backdrop-blur-xs text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <span>🇮🇳</span> Vocal Local
          </span>
        ) : null}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
          isWishlisted 
            ? 'bg-rose-50 text-rose-600 border border-rose-200' 
            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
        }`}
        title="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center p-3">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.fastDeliveryHours && product.fastDeliveryHours <= 4 && (
          <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-300" />
            <span>{product.fastDeliveryHours}-Hr Express</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Brand & Assured tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold text-slate-700 uppercase tracking-wide truncate max-w-[120px]">
              {product.brand}
            </span>
            {product.isAssured && (
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                ✓ Assured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-2 group-hover:text-orange-600 transition">
            {language === 'hi' && product.titleHi ? product.titleHi : product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.2 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span className="text-[11px] text-slate-600">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-600 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-600">
              {product.sellerCity ? `Dispatched from ${product.sellerCity}` : 'Verified Seller'}
            </p>
          </div>

          {/* Add to Cart button or Quick Quantity controls */}
          <div onClick={(e) => e.stopPropagation()}>
            {isItemInCart ? (
              <div className="flex items-center bg-orange-50 border border-orange-300 rounded-lg p-0.5 text-orange-700">
                <button
                  onClick={() => updateCartQuantity(product.id, (cartItem?.quantity || 1) - 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-orange-200 rounded transition"
                  title="Reduce quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold">
                  {cartItem?.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-orange-200 rounded transition"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addToCart}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

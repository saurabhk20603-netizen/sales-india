import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Store, 
  CheckCircle2, 
  Zap, 
  ShoppingBag,
  Sparkles,
  MapPin,
  Camera
} from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onBuyNow }) => {
  const { 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    language, 
    t,
    selectedAddress
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincodeInput, setPincodeInput] = useState(selectedAddress.pincode);
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.includes(product.id);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      setPincodeChecked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images & Gallery */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-2xl bg-white p-4 flex items-center justify-center relative shadow-xs overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {product.isLocalVocal && (
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span>🇮🇳</span> Vocal For Local Indian Seller
                </span>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl p-1 bg-white border-2 overflow-hidden transition ${
                      activeImageIndex === idx ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-600 font-medium">
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-orange-600 mb-1" />
              <span>{product.fastDeliveryHours ? `${product.fastDeliveryHours}-Hr Express` : 'Fast Delivery'}</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
              <span>7-Day Easy Return</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
              <span>100% Genuine</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase */}
        <div className="md:w-1/2 p-6 overflow-y-auto max-h-[85vh] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span className="uppercase tracking-wider text-orange-600">{product.brand}</span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="text-xs">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {language === 'hi' && product.titleHi ? product.titleHi : product.title}
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  <span>{product.rating.toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span className="text-xs text-slate-500">
                  {product.reviewCount.toLocaleString('en-IN')} ratings & verified reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-600 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-extrabold text-emerald-600">
                  {product.discountPercent}% {t.off}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Inclusive of all taxes (GST). Free delivery for orders above ₹499.
              </p>
            </div>

            {/* Pincode & Delivery Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.checkDelivery}</span>
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 110001"
                  className="w-36 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-slate-800 transition"
                >
                  {t.check}
                </button>
              </form>
              {pincodeChecked && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Delivery available to {pincodeInput}! Expected delivery:{' '}
                    <strong>{product.fastDeliveryHours ? `Within ${product.fastDeliveryHours} Hours` : 'By Tomorrow'}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Seller Information */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-600" />
                  <div>
                    <span className="text-[11px] text-slate-600">{t.soldBy}:</span>
                    <p className="font-bold text-slate-800">{product.sellerName}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  product.isLocalShopProduct 
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {product.isLocalShopProduct ? '🏪 Neighborhood Shop' : 'GST Verified'}
                </span>
              </div>

              {product.isLocalShopProduct && (
                <div className="p-2 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-950">
                    <span>📍 {product.shopAddress || 'Local Market'}</span>
                    <span className="text-indigo-700">{product.shopDistanceKm || 1.2} km away</span>
                  </div>
                  <p className="text-[10px] text-indigo-800 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span><strong>Live Photo Promise:</strong> Rider snaps & shares parcel photo with your ID at pickup</span>
                  </p>
                </div>
              )}

              <p className="text-[11px] text-slate-500 pl-6">
                Direct dispatch from {product.sellerCity} hub.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">About this product</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' && product.descriptionHi ? product.descriptionHi : product.description}
              </p>
            </div>

            {/* Specifications Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">{t.specifications}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="py-0.5">
                      <span className="text-slate-500 text-[11px] block">{key}:</span>
                      <span className="font-semibold text-slate-800 text-[11px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Sample */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Customer Feedback</span>
                  <span className="text-[10px] text-orange-600 font-semibold cursor-pointer">View all ({product.reviewCount})</span>
                </h4>
                <div className="space-y-1.5">
                  {product.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-50 p-2 rounded-xl text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px]">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                addToCart(product, quantity);
                onClose();
              }}
              className="w-full bg-white hover:bg-orange-50 border-2 border-orange-500 text-orange-600 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.addToCart}</span>
            </button>

            <button
              onClick={() => {
                onBuyNow(product);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{t.buyNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

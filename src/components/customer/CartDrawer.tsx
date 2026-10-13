import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_COUPONS } from '../../data/mockData';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartTotalCount,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    t 
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 40;
  const platformFee = cartSubtotal > 0 ? 5 : 0;

  let discount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    } else {
      discount = Math.min((cartSubtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 9999);
    }
  }

  const discountedSubtotal = Math.max(0, cartSubtotal - discount);
  const gstAmount = cartSubtotal > 0 ? Math.round(discountedSubtotal * 0.18) : 0;
  const grandTotal = discountedSubtotal + deliveryFee + platformFee + gstAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              {t.shoppingCart} ({cartTotalCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">{t.emptyCartTitle}</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
              {t.emptyCartSub}
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-md"
            >
              {t.startShopping}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Free Delivery Bar Progress */}
            <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl text-xs">
              {cartSubtotal >= 499 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Yay! You unlocked FREE Express Delivery! 🚀</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium text-[11px]">
                    <span>Add ₹{(499 - cartSubtotal).toLocaleString('en-IN')} more for <strong>FREE Delivery</strong></span>
                    <span>₹{cartSubtotal}/₹499</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map(item => (
                <div 
                  key={item.product.id + (item.selectedVariant?.id || '')} 
                  className="flex gap-3 p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h5 className="font-semibold text-xs text-slate-800 line-clamp-1">
                        {item.product.title}
                      </h5>
                      <p className="text-[10px] text-slate-600 truncate mt-0.5">
                        Sold by: {item.product.sellerName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-xs text-slate-900">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200 rounded-l transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200 rounded-r transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-slate-600 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>{t.applyCoupon}</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span> applied!
                      <p className="text-[10px] text-emerald-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. BHAARAT100"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl uppercase font-semibold focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {t.apply}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}

              {/* Quick Coupon Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {AVAILABLE_COUPONS.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => applyCouponCode(c.code)}
                    className="text-[10px] font-bold bg-white hover:bg-orange-50 border border-dashed border-orange-300 text-orange-700 px-2 py-0.5 rounded-md transition"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-800">{t.priceDetails}</h5>

              <div className="flex justify-between text-slate-600">
                <span>{t.itemTotal}</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t.couponDiscount}</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>{t.deliveryFee}</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                  {deliveryFee === 0 ? t.free : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t.platformFee}</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t.taxes}</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>{t.totalPayable}</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Bar */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{t.totalPayable}</p>
                <p className="text-xl font-black text-slate-900">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                100% Buyer Protection
              </span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition cursor-pointer"
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

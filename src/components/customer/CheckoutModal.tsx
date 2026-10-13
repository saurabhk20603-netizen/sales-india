import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Address, Order } from '../../types';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Lock,
  ArrowRight,
  QrCode,
  Zap,
  Check
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onOrderCompleted 
}) => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    addresses, 
    selectedAddress, 
    setSelectedAddress, 
    addAddress, 
    placeOrder,
    t 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'qr'>('gpay');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    flat: '',
    street: '',
    landmark: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    type: 'Home' as const
  });

  if (!isOpen) return null;

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
  const grandTotal = discountedSubtotal + deliveryFee + platformFee + gstAmount;

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.flat || !newAddr.pincode) return;
    addAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    // Simulate secure Razorpay / Indian Banking payment processing
    setTimeout(async () => {
      const order = await placeOrder(paymentMethod);
      setIsProcessing(false);
      onOrderCompleted(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Sales India Express Checkout</span>
            </h3>
            <p className="text-xs text-slate-500">
              100% Secure Transaction | End-to-End Encrypted
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center">
                  1
                </span>
                <span>{t.selectDeliveryAddress}</span>
              </h4>
              {!isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addNewAddress}</span>
                </button>
              )}
            </div>

            {isAddingNewAddress ? (
              <form onSubmit={handleCreateAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <p className="font-bold text-slate-800">Add New Indian Delivery Address</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Ramesh Sharma)"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile (+91)"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Flat / House / Building"
                    value={newAddr.flat}
                    onChange={(e) => setNewAddr({ ...newAddr, flat: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none sm:col-span-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street, Area, Colony"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={newAddr.landmark}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit Pincode"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="p-2 bg-white border border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer relative ${
                      selectedAddress.id === addr.id 
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        {addr.type}
                      </span>
                      {selectedAddress.id === addr.id && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{addr.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {addr.flat}, {addr.street}, {addr.city} - {addr.pincode}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: Payment Method */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <span>{t.paymentMethod}</span>
            </h4>

            <div className="space-y-2.5">
              {/* Option 1: UPI */}
              <div 
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'upi' 
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">Fastest</span>
                      </p>
                      <p className="text-[11px] text-slate-500">Instant authorization with UPI PIN</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-orange-600 w-4 h-4"
                  />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-orange-200/60 pl-12 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-700">Select your preferred UPI method:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('gpay')}
                        className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                          selectedUpiApp === 'gpay' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <span>Google Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('phonepe')}
                        className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                          selectedUpiApp === 'phonepe' ? 'bg-purple-700 text-white font-bold border-purple-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <span>PhonePe</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('paytm')}
                        className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                          selectedUpiApp === 'paytm' ? 'bg-blue-600 text-white font-bold border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <span>Paytm UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('qr')}
                        className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                          selectedUpiApp === 'qr' ? 'bg-emerald-700 text-white font-bold border-emerald-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan QR Code</span>
                      </button>
                    </div>

                    {selectedUpiApp === 'qr' && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                        <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                          <QrCode className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <p className="font-bold text-slate-800">Scan via any UPI App</p>
                          <p>Open BHIM / PhonePe / GPay on your smartphone to scan and pay ₹{grandTotal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Cards */}
              <div 
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'card' 
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Credit / Debit Card (RuPay, Visa, Mastercard)
                      </p>
                      <p className="text-[11px] text-slate-500">Supports all major Indian banks & RuPay debit</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-orange-600 w-4 h-4"
                  />
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-3 pt-3 border-t border-orange-200/60 pl-12 space-y-2 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number (Sandbox Test Mode: 4111 2222 3333 4444)"
                        defaultValue="4111 2222 3333 4444"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          defaultValue="12/28"
                          className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="CVV"
                          defaultValue="123"
                          className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div 
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'netbanking' 
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Net Banking</p>
                      <p className="text-[11px] text-slate-500">SBI, HDFC, ICICI, Axis, PNB & 50+ banks</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="accent-orange-600 w-4 h-4"
                  />
                </div>
              </div>

              {/* Option 4: Cash on Delivery (COD) */}
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'cod' 
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.codPayment}</p>
                      <p className="text-[11px] text-slate-500">Pay via cash or UPI to rider at your doorstep</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-orange-600 w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Order Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h5 className="font-bold text-slate-800">Order Summary ({cart.length} Products)</h5>
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Handling</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes (GST 18%)</span>
              <span>₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-950">
              <span>Total Payable</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Payable Amount</p>
            <p className="text-xl font-black text-slate-900">
              ₹{grandTotal.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <span>{t.placeOrder}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

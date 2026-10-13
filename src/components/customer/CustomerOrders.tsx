import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Package, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  RotateCcw, 
  FileText, 
  Download,
  KeyRound,
  ShieldCheck,
  Camera
} from 'lucide-react';

interface CustomerOrdersProps {
  onTrackOrder: (order: Order) => void;
  onBackToShopping: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ 
  onTrackOrder, 
  onBackToShopping 
}) => {
  const { orders, cancelOrder, requestReturn, t } = useApp();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedProofPhoto, setSelectedProofPhoto] = useState<{ url: string; orderId: string; store: string } | null>(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Found cheaper price elsewhere');
  const [returnModalOrderId, setReturnModalOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Item size/fit not appropriate');

  const handleConfirmCancel = () => {
    if (cancelModalOrderId) {
      cancelOrder(cancelModalOrderId, cancelReason);
      setCancelModalOrderId(null);
    }
  };

  const handleConfirmReturn = () => {
    if (returnModalOrderId) {
      requestReturn(returnModalOrderId, returnReason);
      setReturnModalOrderId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-600" />
            <span>{t.orders}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track deliveries, view tax invoices, or request easy returns
          </p>
        </div>
        <button
          onClick={onBackToShopping}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t.noOrdersYet}</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You have not placed any orders yet. Explore our great marketplace!
          </p>
          <button
            onClick={onBackToShopping}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isDelivered = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';
            const isReturned = order.status === 'returned';

            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">
                      Order #{order.id}
                    </span>
                    <span className="text-slate-500 font-medium">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      isDelivered 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isCancelled 
                        ? 'bg-rose-100 text-rose-800'
                        : isReturned
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-orange-100 text-orange-800 animate-pulse'
                    }`}>
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {!isDelivered && !isCancelled && !isReturned && <Clock className="w-3.5 h-3.5" />}
                      <span className="capitalize">{t.stages[order.status] || order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="p-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Sold by: {item.sellerName} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions & Delivery Summary */}
                <div className="bg-slate-50/70 p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-black text-sm text-slate-950">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">
                      via {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Track Button for in-transit orders */}
                    {!isDelivered && !isCancelled && !isReturned && (
                      <button
                        onClick={() => onTrackOrder(order)}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Track Live Delivery</span>
                      </button>
                    )}

                    {/* Store Pickup Photo Proof Button */}
                    {order.deliveryDetails.pickupPhotoUrl && (
                      <button
                        onClick={() => setSelectedProofPhoto({
                          url: order.deliveryDetails.pickupPhotoUrl!,
                          orderId: order.id,
                          store: order.deliveryDetails.pickupStoreName || order.items[0]?.sellerName
                        })}
                        className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Shop Photo Proof</span>
                      </button>
                    )}

                    {/* Doorstep Delivery Confirmation Photo Proof Button */}
                    {order.deliveryDetails.deliveryConfirmationPhotoUrl && (
                      <button
                        onClick={() => setSelectedProofPhoto({
                          url: order.deliveryDetails.deliveryConfirmationPhotoUrl!,
                          orderId: order.id,
                          store: `Doorstep Handover by ${order.deliveryDetails.riderName || 'Rider'}`
                        })}
                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Doorstep Photo Proof</span>
                      </button>
                    )}

                    {/* View Invoice */}
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tax Invoice</span>
                    </button>

                    {/* Cancel Order (if not delivered) */}
                    {!isDelivered && !isCancelled && !isReturned && (
                      <button
                        onClick={() => setCancelModalOrderId(order.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Return Request (if delivered) */}
                    {isDelivered && (
                      <button
                        onClick={() => setReturnModalOrderId(order.id)}
                        className="text-xs font-bold text-slate-700 hover:text-orange-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Return / Exchange</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Cancel Order #{cancelModalOrderId}</h3>
            <p className="text-xs text-slate-600">
              Please choose a reason for cancellation. Any online payment will be refunded to your original payment method.
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            >
              <option value="Found cheaper price elsewhere">Found cheaper price elsewhere</option>
              <option value="Order placed by mistake">Order placed by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Want to change delivery address">Want to change delivery address</option>
            </select>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
              >
                Nevermind
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnModalOrderId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Return Order #{returnModalOrderId}</h3>
            <p className="text-xs text-slate-600">
              Sales India provides 7-day hassle-free doorstep return pickup by our delivery partners.
            </p>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            >
              <option value="Item size/fit not appropriate">Item size/fit not appropriate</option>
              <option value="Received damaged or defective product">Received damaged or defective product</option>
              <option value="Item not matching pictures/description">Item not matching pictures/description</option>
              <option value="Quality not as expected">Quality not as expected</option>
            </select>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setReturnModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">TAX INVOICE</h3>
                <p className="text-xs text-slate-500 font-mono">Invoice #{selectedInvoiceOrder.id}</p>
                <p className="text-[11px] text-slate-500">Sales India Marketplace Pvt Ltd | GSTIN: 07AABCS1234F1ZP</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <p className="font-bold text-slate-700">Billed & Delivered To:</p>
                <p className="font-semibold text-slate-900">{selectedInvoiceOrder.deliveryAddress.name}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.deliveryAddress.flat}, {selectedInvoiceOrder.deliveryAddress.street}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.deliveryAddress.city} - {selectedInvoiceOrder.deliveryAddress.pincode}</p>
              </div>
              <div>
                <p className="font-bold text-slate-700">Order Details:</p>
                <p className="text-slate-600">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN')}</p>
                <p className="text-slate-600">Payment: {selectedInvoiceOrder.paymentMethod.toUpperCase()} ({selectedInvoiceOrder.paymentStatus.toUpperCase()})</p>
                <p className="text-slate-600">Delivery Partner: {selectedInvoiceOrder.deliveryDetails.riderName}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoiceOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{it.title}</td>
                    <td className="py-2">{it.quantity}</td>
                    <td className="py-2">₹{it.price}</td>
                    <td className="py-2 text-right">₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs text-right">
              <p>Item Subtotal: ₹{selectedInvoiceOrder.subtotal}</p>
              <p>Delivery Fee: ₹{selectedInvoiceOrder.deliveryFee}</p>
              <p>GST (18% Integrated GST): ₹{selectedInvoiceOrder.gstAmount}</p>
              <p className="font-black text-sm text-slate-900 pt-1">Grand Total: ₹{selectedInvoiceOrder.total}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Shop Pickup Photo Modal */}
      {selectedProofPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedProofPhoto(null)}
        >
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-5 space-y-3 shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" />
                <h4 className="font-bold text-sm">Store Parcel Photo: Order #{selectedProofPhoto.orderId}</h4>
              </div>
              <button
                onClick={() => setSelectedProofPhoto(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img 
              src={selectedProofPhoto.url} 
              alt="Parcel Verification" 
              className="w-full rounded-2xl object-cover max-h-[70vh]" 
            />
            <div className="text-xs text-slate-400 space-y-0.5">
              <p>📍 Sourced From: <strong className="text-white">{selectedProofPhoto.store}</strong></p>
              <p className="text-[11px] text-emerald-400 font-medium">
                ✓ Photo verified at shop counter by Sales India Rider before dispatch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

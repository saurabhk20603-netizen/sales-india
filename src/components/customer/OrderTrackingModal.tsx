import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Bike, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  Store, 
  Navigation,
  FileText,
  Camera,
  Check,
  Eye,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenInvoice?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ 
  order, 
  onClose,
  onOpenInvoice 
}) => {
  const { updateOrderStatus, verifyOrderOtpAndDeliver, customerVerifyPickupPhoto, t } = useApp();
  const [simulatedProgress, setSimulatedProgress] = useState(order?.deliveryDetails.progressPercent || 70);
  const [isCallingRider, setIsCallingRider] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  useEffect(() => {
    if (order) {
      setSimulatedProgress(order.deliveryDetails.progressPercent);
    }
  }, [order]);

  // Simulate vehicle position animation
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  // Rider position on SVG path
  const riderPercent = Math.min(100, Math.max(10, simulatedProgress));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                LIVE DISPATCH
              </span>
              <span className="text-xs text-slate-400 font-mono">#{order.id}</span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5 flex items-center gap-2">
              <span>{isDelivered ? 'Order Delivered Successfully 🎉' : 'Tracking Your Delivery Partner'}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Live Map Simulation */}
          <div className="relative w-full h-56 sm:h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 shadow-inner flex flex-col justify-between">
            {/* Map Roads & Polyline Canvas/SVG Background */}
            <div className="absolute inset-0 opacity-40">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                  </pattern>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated Street Curves */}
                <path d="M 20 80 Q 150 40 300 120 T 600 90" fill="none" stroke="#1e293b" strokeWidth="12" />
                <path d="M 50 160 Q 200 180 350 80 T 700 150" fill="none" stroke="#1e293b" strokeWidth="8" />
                
                {/* Active Delivery Route Polyline */}
                <path 
                  id="activeRoute"
                  d="M 60 170 C 180 180, 260 80, 420 120 S 580 90, 680 70" 
                  fill="none" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="5" 
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Map Status Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 flex items-center gap-2 text-xs text-white">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold">
                  {isDelivered 
                    ? 'Delivered at Doorstep' 
                    : `Arriving in ~${order.deliveryDetails.estimatedMinutes} Mins`}
                </span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-[11px] text-amber-300 font-bold flex items-center gap-1">
                <Navigation className="w-3 h-3 text-amber-400" />
                <span>Live GPS Feed</span>
              </div>
            </div>

            {/* Interactive Route Markers (Store -> Rider -> Customer) */}
            <div className="relative z-10 flex items-center justify-between px-6 py-2">
              {/* Store Marker */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-2 py-0.5 rounded">
                  Seller Store
                </span>
              </div>

              {/* Animated Rider Marker */}
              <div 
                className="flex flex-col items-center transition-all duration-1000"
                style={{ transform: `translateX(${(riderPercent - 50) * 1.5}px)` }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/50 ring-4 ring-orange-500/30 animate-bounce">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <span className="text-[10px] text-orange-400 font-black mt-1 bg-slate-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                  {order.deliveryDetails.riderName?.split(' ')[0] || 'Rider'}
                </span>
              </div>

              {/* Customer Marker */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-2 py-0.5 rounded">
                  Your Address
                </span>
              </div>
            </div>

            {/* Bottom road name info */}
            <div className="relative z-10 flex justify-between items-center text-[11px] text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="truncate">Near {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
              <span className="font-bold text-white shrink-0">Traffic: Smooth</span>
            </div>
          </div>

          {/* Secret Delivery OTP Card */}
          {!isDelivered && !isCancelled && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-dashed border-orange-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-950">
                      {t.otpForDelivery}
                    </span>
                    <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      Required for Handover
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t.giveOtpToRider}
                  </p>
                </div>
              </div>

              {/* The OTP Code */}
              <div className="bg-white px-5 py-2 rounded-2xl border-2 border-orange-500 shadow-md text-center">
                <span className="text-2xl font-black text-orange-600 tracking-widest font-mono">
                  {order.deliveryDetails.deliveryOtp}
                </span>
              </div>
            </div>
          )}

          {/* LOCAL SHOP PARCEL LIVE PHOTO PROOF (दुकान से ली गई लाइव फोटो) */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 border-2 border-indigo-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Live Local Shop Parcel Photo Proof</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      दुकान सत्यापन
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Rider takes photo of parcel & bill at local shop counter so you know the item is genuine & correct
                  </p>
                </div>
              </div>

              {order.deliveryDetails.pickupPhotoUrl && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Received on Customer ID #{order.id}</span>
                </span>
              )}
            </div>

            {order.deliveryDetails.pickupPhotoUrl ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {/* Photo Thumbnail */}
                <div 
                  className="relative group cursor-pointer w-full sm:w-44 h-36 rounded-xl overflow-hidden border-2 border-indigo-400 bg-black shrink-0 shadow-sm"
                  onClick={() => setZoomedPhoto({
                    url: order.deliveryDetails.pickupPhotoUrl!,
                    title: `📸 Local Store Parcel Photo Proof (Order #${order.id})`,
                    subtitle: `Store: ${order.deliveryDetails.pickupStoreName || order.items[0]?.sellerName} • Rider: ${order.deliveryDetails.riderName}`
                  })}
                >
                  <img
                    src={order.deliveryDetails.pickupPhotoUrl}
                    alt="Store Parcel Proof"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      <Eye className="w-3 h-3" />
                      <span>Tap to Zoom</span>
                    </span>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {order.deliveryDetails.pickupPhotoTimestamp || 'At Shop Counter'}
                  </span>
                </div>

                {/* Details & Customer Approval */}
                <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-xs">
                      📍 Picked Up From: <span className="text-indigo-700">{order.deliveryDetails.pickupStoreName || order.items[0]?.sellerName}</span>
                    </p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      &ldquo;{order.deliveryDetails.pickupVerificationNotes || 'Rider verified item seal and packaging directly at shop counter.'}&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Rider: <strong>{order.deliveryDetails.riderName}</strong> • Dispatched to your delivery address
                    </p>
                  </div>

                  {/* Customer confirmation */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {order.deliveryDetails.customerVerifiedPhoto ? (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>✓ You verified the item photo! Rider is on the way.</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          customerVerifyPickupPhoto(order.id);
                          confetti({ particleCount: 50, spread: 60 });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Item Looks Right (सामान सही है)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Waiting for Rider at Local Shop Counter</p>
                  <p className="text-[11px] text-slate-500">
                    When the rider arrives at {order.items[0]?.sellerName || 'local shop'}, they will snap and share a live photo of your parcel with your Customer ID #{order.id} before leaving!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DOORSTEP DELIVERY CONFIRMATION (POD) PHOTO (डिलीवरी पुष्टि फोटो) */}
          {(isDelivered || order.deliveryDetails.deliveryConfirmationPhotoUrl) && (
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 border-2 border-emerald-300 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span>Doorstep Delivery Confirmation Image</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        सुपुर्दगी प्रमाण (POD)
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Photo snapped by delivery partner with device camera after successful delivery at your doorstep
                    </p>
                  </div>
                </div>

                {order.deliveryDetails.deliveryConfirmationPhotoUrl && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Handover</span>
                  </span>
                )}
              </div>

              {order.deliveryDetails.deliveryConfirmationPhotoUrl ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  {/* Photo Thumbnail */}
                  <div 
                    className="relative group cursor-pointer w-full sm:w-44 h-36 rounded-xl overflow-hidden border-2 border-emerald-500 bg-black shrink-0 shadow-sm"
                    onClick={() => setZoomedPhoto({
                      url: order.deliveryDetails.deliveryConfirmationPhotoUrl!,
                      title: `📸 Doorstep Delivery Confirmation Proof (Order #${order.id})`,
                      subtitle: `Snapped by Rider ${order.deliveryDetails.riderName} • ${order.deliveryDetails.deliveryConfirmationTimestamp || 'Upon Handover'}`
                    })}
                  >
                    <img
                      src={order.deliveryDetails.deliveryConfirmationPhotoUrl}
                      alt="Doorstep Delivery Confirmation"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <Eye className="w-3 h-3" />
                        <span>Tap to Zoom</span>
                      </span>
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                      {order.deliveryDetails.deliveryConfirmationTimestamp || 'Doorstep Proof'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 text-xs">
                        🏠 Handed Over At: <span className="text-emerald-800 font-semibold">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                      </p>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                        &ldquo;{order.deliveryDetails.deliveryProofNotes || 'Rider snapped doorstep delivery confirmation photo with device camera upon successful handover.'}&rdquo;
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Delivery Partner: <strong className="text-slate-700">{order.deliveryDetails.riderName}</strong> ({order.deliveryDetails.riderVehicle})
                      </p>
                    </div>

                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>OTP Verified & Tamper-Free Delivery</span>
                      </span>
                      <button
                        onClick={() => setZoomedPhoto({
                          url: order.deliveryDetails.deliveryConfirmationPhotoUrl!,
                          title: `📸 Doorstep Delivery Confirmation Proof (Order #${order.id})`,
                          subtitle: `Snapped by Rider ${order.deliveryDetails.riderName} • ${order.deliveryDetails.deliveryConfirmationTimestamp || 'Upon Handover'}`
                        })}
                        className="text-emerald-700 hover:text-emerald-800 font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Full Screen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-slate-600 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Delivered Successfully! Awaiting Camera Photo Upload</p>
                    <p className="text-[11px] text-slate-500">
                      Rider is currently snapping the doorstep confirmation photo using their mobile camera. It will appear here shortly!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delivery Partner Details */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Rider"
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {order.deliveryDetails.riderName}
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    ★ {order.deliveryDetails.riderRating}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Vehicle: <strong>{order.deliveryDetails.riderVehicle}</strong>
                </p>
                <p className="text-[11px] text-slate-600">
                  Verified Sales India Delivery Partner (Rapido / Flexible Fleet)
                </p>
              </div>
            </div>

            {/* Rider Contact Button */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsCallingRider(true);
                  setTimeout(() => setIsCallingRider(false), 3000);
                }}
                className="flex-1 sm:flex-initial bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isCallingRider ? 'Connecting Secure Call...' : t.contactRider}</span>
              </button>
            </div>
          </div>

          {/* Delivery Timeline / Status Stages */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Live Order Milestones
            </h4>
            <div className="space-y-3 pl-2 border-l-2 border-orange-200 ml-3">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-slate-900 capitalize">
                      {t.stages[step.status] || step.status}
                    </span>
                    <span className="text-[10px] text-slate-600">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Controls for testing */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-amber-900">
              <p className="font-bold">🧪 Interactive Demo Mode</p>
              <p className="text-[11px] text-amber-800">
                You can simulate rider steps or switch to Rider view to enter OTP!
              </p>
            </div>
            <div className="flex gap-2">
              {!isDelivered && (
                <button
                  onClick={() => {
                    verifyOrderOtpAndDeliver(order.id, order.deliveryDetails.deliveryOtp);
                  }}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                >
                  Simulate Handover (Auto-Verify OTP)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Delivery to: <strong>{order.deliveryAddress.name}</strong> ({order.deliveryAddress.pincode})
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>

      {/* CUSTOMER PHOTO ZOOM MODAL */}
      {zoomedPhoto && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedPhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden p-4 shadow-2xl border border-slate-700">
            <button
              onClick={() => setZoomedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={zoomedPhoto.url} 
              alt={zoomedPhoto.title} 
              className="w-full rounded-2xl object-contain max-h-[75vh]" 
            />
            <div className="mt-3 text-center space-y-1">
              <p className="text-sm font-bold text-white">
                {zoomedPhoto.title}
              </p>
              <p className="text-xs text-slate-400">
                {zoomedPhoto.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

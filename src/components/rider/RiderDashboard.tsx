import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Rider, Order } from '../../types';
import { 
  Bike, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Navigation, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Power, 
  Store, 
  UserCheck, 
  PhoneCall, 
  Sparkles, 
  HelpCircle, 
  X, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  Eye, 
  Upload, 
  Video, 
  CheckCircle,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RiderDashboard: React.FC = () => {
  const { 
    activeRider, 
    riders, 
    setActiveRider, 
    toggleRiderOnline, 
    orders, 
    updateOrderStatus, 
    verifyOrderOtpAndDeliver, 
    uploadRiderPickupPhoto,
    uploadDeliveryConfirmationPhoto,
    withdrawRiderEarnings,
    registerRider,
    t 
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);
  const [isCallingStore, setIsCallingStore] = useState(false);

  // Live Shop Parcel Photo capture state (Step 1 Pickup)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [photoForOrderId, setPhotoForOrderId] = useState<string | null>(null);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [photoNotes, setPhotoNotes] = useState('Checked retail bill, expiry date & package seal at shop counter.');
  const [isPhotoSubmitted, setIsPhotoSubmitted] = useState(false);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);

  // Doorstep Delivery Confirmation (POD) Camera state (Post-Delivery)
  const [isDeliveryProofModalOpen, setIsDeliveryProofModalOpen] = useState(false);
  const [deliveryProofOrderId, setDeliveryProofOrderId] = useState<string | null>(null);
  const [deliveryProofPhoto, setDeliveryProofPhoto] = useState<string>('');
  const [deliveryProofNotes, setDeliveryProofNotes] = useState('Handed over package safely at customer doorstep after OTP verification.');
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Incoming Trip Request Simulation state (Rapido/Zomato style)
  const [incomingTrip, setIncomingTrip] = useState<Order | null>(null);
  const [tripTimer, setTripTimer] = useState(45);

  // Onboard new rider form modal
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [newRiderData, setNewRiderData] = useState({
    name: '',
    phone: '',
    vehicleType: 'Motorcycle' as Rider['vehicleType'],
    vehiclePlate: 'DL 04 EF 9182',
    drivingLicense: 'DL-142023009912',
    preferredZone: 'Central & North Delhi',
    workingHoursType: 'Part-Time' as Rider['workingHoursType'],
    upiId: 'rider@okaxis'
  });

  // Find active order assigned to this rider that is in-flight
  const activeDeliveryOrder = orders.find(
    o => (o.deliveryDetails.riderId === activeRider.id || !o.deliveryDetails.riderId) && 
         ['accepted', 'preparing', 'ready_for_pickup', 'rider_assigned', 'picked_up', 'out_for_delivery'].includes(o.status)
  );

  // Completed orders for this rider
  const completedOrders = orders.filter(
    o => (o.deliveryDetails.riderId === activeRider.id) && o.status === 'delivered'
  );

  // Simulation timer for incoming request countdown
  useEffect(() => {
    if (!incomingTrip) return;
    const interval = setInterval(() => {
      setTripTimer(prev => {
        if (prev <= 1) {
          setIncomingTrip(null);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingTrip]);

  const handleSimulateNewRequest = () => {
    // Pick an unassigned order or create one
    const unassigned = orders.find(o => o.status === 'ready_for_pickup' || o.status === 'accepted');
    if (unassigned) {
      setIncomingTrip(unassigned);
      setTripTimer(45);
    } else {
      // Default to first active order
      setIncomingTrip(orders[0] || null);
      setTripTimer(45);
    }
  };

  const handleAcceptIncomingTrip = () => {
    if (incomingTrip) {
      updateOrderStatus(incomingTrip.id, 'rider_assigned');
      setIncomingTrip(null);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsLiveCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser. You can select a preset or upload a photo.');
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Camera access was not granted or is unavailable on this device. You can snap using the preset photos or file upload.');
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  const captureFromVideo = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setDeliveryProofPhoto(dataUrl);
        stopLiveCamera();
      }
    }
  };

  const closeDeliveryProofModal = () => {
    stopLiveCamera();
    setIsDeliveryProofModalOpen(false);
    setDeliveryProofPhoto('');
    setCameraError(null);
  };

  const handleSaveDeliveryProof = () => {
    if (!deliveryProofOrderId) return;
    const photoToSave = deliveryProofPhoto || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
    uploadDeliveryConfirmationPhoto(deliveryProofOrderId, photoToSave, deliveryProofNotes);
    closeDeliveryProofModal();
    confetti({ particleCount: 90, spread: 70 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDeliveryProofPhoto(event.target.result as string);
          stopLiveCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyOtp = (orderId: string) => {
    setOtpError('');
    setOtpSuccess('');
    if (!enteredOtp || enteredOtp.length !== 4) {
      setOtpError('Please enter the 4-digit secret OTP provided by customer');
      return;
    }

    const res = verifyOrderOtpAndDeliver(orderId, enteredOtp);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setOtpSuccess(res.message);
      setEnteredOtp('');
      // Trigger Doorstep Delivery Confirmation Camera!
      setDeliveryProofOrderId(orderId);
      setIsDeliveryProofModalOpen(true);
      // Automatically attempt camera start
      setTimeout(() => {
        startLiveCamera();
      }, 400);
    }
  };

  const handleRegisterNewRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderData.name || !newRiderData.phone) return;

    registerRider({
      ...newRiderData,
      email: `${newRiderData.name.toLowerCase().replace(/\s+/g, '')}@rider.in`,
      city: 'New Delhi'
    });

    setIsOnboardingOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Rider Top Profile & Status Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activeRider.avatar}
              alt={activeRider.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-500/20"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
              activeRider.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
            }`}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{activeRider.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ★ {activeRider.rating} ({activeRider.totalTrips} trips)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Vehicle: <strong>{activeRider.vehicleType}</strong> ({activeRider.vehiclePlate}) • {activeRider.workingHoursType}
            </p>
            <p className="text-[11px] text-emerald-300 font-medium mt-0.5">
              Zone: {activeRider.preferredZone} | DL: {activeRider.drivingLicense}
            </p>
          </div>
        </div>

        {/* Right Switchers & Online Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Switch Active Rider */}
          <select
            value={activeRider.id}
            onChange={(e) => {
              const r = riders.find(item => item.id === e.target.value);
              if (r) setActiveRider(r);
            }}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            {riders.map(r => (
              <option key={r.id} value={r.id}>
                Rider: {r.name} ({r.vehicleType})
              </option>
            ))}
          </select>

          {/* Onboard New Delivery Partner */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 transition"
          >
            + Onboard New Rider
          </button>

          {/* ONLINE / OFFLINE TOGGLE */}
          <button
            onClick={() => toggleRiderOnline(activeRider.id)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition shadow-lg cursor-pointer ${
              activeRider.isOnline 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 ring-2 ring-emerald-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{activeRider.isOnline ? 'ONLINE (Ready)' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* 2. Earnings & Incentive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t.todayEarnings}</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            ₹{activeRider.todayEarnings}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {activeRider.todayTrips} trips completed today
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t.walletBalance}</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{activeRider.walletBalance}
          </p>
          <button
            onClick={() => withdrawRiderEarnings(activeRider.id)}
            disabled={activeRider.walletBalance <= 0}
            className="mt-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 underline disabled:opacity-40"
          >
            Instant UPI Transfer ({activeRider.upiId})
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Trip Rate</p>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">
            ₹65 / Drop
          </p>
          <p className="text-[10px] text-slate-500 mt-1">+ ₹20 Surge on Rainy/Peak hours</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Daily Milestone</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {activeRider.todayTrips}/8 Trips
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Complete 8 trips for ₹150 Bonus</p>
        </div>
      </div>

      {/* 3. SIMULATION TRIGGER: NEW INCOMING ORDER */}
      {!incomingTrip && !activeDeliveryOrder && activeRider.isOnline && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-blue-950">You are Online & Waiting in {activeRider.preferredZone}</p>
              <p className="text-[11px] text-blue-800">Test incoming delivery requests like Rapido/Blinkit</p>
            </div>
          </div>
          <button
            onClick={handleSimulateNewRequest}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            Simulate Incoming Trip Alert 🚨
          </button>
        </div>
      )}

      {/* 4. RAPIDO-STYLE INCOMING TRIP MODAL */}
      {incomingTrip && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-4 border-emerald-500 animate-bounce">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-black text-base text-slate-900">{t.incomingOrder}</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                {tripTimer}s left
              </span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase">Estimated Earning</p>
                <p className="text-2xl font-black text-emerald-700">₹65.00</p>
              </div>
              <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1 rounded-xl shadow-xs">
                3.2 km trip
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2 items-start">
                <Store className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Pickup Store</span>
                  <p className="font-bold text-slate-800">{incomingTrip.items[0]?.sellerName || 'Delhi Electronics Hub'}</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Deliver To Customer</span>
                  <p className="font-bold text-slate-800">{incomingTrip.deliveryAddress.name}</p>
                  <p className="text-[11px] text-slate-500">{incomingTrip.deliveryAddress.street}, {incomingTrip.deliveryAddress.city}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIncomingTrip(null)}
                className="py-3 px-4 rounded-2xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-100"
              >
                {t.rejectTrip}
              </button>
              <button
                onClick={handleAcceptIncomingTrip}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/30"
              >
                {t.acceptTrip} (₹65)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACTIVE DELIVERY TASK IN-FLIGHT */}
      {activeDeliveryOrder && (
        <div className="bg-white rounded-3xl p-6 border-2 border-orange-500 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Active Order In Flight
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Order #{activeDeliveryOrder.id}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Trip Earnings</span>
              <p className="text-xl font-black text-emerald-600">₹65.00</p>
            </div>
          </div>

          {/* Stepper Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step A: Store Pickup details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-blue-600" />
                  <span>Step 1: Local Shop Pickup</span>
                </span>
                <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {activeDeliveryOrder.status === 'ready_for_pickup' ? 'Ready for Pickup' : 'Order Placed'}
                </span>
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {activeDeliveryOrder.items[0]?.sellerName}
              </p>
              <p className="text-slate-500 text-[11px]">
                Items to collect: {activeDeliveryOrder.items.map(it => `${it.title} (Qty: ${it.quantity})`).join(', ')}
              </p>

              {/* PHOTO PROOF CAPTURE AT SHOP COUNTER */}
              <div className="p-3 bg-white rounded-xl border border-dashed border-orange-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    <span>Local Shop Parcel Photo Proof (दुकान से फोटो)</span>
                  </span>
                  {activeDeliveryOrder.deliveryDetails.pickupPhotoUrl && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                      ✓ Shared with Customer
                    </span>
                  )}
                </div>

                {activeDeliveryOrder.deliveryDetails.pickupPhotoUrl ? (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeDeliveryOrder.deliveryDetails.pickupPhotoUrl}
                      alt="Parcel Proof"
                      className="w-14 h-14 rounded-lg object-cover border-2 border-emerald-500 shrink-0 cursor-pointer"
                      onClick={() => setViewingPhotoUrl(activeDeliveryOrder.deliveryDetails.pickupPhotoUrl || null)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">
                        Photo sent to customer ID #{activeDeliveryOrder.id}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {activeDeliveryOrder.deliveryDetails.pickupVerificationNotes || 'Verified at shop counter'}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoForOrderId(activeDeliveryOrder.id);
                            setIsCameraModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline"
                        >
                          Retake Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingPhotoUrl(activeDeliveryOrder.deliveryDetails.pickupPhotoUrl || null)}
                          className="text-[10px] font-bold text-slate-600 hover:underline"
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-600 mb-2">
                      Customer ko pata chale ke local shop se sahi item liya hai, isliye shop counter par parcel ki photo click karke bhejein.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoForOrderId(activeDeliveryOrder.id);
                        setIsCameraModalOpen(true);
                      }}
                      className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-700 font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-orange-600" />
                      <span>Click Parcel Photo & Share with Customer ID</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                {activeDeliveryOrder.status !== 'picked_up' && activeDeliveryOrder.status !== 'out_for_delivery' ? (
                  <button
                    onClick={() => {
                      // If photo not yet taken, automatically take one or update status
                      if (!activeDeliveryOrder.deliveryDetails.pickupPhotoUrl) {
                        uploadRiderPickupPhoto(
                          activeDeliveryOrder.id,
                          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
                          'Parcel & tax bill photo captured by rider at shop counter.'
                        );
                      }
                      updateOrderStatus(activeDeliveryOrder.id, 'picked_up');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Confirm Parcel Picked Up from Store</span>
                  </button>
                ) : (
                  <div className="w-full bg-emerald-50 text-emerald-800 font-bold py-2 px-3 rounded-xl text-center border border-emerald-200">
                    ✓ Parcel In Rider Bag
                  </div>
                )}
              </div>
            </div>

            {/* Step B: Customer Delivery & OTP Verification */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Step 2: Customer Handover</span>
                </span>
                <button
                  onClick={() => {
                    setIsCallingCustomer(true);
                    setTimeout(() => setIsCallingCustomer(false), 2500);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  <span>{isCallingCustomer ? 'Calling...' : 'Call Customer'}</span>
                </button>
              </div>

              <p className="font-bold text-slate-800 text-sm">
                {activeDeliveryOrder.deliveryAddress.name} ({activeDeliveryOrder.deliveryAddress.phone})
              </p>
              <p className="text-slate-500 text-[11px]">
                {activeDeliveryOrder.deliveryAddress.flat}, {activeDeliveryOrder.deliveryAddress.street}, {activeDeliveryOrder.deliveryAddress.city} - {activeDeliveryOrder.deliveryAddress.pincode}
              </p>

              {/* Enter Secret Customer OTP to Complete Handover */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                  <span>Enter 4-Digit Customer OTP:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 6294"
                    className="w-32 p-2 bg-white border border-slate-300 rounded-xl font-mono text-center font-bold tracking-widest text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleVerifyOtp(activeDeliveryOrder.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Complete</span>
                  </button>
                </div>

                {otpError && (
                  <p className="text-[11px] text-rose-600 font-bold">{otpError}</p>
                )}
                {otpSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold">{otpSuccess}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Completed Deliveries History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Recent Completed Deliveries</h3>
        {completedOrders.length === 0 ? (
          <p className="text-xs text-slate-500">No deliveries completed yet today.</p>
        ) : (
          <div className="space-y-3">
            {completedOrders.map(o => (
              <div key={o.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900">Order #{o.id}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Delivered</span>
                    </span>
                    {o.deliveryDetails.deliveryConfirmationPhotoUrl ? (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Camera className="w-3 h-3 text-blue-600" />
                        <span>Doorstep Photo Attached</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Camera className="w-3 h-3 text-amber-600" />
                        <span>Awaiting Doorstep Camera Photo</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Delivered to: <strong>{o.deliveryAddress.name}</strong> • {o.deliveryAddress.street}, {o.deliveryAddress.city}
                  </p>

                  {/* Rider Camera Access Button */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryProofOrderId(o.id);
                        setDeliveryProofPhoto(o.deliveryDetails.deliveryConfirmationPhotoUrl || '');
                        setDeliveryProofNotes(o.deliveryDetails.deliveryProofNotes || 'Handed over package safely at customer doorstep after OTP verification.');
                        setIsDeliveryProofModalOpen(true);
                        setTimeout(() => {
                          startLiveCamera();
                        }, 400);
                      }}
                      className="bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-orange-600" />
                      <span>
                        {o.deliveryDetails.deliveryConfirmationPhotoUrl 
                          ? 'View / Retake Doorstep Camera Photo' 
                          : 'Snap Doorstep Camera Photo (POD)'}
                      </span>
                    </button>

                    {o.deliveryDetails.deliveryConfirmationPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingPhotoUrl(o.deliveryDetails.deliveryConfirmationPhotoUrl || null)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer ml-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Preview Snap</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
                  <span className="font-black text-emerald-700 text-base">+₹65.00</span>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                    <Check className="w-3 h-3" />
                    <span>OTP Handover Done</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ONBOARD NEW RIDER MODAL */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Register as Sales India Rider Partner</h3>
              <button onClick={() => setIsOnboardingOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewRider} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rider Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Rathore"
                  value={newRiderData.name}
                  onChange={(e) => setNewRiderData({ ...newRiderData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile (+91)</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={newRiderData.phone}
                  onChange={(e) => setNewRiderData({ ...newRiderData, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={newRiderData.vehicleType}
                    onChange={(e) => setNewRiderData({ ...newRiderData, vehicleType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Electric Vehicle">Electric Vehicle (EV)</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Plate #</label>
                  <input
                    type="text"
                    required
                    value={newRiderData.vehiclePlate}
                    onChange={(e) => setNewRiderData({ ...newRiderData, vehiclePlate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driving License #</label>
                  <input
                    type="text"
                    required
                    value={newRiderData.drivingLicense}
                    onChange={(e) => setNewRiderData({ ...newRiderData, drivingLicense: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payout UPI ID</label>
                  <input
                    type="text"
                    required
                    value={newRiderData.upiId}
                    onChange={(e) => setNewRiderData({ ...newRiderData, upiId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Start Delivering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RIDER CAMERA: CLICK PARCEL PHOTO AT LOCAL SHOP MODAL */}
      {isCameraModalOpen && photoForOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-sm text-white">Local Shop Parcel Photo Capture</h3>
              </div>
              <button
                onClick={() => setIsCameraModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              📸 Click photo of the packed items and retail bill at the shop counter. Customer ID <strong>#{photoForOrderId}</strong> will see this in their app live to verify authenticity.
            </p>

            {/* Camera Viewfinder Mockup */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-orange-500/80 bg-black flex items-center justify-center group shadow-inner">
              <img
                src={customPhotoUrl || selectedPhotoPreset}
                alt="Camera Frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/40 pointer-events-none rounded-xl m-3 flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] text-white/80 font-mono bg-black/40 px-2 py-0.5 rounded self-start">
                  <span>LIVE CAM • SHOP VERIFIED</span>
                </div>
                <div className="text-center text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded self-center">
                  Target: Items & Shop Retail Receipt
                </div>
              </div>
            </div>

            {/* Photo Preset Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-300 block text-[11px]">Select Store Scenario Preset:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoPreset('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80');
                    setCustomPhotoUrl('');
                    setPhotoNotes('Checked packed box with seal and printed tax bill at shop counter.');
                  }}
                  className={`p-1.5 rounded-xl border text-[10px] font-bold text-left transition ${
                    selectedPhotoPreset.includes('1586528116311') && !customPhotoUrl ? 'border-orange-500 bg-orange-500/20 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  📦 Packed Box & Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoPreset('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80');
                    setCustomPhotoUrl('');
                    setPhotoNotes('Verified fresh morning dairy milk & paneer packet from local Kirana store.');
                  }}
                  className={`p-1.5 rounded-xl border text-[10px] font-bold text-left transition ${
                    selectedPhotoPreset.includes('1550583724') && !customPhotoUrl ? 'border-orange-500 bg-orange-500/20 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  🥛 Fresh Kirana / Dairy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoPreset('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80');
                    setCustomPhotoUrl('');
                    setPhotoNotes('Inspected spices, grains & grocery packages at Kirana shop counter.');
                  }}
                  className={`p-1.5 rounded-xl border text-[10px] font-bold text-left transition ${
                    selectedPhotoPreset.includes('1542838132') && !customPhotoUrl ? 'border-orange-500 bg-orange-500/20 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  🌾 Grocery & Provisions
                </button>
              </div>
            </div>

            {/* Custom Photo URL Input */}
            <div className="space-y-1 text-xs">
              <label className="text-[11px] font-bold text-slate-400 block">Or paste custom image link:</label>
              <input
                type="url"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Verification Notes */}
            <div className="space-y-1 text-xs">
              <label className="text-[11px] font-bold text-slate-400 block">Rider Inspection Note to Customer:</label>
              <input
                type="text"
                value={photoNotes}
                onChange={(e) => setPhotoNotes(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalPhoto = customPhotoUrl || selectedPhotoPreset;
                  uploadRiderPickupPhoto(photoForOrderId, finalPhoto, photoNotes);
                  setIsCameraModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Upload & Share with Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DOORSTEP DELIVERY CONFIRMATION (POD) CAMERA MODAL */}
      {isDeliveryProofModalOpen && deliveryProofOrderId && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <span>Doorstep Proof of Delivery (POD)</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Order #{deliveryProofOrderId}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Snap confirmation photo with device camera to share with customer
                  </p>
                </div>
              </div>
              <button
                onClick={closeDeliveryProofModal}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden file input for native camera roll fallback */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Camera Viewfinder / Preview */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-emerald-500/80 bg-black flex items-center justify-center group shadow-inner">
              {/* If snapshot has been captured/selected */}
              {deliveryProofPhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={deliveryProofPhoto}
                    alt="Captured Delivery Proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>PHOTO READY TO ATTACH</span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryProofPhoto('');
                        startLiveCamera();
                      }}
                      className="bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-600 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake with Camera</span>
                    </button>
                  </div>
                </div>
              ) : isLiveCameraActive ? (
                /* Live device video stream */
                <div className="relative w-full h-full bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder HUD Overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-emerald-400/50 pointer-events-none rounded-xl m-3 flex flex-col justify-between p-2">
                    <div className="flex justify-between items-center text-[10px] text-white font-mono bg-black/60 px-2.5 py-1 rounded-md self-start border border-emerald-500/40">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1.5" />
                      <span>LIVE CAMERA SENSOR ACTIVE</span>
                    </div>
                    <div className="text-center text-[10px] text-white/90 font-mono bg-black/70 px-3 py-1 rounded-md self-center border border-white/20">
                      Frame package at customer doorstep
                    </div>
                  </div>

                  {/* Shutter Button */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3">
                    <button
                      type="button"
                      onClick={captureFromVideo}
                      className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl shadow-emerald-500/40 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Photo Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopLiveCamera}
                      className="bg-slate-800/80 hover:bg-slate-700 text-white text-xs px-3 py-2.5 rounded-full transition cursor-pointer border border-slate-600"
                      title="Pause Camera"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              ) : (
                /* Live camera inactive / error fallback */
                <div className="p-6 text-center space-y-3 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Access Device Camera</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Click below to activate your phone or laptop camera to capture doorstep delivery proof.
                    </p>
                  </div>

                  {cameraError && (
                    <div className="bg-amber-950/60 border border-amber-600/50 text-amber-300 text-[11px] p-2.5 rounded-xl max-w-xs text-left">
                      ⚠️ {cameraError}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center pt-1">
                    <button
                      type="button"
                      onClick={startLiveCamera}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Turn On Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-slate-600"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Gallery</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Presets for Demo / Instant Simulation */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300 text-[11px]">
                  Or choose a simulated doorstep scenario:
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Use Device File</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    setDeliveryProofPhoto('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80');
                    setDeliveryProofNotes('Handed over safely at customer doorstep after secret OTP verification.');
                  }}
                  className={`p-2 rounded-xl border text-[10px] font-bold text-left transition cursor-pointer ${
                    deliveryProofPhoto.includes('1549465220') 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  🚪 Doorstep with Box
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    setDeliveryProofPhoto('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80');
                    setDeliveryProofNotes('Handed over parcel directly into customer hands at main entrance.');
                  }}
                  className={`p-2 rounded-xl border text-[10px] font-bold text-left transition cursor-pointer ${
                    deliveryProofPhoto.includes('1586528116311') 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  🤝 Direct Handover
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    setDeliveryProofPhoto('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80');
                    setDeliveryProofNotes('Delivered to society security gate desk with resident pre-authorization.');
                  }}
                  className={`p-2 rounded-xl border text-[10px] font-bold text-left transition cursor-pointer ${
                    deliveryProofPhoto.includes('1521791136064') 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  🏢 Gate / Reception Desk
                </button>
              </div>
            </div>

            {/* Delivery Proof Notes input */}
            <div className="space-y-1 text-xs">
              <label className="text-[11px] font-bold text-slate-400 block">
                Proof of Delivery Handover Note:
              </label>
              <input
                type="text"
                value={deliveryProofNotes}
                onChange={(e) => setDeliveryProofNotes(e.target.value)}
                placeholder="e.g. Handed over directly to customer at doorstep with OTP verification."
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={closeDeliveryProofModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDeliveryProof}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Attach Photo to Customer Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PHOTO VIEWER MODAL */}
      {viewingPhotoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewingPhotoUrl(null)}
        >
          <div className="relative max-w-xl w-full bg-slate-900 rounded-3xl overflow-hidden p-3 shadow-2xl border border-slate-700">
            <button
              onClick={() => setViewingPhotoUrl(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={viewingPhotoUrl} alt="Store Parcel Proof" className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <p className="text-center text-xs text-slate-300 mt-2 font-mono">
              📸 High Resolution Parcel Capture at Local Store
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

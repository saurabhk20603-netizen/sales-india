import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  Store, 
  Bike, 
  HelpCircle, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Plus, 
  Lock
} from 'lucide-react';

interface CustomerProfileProps {
  onBackToShopping: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ onBackToShopping }) => {
  const { 
    setRole, 
    language, 
    setLanguage, 
    addresses, 
    addAddress, 
    t 
  } = useApp();

  const [userName, setUserName] = useState('Saurabh Kumar');
  const [userPhone, setUserPhone] = useState('+91 98712 34567');
  const [userEmail, setUserEmail] = useState('saurabhk20603@gmail.com');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // OTP login simulation
  const [otpPhone, setOtpPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendOtp = () => {
    if (otpPhone.length === 10) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.length === 4) {
      setIsLoggedIn(true);
      setUserPhone(`+91 ${otpPhone}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-orange-500/30 ring-4 ring-white/10 shrink-0">
          SK
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold">{userName}</h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Verified User
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{userPhone} • {userEmail}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
              Sales India Club Member 🇮🇳
            </span>
            <span className="text-[11px] bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full font-bold">
              340 Bazar Coins
            </span>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-sm text-slate-900">Language Preference / भाषा प्राथमिकता</h3>
        </div>
        <p className="text-xs text-slate-500">
          Choose the language you prefer for product titles, notifications, and navigation.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
              language === 'en' 
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
              language === 'hi' 
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-sm text-slate-900">Saved Delivery Addresses</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {addresses.map(addr => (
            <div key={addr.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                {addr.type}
              </span>
              <p className="font-bold text-slate-800 mt-2">{addr.name}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{addr.flat}, {addr.street}</p>
              <p className="text-slate-600 text-[11px]">{addr.city} - {addr.pincode}</p>
              <p className="text-slate-500 text-[10px] mt-1">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-role Onboarding Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sell on Sales India */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-indigo-950">Sell on Sales India Bazar</h4>
            <p className="text-xs text-indigo-800/80 mt-1">
              Are you a shopkeeper, wholesaler, or manufacturer? Reach millions of customers across India with just 8% fee!
            </p>
          </div>
          <button
            onClick={() => setRole('seller')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition w-full"
          >
            Open Seller Hub
          </button>
        </div>

        {/* Deliver & Earn with Rapido/Blinkit flexibility */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Bike className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-emerald-950">Earn with Sales India Rider Fleet</h4>
            <p className="text-xs text-emerald-800/80 mt-1">
              Deliver packages flexibly in your free hours with your bike, scooter, or EV. Earn ₹40–₹80 per trip with instant UPI payouts!
            </p>
          </div>
          <button
            onClick={() => setRole('rider')}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition w-full"
          >
            Open Rider Partner App
          </button>
        </div>
      </div>

      {/* Customer Help & Support */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-sm text-slate-900">24x7 Customer Support & Safety</h3>
        </div>
        <p className="text-xs text-slate-600">
          Have an issue with your delivery or payment? Our customer success champions are available 24/7.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Toll-Free Helpline: <strong>1800-209-9182</strong></span>
          </div>
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Email: <strong>support@salesindia.in</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

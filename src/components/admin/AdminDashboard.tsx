import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Rider, Order } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Bike, 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sliders, 
  DollarSign, 
  FileCheck, 
  Eye, 
  Settings, 
  Lock,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    sellers, 
    riders, 
    orders, 
    products, 
    approveSeller, 
    approveRider, 
    updateOrderStatus,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'riders' | 'orders' | 'settings'>('overview');
  const [commissionRate, setCommissionRate] = useState(8);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(40);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(499);
  const [selectedSellerDocs, setSelectedSellerDocs] = useState<Seller | null>(null);
  const [selectedRiderDocs, setSelectedRiderDocs] = useState<Rider | null>(null);

  // Platform Metrics
  const totalGmv = orders.reduce((sum, o) => sum + o.total, 0);
  const platformEarnings = Math.round(totalGmv * (commissionRate / 100));
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const onlineRidersCount = riders.filter(r => r.isOnline).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Header */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Sales India Platform Super Admin</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                MASTER ROOT ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-Vendor Marketplace, Instant Logistics Dispatch & Revenue Oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
            <span>Server: </span>
            <strong className="text-emerald-400">asia-south1 (Mumbai) 99.98%</strong>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">{t.platformGmv}</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{totalGmv.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">Real-time marketplace volume</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Platform Commissions ({commissionRate}%)</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            ₹{platformEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Direct platform net revenue</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Active Orders In Flight</p>
          <p className="text-xl sm:text-2xl font-black text-orange-600 mt-1">
            {activeOrdersCount}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Across Delhi NCR, Mumbai & Surat</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Riders Fleet Online</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {onlineRidersCount}/{riders.length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Flexible partners on duty</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Marketplace Dispatch</span>
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'sellers' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Seller Verification ({sellers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('riders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'riders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Rider Approvals & Fleet ({riders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Commission & Pricing Controls</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW / DISPATCH FEED */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900">Live Orders & Logistics Dispatch</h3>
            <span className="text-xs text-slate-500">{orders.length} total platform orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Customer & City</th>
                  <th className="py-2.5">Seller Hub</th>
                  <th className="py-2.5">Rider Partner</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Current Status</th>
                  <th className="py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-900">#{order.id}</td>
                    <td className="py-3">
                      <span className="font-semibold block">{order.deliveryAddress.name}</span>
                      <span className="text-slate-400 text-[10px]">{order.deliveryAddress.city}</span>
                    </td>
                    <td className="py-3">{order.items[0]?.sellerName}</td>
                    <td className="py-3 font-semibold text-emerald-700">
                      {order.deliveryDetails.riderName || 'Unassigned'}
                    </td>
                    <td className="py-3 font-black text-slate-900">₹{order.total}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-[10px] font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg hover:bg-slate-800"
                        >
                          Force Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SELLER APPROVALS */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Seller GSTIN & Identity Verification</h3>
              <p className="text-xs text-slate-500">Verify government tax filings & bank accounts for merchant payouts</p>
            </div>
          </div>

          <div className="space-y-3">
            {sellers.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{s.storeName}</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {s.sellerType}
                    </span>
                    {s.isVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Verified Merchant
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Pending KYC
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-1">
                    Owner: <strong>{s.ownerName}</strong> • Phone: {s.phone} • {s.city}, {s.state}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    GSTIN: {s.gstin} | PAN: {s.pan} | Bank A/C: {s.bankAccount}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSellerDocs(s)}
                    className="bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-slate-700"
                  >
                    View Docs
                  </button>
                  {!s.isVerified && (
                    <button
                      onClick={() => approveSeller(s.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold"
                    >
                      Approve GSTIN
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RIDER APPROVALS & FLEET */}
      {activeTab === 'riders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Rider Partner Document Audits</h3>
              <p className="text-xs text-slate-500">Driving license, RC, and vehicle safety compliance for gig delivery partners</p>
            </div>
          </div>

          <div className="space-y-3">
            {riders.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{r.name}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {r.vehicleType}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {r.isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Phone: {r.phone} • Zone: {r.preferredZone} • Rating: ★ {r.rating}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Plate: {r.vehiclePlate} | DL: {r.drivingLicense} | UPI: {r.upiId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRiderDocs(r)}
                    className="bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-slate-700"
                  >
                    View DL Document
                  </button>
                  {!r.isVerified && (
                    <button
                      onClick={() => approveRider(r.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold"
                    >
                      Approve Rider
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION & PRICING CONTROLS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Platform Economics & Fee Policy</h3>
            <p className="text-xs text-slate-500">
              Configure marketplace margins, delivery fee subsidies, and free delivery thresholds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block">Seller Platform Commission (%)</label>
              <input
                type="number"
                min={1}
                max={25}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-sm text-slate-900"
              />
              <p className="text-slate-500 text-[11px]">Deducted automatically from seller gross sales payouts.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block">Base Delivery Fee (₹)</label>
              <input
                type="number"
                value={baseDeliveryFee}
                onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-sm text-slate-900"
              />
              <p className="text-slate-500 text-[11px]">Charged to customer on small orders.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block">Free Delivery Min Order (₹)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-sm text-slate-900"
              />
              <p className="text-slate-500 text-[11px]">Free express delivery unlocked above this amount.</p>
            </div>
          </div>
        </div>
      )}

      {/* Docs inspection modals */}
      {selectedSellerDocs && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Business Verification: {selectedSellerDocs.storeName}</h3>
              <button onClick={() => setSelectedSellerDocs(null)}><XCircle className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>GST Certificate:</strong> {selectedSellerDocs.gstin} (Valid Active)</p>
              <p><strong>Permanent Account Number (PAN):</strong> {selectedSellerDocs.pan}</p>
              <p><strong>Registered Address:</strong> {selectedSellerDocs.address}, {selectedSellerDocs.city}</p>
              <p><strong>Bank IFSC:</strong> {selectedSellerDocs.ifsc}</p>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-medium">
                ✓ Passed automated Ministry of Corporate Affairs & GSTN verification check.
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRiderDocs && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Rider Verification: {selectedRiderDocs.name}</h3>
              <button onClick={() => setSelectedRiderDocs(null)}><XCircle className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Driving License:</strong> {selectedRiderDocs.drivingLicense}</p>
              <p><strong>Vehicle Plate:</strong> {selectedRiderDocs.vehiclePlate}</p>
              <p><strong>Vehicle Category:</strong> {selectedRiderDocs.vehicleType}</p>
              <p><strong>Aadhaar / KYC:</strong> Completed via Digilocker simulation</p>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-medium">
                ✓ Parivahan Sarathi driving license valid & verified.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

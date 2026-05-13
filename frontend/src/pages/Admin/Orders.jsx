import React, { useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; 
import { Plus, Search, Edit2, Trash2, ShoppingCart, Clock, Truck, RotateCcw, X } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function Order({ orders, setOrders, products = [] }) {
  const [activeTab, setActiveTab] = useState('Current');

  async function handleSubmitManual(data) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrders([newOrder, ...orders]);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  async function handleUpdateManual(id, data) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map((order) => order._id === id ? updatedOrder : order));
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== id));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Current') return order.status === 'Pending' || order.status === 'Shipped';
    if (activeTab === 'Delivered') return order.status === 'Delivered';
    if (activeTab === 'Returns') return order.status === 'Returned';
    return true;
  });

  const tabs = [
    { name: 'Current', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { name: 'Delivered', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { name: 'Returns', icon: RotateCcw, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">Track logistics and customer transactions</p>
        </div>
        <Popup 
          trigger={
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
              <Plus className="w-4 h-4" /> New Order
            </button>
          }
          modal
          overlayStyle={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          contentStyle={{ width: '450px', padding: '0', borderRadius: '1.5rem', border: 'none' }}
        >
          {close => {
            const [searchQuery, setSearchQuery] = useState("");
            const [selectedProduct, setSelectedProduct] = useState(null);
            const [showResults, setShowResults] = useState(false);

            const filteredProductsList = products.filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);

            return (
              <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Transaction</h3>
                  <button onClick={close} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={(e) => { 
                  e.preventDefault();
                  const data = {
                    customerName: e.target[0].value,
                    productName: selectedProduct,
                    quantity: e.target[2].value,
                    orderDate: e.target[3].value,
                    status: e.target[4].value || 'Pending',
                  };
                  handleSubmitManual(data);
                  close(); 
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Name</label>
                    <input type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" required />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Product</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={selectedProduct || "Type to search..."}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" 
                        required={!selectedProduct}
                      />
                    </div>
                    {showResults && searchQuery && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                        {filteredProductsList.length > 0 ? (
                          filteredProductsList.map(p => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => {
                                setSelectedProduct(p.name);
                                setSearchQuery("");
                                setShowResults(false);
                              }}
                              className="w-full px-5 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-none flex items-center justify-between"
                            >
                              <span>{p.name}</span>
                              <span className="text-[10px] font-extrabold text-slate-400">${p.price}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-5 py-4 text-xs text-slate-400 font-bold uppercase text-center">No matches found</div>
                        )}
                      </div>
                    )}
                    {selectedProduct && !searchQuery && (
                      <div className="flex items-center gap-3 mt-3 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl w-fit border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Selected: {selectedProduct}</span>
                        <button type="button" onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
                          <X className="w-4 h-4 text-indigo-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                      <input type="number" placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fulfillment Status</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/10">
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                  <button type="submit" disabled={!selectedProduct} className="w-full py-3.5 bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Create Order Record</button>
                </form>
              </div>
            );
          }}
        </Popup>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              activeTab === tab.name
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.name ? tab.color : 'text-slate-400'}`} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-5">Customer Detail</th>
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5 text-center">Qty</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <ShoppingCart className="w-12 h-12 text-slate-300" />
                      <p className="text-xs font-bold uppercase tracking-widest">No matching records</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shadow-inner">
                          {order.customerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{order.productName}</span>
                    </td>
                    <td className="px-8 py-5 text-center font-extrabold text-slate-700 dark:text-slate-200">
                      {order.quantity}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' :
                        order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20' :
                        order.status === 'Returned' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' :
                        'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Popup 
                          trigger={
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                              <Edit2 className="w-5 h-5" />
                            </button>
                          }
                          modal
                          overlayStyle={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                          contentStyle={{ width: '450px', padding: '0', borderRadius: '1.5rem', border: 'none' }}
                        >
                          {close => {
                            const [searchQuery, setSearchQuery] = useState("");
                            const [selectedProduct, setSelectedProduct] = useState(order.productName);
                            const [showResults, setShowResults] = useState(false);

                            const filteredProductsList = products.filter(p => 
                              p.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ).slice(0, 5);

                            return (
                              <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Update Record</h3>
                                <form onSubmit={(e) => { 
                                  e.preventDefault();
                                  const data = {
                                    customerName: e.target[0].value,
                                    productName: selectedProduct,
                                    quantity: e.target[2].value,
                                    status: e.target[3].value,
                                  };
                                  handleUpdateManual(order._id, data);
                                  close();
                                }} className="space-y-6">
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Name</label>
                                    <input type="text" defaultValue={order.customerName} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" />
                                  </div>

                                  <div className="space-y-2 relative">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Search</label>
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <input 
                                        type="text" 
                                        placeholder={selectedProduct}
                                        value={searchQuery}
                                        onChange={(e) => {
                                          setSearchQuery(e.target.value);
                                          setShowResults(true);
                                        }}
                                        onFocus={() => setShowResults(true)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" 
                                      />
                                    </div>
                                    {showResults && searchQuery && (
                                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                                        {filteredProductsList.map(p => (
                                          <button
                                            key={p._id}
                                            type="button"
                                            onClick={() => {
                                              setSelectedProduct(p.name);
                                              setSearchQuery("");
                                              setShowResults(false);
                                            }}
                                            className="w-full px-5 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-none"
                                          >
                                            {p.name}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                    {selectedProduct && !searchQuery && (
                                      <div className="mt-2 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Current: {selectedProduct}</div>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Qty</label>
                                      <input type="number" defaultValue={order.quantity} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
                                      <select defaultValue={order.status} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/10">
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Returned">Returned</option>
                                      </select>
                                    </div>
                                  </div>
                                  <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Save Changes</button>
                                </form>
                              </div>
                            );
                          }}
                        </Popup>
                        <button onClick={() => handleDelete(order._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; 
import { Plus, Search, Edit2, Trash2, Package, Image as ImageIcon, X, AlertTriangle, Calendar, Hash, MapPin, TrendingDown, DollarSign } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function Product({ products, setProducts, categories }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', e.target[0].value);
    formData.append('price', e.target[2].value);
    formData.append('costPrice', e.target[3].value); // New field
    formData.append('category', e.target[4].value);
    formData.append('stock', e.target[5].value);
    formData.append('minStockThreshold', e.target[6].value);
    formData.append('batchNumber', e.target[7].value);
    formData.append('expiryDate', e.target[8].value);
    formData.append('location', e.target[9].value);
    formData.append('unit', 'Pieces');
    if (selectedFile) formData.append('image', selectedFile);

    try {
      const response = await fetchWithAuth(`${API_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([newProduct, ...products]);
        e.target.reset();
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  async function handleUpdate(id, e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', e.target[0].value);
    formData.append('price', e.target[1].value);
    formData.append('costPrice', e.target[2].value); // New field
    formData.append('category', e.target[3].value);
    formData.append('stock', e.target[4].value);
    formData.append('minStockThreshold', e.target[5].value);
    formData.append('batchNumber', e.target[6].value);
    formData.append('expiryDate', e.target[7].value);
    formData.append('location', e.target[8].value);
    if (editFile) formData.append('image', editFile);

    try {
      const response = await fetchWithAuth(`${API_URL}/api/products/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === id ? updatedProduct : p));
        setEditFile(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">Advanced Profit & Inventory Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full md:w-72 dark:text-white" 
            />
          </div>
          <Popup 
            trigger={
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            }
            modal
            overlayStyle={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            contentStyle={{ width: '650px', padding: '0', borderRadius: '1.5rem', border: 'none' }}
          >
            {close => (
              <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Product Entry</h3>
                  <button onClick={close} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={(e) => { handleSubmit(e); close(); }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Title</label>
                      <input type="text" placeholder="e.g. MacBook Pro M3" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cover Image</label>
                      <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 truncate">{selectedFile ? selectedFile.name : 'Choose a file'}</span>
                        <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selling Price ($)</label>
                      <input type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-indigo-600" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cost Price ($)</label>
                      <input type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-rose-500" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white appearance-none cursor-pointer">
                        {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Stock</label>
                      <input type="number" placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Low Stock Threshold</label>
                      <input type="number" defaultValue="10" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Batch Number</label>
                      <input type="text" placeholder="BN-XXXX" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Warehouse Location</label>
                      <input type="text" defaultValue="Warehouse A" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Add to Inventory</button>
                </form>
              </div>
            )}
          </Popup>
        </div>
      </div>

      {/* Product Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Profit Analytics</th>
                <th className="px-8 py-5">Inventory</th>
                <th className="px-8 py-5">Batch info</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-xs font-bold uppercase tracking-widest">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLowStock = product.stock <= (product.minStockThreshold || 10);
                  const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
                  const profit = product.price - product.costPrice;
                  const margin = (profit / (product.price || 1)) * 100;
                  const isLoss = profit < 0;

                  return (
                    <tr key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 relative">
                            {product.image ? (
                              <img src={`${API_URL}${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{product.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{product.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Sell: ${product.price}</span>
                            <span className="text-xs font-bold text-rose-400">Cost: ${product.costPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {isLoss ? <TrendingDown className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1 rotate-180" />}
                              {margin.toFixed(1)}% {isLoss ? 'Loss' : 'Margin'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm font-black ${isLowStock ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>{product.stock} Units</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-bold">{product.location || 'Warehouse A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-500">#{product.batchNumber || 'N/A'}</span>
                          <span className={`text-[10px] font-bold ${isExpired ? 'text-rose-500' : 'text-slate-400'}`}>
                            {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'No Expiry'}
                          </span>
                        </div>
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
                            contentStyle={{ width: '600px', padding: '0', borderRadius: '1.5rem', border: 'none' }}
                          >
                            {close => (
                              <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Specifications</h3>
                                <form onSubmit={(e) => { handleUpdate(product._id, e); close(); }} className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                                      <input type="text" defaultValue={product.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sell Price ($)</label>
                                      <input type="number" defaultValue={product.price} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-indigo-600" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cost Price ($)</label>
                                      <input type="number" defaultValue={product.costPrice} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-rose-500" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                      <select defaultValue={product.category} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white appearance-none">
                                        {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Stock</label>
                                      <input type="number" defaultValue={product.stock} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Min Threshold</label>
                                      <input type="number" defaultValue={product.minStockThreshold} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Batch #</label>
                                      <input type="text" defaultValue={product.batchNumber} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry</label>
                                      <input type="date" defaultValue={product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                                    <input type="text" defaultValue={product.location} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white" />
                                  </div>
                                  <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Save Changes</button>
                                </form>
                              </div>
                            )}
                          </Popup>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

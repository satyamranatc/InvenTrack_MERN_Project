import React from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; 
import { Plus, Tag, Trash2, Layers, Edit2, X, Search } from 'lucide-react'
import { fetchWithAuth } from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL;

export default function Category({categories, setCategories}) {
  async function handleSubmit(e) {
    e.preventDefault();
    const name = e.target[0].value;

    try {
      const response = await fetchWithAuth(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        e.target.reset();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }

  async function handleUpdate(id, e) {
    e.preventDefault();
    const name = e.target[0].value;
    try {
      const response = await fetchWithAuth(`${API_URL}/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => cat._id === id ? updatedCategory : cat));
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Category Architecture</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">Organize inventory with global classifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Popup 
            trigger={
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
                <Plus className="w-4 h-4" /> New Classification
              </button>
            }
            modal
            overlayStyle={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            contentStyle={{ width: '450px', padding: '0', borderRadius: '1.5rem', border: 'none' }}
          >
            {close => (
              <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Category</h3>
                  <button onClick={close} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={(e) => { handleSubmit(e); close(); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                    <input type="text" placeholder="e.g. Electronics" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" required />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Create Category</button>
                </form>
              </div>
            )}
          </Popup>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1 premium-card p-8 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 dark:bg-slate-800/20 border-dashed">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center shadow-inner">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{categories.length}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Classifications</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Index</th>
                  <th className="px-8 py-5">Taxonomy Name</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {categories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{category.name}</span>
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
                          {close => (
                            <div className="p-10 bg-white dark:bg-black rounded-3xl shadow-2xl space-y-8">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Category</h3>
                              <form onSubmit={(e) => { handleUpdate(category._id, e); close(); }} className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                                  <input type="text" defaultValue={category.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium dark:text-white focus:ring-2 focus:ring-indigo-500/10" required />
                                </div>
                                <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Save Changes</button>
                              </form>
                            </div>
                          )}
                        </Popup>
                        <button onClick={() => handleDelete(category._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, LogOut, 
  Settings, Sun, Moon, Sparkles, ShieldCheck, Activity, ChevronRight
} from 'lucide-react'

export default function SideBar({ isDarkMode, toggleTheme }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/Product', icon: Package },
    { name: 'Category Manager', path: '/admin/Category', icon: Layers },
    { name: 'Order Logs', path: '/admin/Orders', icon: ShoppingCart },
    { name: 'Movement Ledger', path: '/admin/Logs', icon: Activity },
  ];

  return (
    <aside className="w-72 h-screen bg-white dark:bg-black border-r border-slate-200 dark:border-slate-800/60 flex flex-col sticky top-0 transition-all duration-500 z-50 overflow-hidden">
      {/* Brand Section */}
      <div className="h-28 flex items-center px-10">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 transition-all group-hover:rotate-6 group-hover:scale-110">
            <Package className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight">Inven<span className="text-indigo-600">Track</span></span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1">Enterprise V3</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation Section - Hidden scrollbar but functional */}
      <nav className="flex-1 px-6 space-y-10 overflow-y-auto no-scrollbar py-6">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-6">Management</p>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 dark:shadow-none'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="flex-1 tracking-tight">{item.name}</span>
                    {isActive ? (
                        <ChevronRight className="w-4 h-4 opacity-50" />
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-500 transition-colors" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>


      </nav>

      {/* Footer Section */}
      <div className="p-8 border-t border-slate-100 dark:border-slate-800/60">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-rose-500/5 hover:text-rose-500 transition-all group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>System Logout</span>
        </button>
      </div>
      
      {/* Global Style for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </aside>
  )
}

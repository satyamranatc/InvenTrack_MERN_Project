import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Search } from 'lucide-react'

export default function NavBar({ isDarkMode, toggleTheme }) {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Admin', path: '/admin'},
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-effect border-b border-slate-200/50 dark:border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <img className="w-8 h-8 invert brightness-0" src="/public/InvenTrack.png" alt="" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Inven<span className="text-indigo-500">Track</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>

            <Link 
              to="/admin"
              className="hidden sm:flex px-6 py-3 bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


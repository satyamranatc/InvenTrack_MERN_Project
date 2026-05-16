import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Send,
  Globe,
  Layout,
  Layers,
  Shield,
  Zap
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Features', path: '/features' },
      { name: 'Our Team', path: '/team' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    socials: [
      { icon: Globe, path: '#', color: 'hover:text-blue-500' },
      { icon: Layout, path: '#', color: 'hover:text-sky-400' },
      { icon: Layers, path: '#', color: 'hover:text-pink-500' },
      { icon: Shield, path: '#', color: 'hover:text-blue-600' },
      { icon: Zap, path: '#', color: 'hover:text-amber-500' },
    ]
  };

  return (
    <footer className="relative mt-20 border-t border-slate-200/60 dark:border-white/5 bg-surface transition-colors duration-300">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <img className="w-6 h-6 invert brightness-0" src="/public/InvenTrack.png" alt="InvenTrack" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Inven<span className="text-indigo-500">Track</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              The next-generation enterprise inventory intelligence platform. 
              Real-time analytics, predictive forecasting, and seamless supply chain 
              visibility for modern businesses.
            </p>
            <div className="flex gap-4">
              {footerLinks.socials.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.path}
                  className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-400 transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Subscribe to our newsletter for the latest updates in inventory management.
            </p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <button 
                type="button"
                className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>support@inventrack.ai</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Silicon Valley, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© {currentYear} InvenTrack AI. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-500 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Compliance</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Box, Zap, CheckCircle2, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeBackground from '../../components/ThreeBackground'

export default function Home() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Feature Cards Animation
      gsap.from(".feature-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".feature-grid",
          start: "top 80%"
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-white dark:bg-black transition-colors duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-48">
        <ThreeBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto space-y-10 hero-content"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Enterprise Intelligence Console
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1]"
            >
              Inventory Control <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">Perfected.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              InvenTrack transforms your warehouse into a data-driven engine with real-time profit tracking and predictive logistics.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link 
                to="/admin" 
                className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 transition-all hover:-translate-y-2 flex items-center justify-center gap-3 text-lg"
              >
                Access Dashboard <ChevronRight className="w-6 h-6" />
              </Link>
              <button className="w-full sm:w-auto px-12 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg">
                View Enterprise Spec
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50/50 dark:bg-white/[0.01] border-y border-slate-100 dark:border-slate-800/50 feature-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Profit Intelligence', 
                desc: 'Deep cost-benefit analysis on every SKU. Stop guessing, start earning.', 
                icon: BarChart3, 
                color: 'text-indigo-600', 
                bg: 'bg-indigo-600/10' 
              },
              { 
                title: 'Movement Ledger', 
                desc: 'Absolute accountability with a high-fidelity audit trail of every stock shift.', 
                icon: Box, 
                color: 'text-emerald-600', 
                bg: 'bg-emerald-600/10' 
              },
              { 
                title: 'Predictive Ops', 
                desc: 'Smart reorder engine that prevents stockouts before they happen.', 
                icon: Zap, 
                color: 'text-amber-600', 
                bg: 'bg-amber-600/10' 
              },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="premium-card p-12 rounded-[3rem] bg-white dark:bg-[#080808] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col items-start text-left"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <motion.h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{feature.title}</motion.h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
                <div className="absolute -inset-10 bg-indigo-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl scale-95 hover:scale-100 transition-transform duration-700">
                    <img 
                      src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000" 
                      className="w-full h-full object-cover dark:opacity-70 grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
                      alt="Warehouse Intelligence" 
                    />
                </div>
            </div>
            <div className="space-y-10">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">Scale without <br />the friction.</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Ditch the spreadsheets and manual logs. InvenTrack centralizes your entire logistics operation into a single, high-fidelity console.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        'Financial Auditing',
                        'Multi-Node Tracking',
                        'Reorder Intelligence',
                        'Real-time Velocity'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-base font-black text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {item}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-40 px-4">
        <div className="max-w-6xl mx-auto bg-slate-900 dark:bg-indigo-600 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 to-transparent opacity-50"></div>
            <div className="relative z-10 space-y-10">
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">Ready for the future?</h2>
                <p className="text-white/80 font-bold max-w-xl mx-auto text-xl leading-relaxed">Join the world's most efficient warehouses using InvenTrack to maximize their bottom line.</p>
                <div className="pt-6">
                    <Link 
                      to="/admin" 
                      className="px-14 py-6 bg-white text-slate-900 font-black rounded-3xl hover:scale-105 transition-transform inline-flex items-center gap-4 shadow-2xl text-lg"
                    >
                      Enter Command Center <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

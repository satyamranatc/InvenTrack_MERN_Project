import React, { useState, useEffect } from 'react'
import { Activity, ArrowUpRight, ArrowDownRight, Filter, Search, Calendar, Package } from 'lucide-react'
import { fetchWithAuth } from '../../utils/api'

const API_URL = import.meta.env.VITE_API_URL;

export default function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/audit-logs`);
      if (response && response.ok) {
        const data = await response.json();
        setLogs(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = safeLogs.filter(log => 
    log.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-50 dark:bg-black transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Ledger</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Movement Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">Real-time audit trail of all stock movements</p>
          <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl max-w-3xl">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
              The <span className="text-indigo-600 dark:text-indigo-400">Movement Ledger</span> represents the immutable history of your enterprise stock. Every addition, subtraction, or manual adjustment is recorded with a cryptographically-ordered timestamp, ensuring complete transparency for financial audits and stock intelligence. It tracks the "Delta" (the change) and the resulting post-transaction stock level to prevent data discrepancy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by product or reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all w-full md:w-80 dark:text-white focus:border-indigo-500" 
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Inbound", val: safeLogs.filter(l => l.type === 'Inbound').length, icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Outbound", val: safeLogs.filter(l => l.type === 'Outbound').length, icon: ArrowDownRight, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
          { label: "Adjustments", val: safeLogs.filter(l => l.type === 'Adjustment').length, icon: Activity, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-6 flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:rotate-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{stat.val} Entries</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Product Intelligence</th>
                <th className="px-8 py-6">Event Type</th>
                <th className="px-8 py-6 text-center">Delta</th>
                <th className="px-8 py-6 text-center">Post-Level</th>
                <th className="px-8 py-6">Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No movement history identified</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-[11px] font-black text-slate-400 uppercase">{new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{log.productName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                        log.type === 'Inbound' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                        log.type === 'Outbound' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' :
                        'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-black text-base ${log.quantityChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-700 dark:text-slate-200">
                      {log.newStock}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold italic tracking-tight">"{log.reason}"</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

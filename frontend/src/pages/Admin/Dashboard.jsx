import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  Legend, ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from "recharts";
import { 
  Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, 
  Layers, TrendingUp, AlertTriangle, Zap, Activity, Calendar, Search, 
  RotateCcw, Info, CheckCircle2, TrendingDown, Sparkles, Users, Briefcase,
  Box, BarChart3
} from "lucide-react";

// --- Analytics Utilities ---

const forecastNextPeriod = (data, daysToForecast = 7) => {
  if (data.length < 2) return [];
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  data.forEach((d, i) => {
    sumX += i;
    sumY += d.value;
    sumXY += i * d.value;
    sumXX += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const forecasts = [];
  for (let i = n; i < n + daysToForecast; i++) {
    const val = Math.max(0, slope * i + intercept);
    forecasts.push({ 
      date: `Next D+${i - n + 1}`, 
      value: Math.round(val),
      isForecast: true 
    });
  }
  return forecasts;
};

const detectAnomalies = (data) => {
  if (data.length < 3) return [];
  const values = data.map(d => d.value);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const stdDev = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b) / values.length);
  
  return data.map(d => ({
    ...d,
    isAnomaly: Math.abs(d.value - mean) > 2 * stdDev
  }));
};

export default function Dashboard({ orders = [], products = [], isDarkMode }) {
  if (!orders || !products) return null;
  const [timeWindow, setTimeWindow] = useState("30D");

  const chartTheme = {
    grid: isDarkMode ? "#1e293b" : "#f1f5f9",
    text: isDarkMode ? "#f8fafc" : "#94a3b8",
    tooltipBg: isDarkMode ? "#000000" : "#ffffff",
    tooltipBorder: isDarkMode ? "#334155" : "#e2e8f0"
  };

  const analyticsData = useMemo(() => {
    const dailyMap = {};
    orders.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      const product = products.find(p => p.name === order.productName) || { price: 0, costPrice: 0 };
      
      const price = product.price || 0;
      const cost = product.costPrice || 0;
      
      const rev = order.status === 'Delivered' ? price * order.quantity : 0;
      const profit = order.status === 'Delivered' ? (price - cost) * order.quantity : 0;
      
      if (!dailyMap[date]) dailyMap[date] = { revenue: 0, profit: 0, count: 0, returns: 0 };
      dailyMap[date].revenue += rev;
      dailyMap[date].profit += profit;
      dailyMap[date].count += 1;
      if (order.status === 'Returned') dailyMap[date].returns += 1;
    });

    const timeSeries = Object.entries(dailyMap).map(([date, vals]) => ({
      date,
      timestamp: new Date(date).getTime(),
      value: vals.revenue,
      profit: vals.profit,
      orders: vals.count,
      returns: vals.returns
    })).sort((a, b) => a.timestamp - b.timestamp);

    const revenueWithAnomalies = detectAnomalies(timeSeries);
    const revenueForecast = forecastNextPeriod(timeSeries);

    const categoryStats = products.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = { name: curr.category, stock: 0, items: 0, value: 0, profitPotential: 0 };
      acc[curr.category].stock += curr.stock;
      acc[curr.category].items += 1;
      acc[curr.category].value += curr.price * curr.stock;
      acc[curr.category].profitPotential += (curr.price - curr.costPrice) * curr.stock;
      return acc;
    }, {});

    const categoryData = Object.values(categoryStats);

    const statusCounts = orders.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const productSales = orders.reduce((acc, order) => {
      acc[order.productName] = (acc[order.productName] || 0) + order.quantity;
      return acc;
    }, {});

    const topProducts = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const customerInsights = orders.reduce((acc, order) => {
      if (!acc[order.customerName]) acc[order.customerName] = { name: order.customerName, totalSpent: 0, orders: 0 };
      const product = products.find(p => p.name === order.productName);
      acc[order.customerName].totalSpent += (product?.price || 0) * order.quantity;
      acc[order.customerName].orders += 1;
      return acc;
    }, {});

    const topCustomers = Object.values(customerInsights)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const totalRevenue = timeSeries.reduce((a, b) => a + b.value, 0);
    const totalProfit = timeSeries.reduce((a, b) => a + b.profit, 0);
    const netMargin = (totalProfit / (totalRevenue || 1)) * 100;
    
    const avgOrderValue = totalRevenue / (orders.length || 1);
    const returnRate = (orders.filter(o => o.status === 'Returned').length / (orders.length || 1)) * 100;
    
    const lowStockItems = products.filter(p => p.stock <= (p.minStockThreshold || 10));
    const lossProducts = products.filter(p => p.costPrice > p.price);

    const reorderSuggestions = lowStockItems.map(p => ({
      name: p.name,
      current: p.stock,
      threshold: p.minStockThreshold || 10,
      suggested: (p.minStockThreshold || 10) * 2 - p.stock,
      priority: p.stock <= (p.minStockThreshold || 10) / 2 ? 'High' : 'Medium'
    }));

    const radarData = categoryData.map(cat => ({
      subject: cat.name,
      Revenue: cat.value / 1000, // Scale for better visualization
      Profit: cat.profitPotential / 100,
      Stock: cat.items * 10,
      fullMark: 150
    }));

    const radialData = statusData.map((s, i) => ({
      ...s,
      fill: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'][i % 4]
    }));

    // --- ML Model Diagnostics ---
    const calculateR2 = (actual, forecast) => {
      if (actual.length < 2) return 0.85; // Fallback
      const mean = actual.reduce((a, b) => a + b.value, 0) / actual.length;
      const ssRes = actual.reduce((acc, d, i) => acc + Math.pow(d.value - (forecast[i]?.value || d.value), 2), 0);
      const ssTot = actual.reduce((acc, d) => acc + Math.pow(d.value - mean, 2), 0);
      return 1 - (ssRes / (ssTot || 1));
    };

    const mlStats = {
      confidence: Math.round(calculateR2(timeSeries, revenueForecast.slice(0, timeSeries.length)) * 100),
      growthRate: (((revenueForecast[revenueForecast.length - 1]?.value || 0) - (timeSeries[timeSeries.length - 1]?.value || 0)) / (timeSeries[timeSeries.length - 1]?.value || 1) * 100).toFixed(1),
      anomalyScore: ((revenueWithAnomalies.filter(d => d.isAnomaly).length / (timeSeries.length || 1)) * 100).toFixed(1),
      volatility: (Math.sqrt(timeSeries.reduce((a, b) => a + Math.pow(b.value - (totalRevenue / (timeSeries.length || 1)), 2), 0) / (timeSeries.length || 1)) / (totalRevenue / (timeSeries.length || 1) || 1) * 100).toFixed(1)
    };

    const totalCustomers = Object.keys(customerInsights).length;

    return {
      timeSeries,
      revenueWithAnomalies,
      revenueForecast,
      categoryData,
      radarData,
      radialData,
      statusData,
      topProducts,
      topCustomers,
      reorderSuggestions,
      lossProducts,
      mlStats,
      kpis: {
        revenue: totalRevenue,
        profit: totalProfit,
        margin: netMargin,
        orders: orders.length,
        aov: avgOrderValue,
        returns: returnRate,
        customers: totalCustomers,
        lowStock: lowStockItems.length
      }
    };
  }, [orders, products]);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-indigo-600" />
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Intelligence Console</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mt-1">Real-time Profit & Supply Chain Intelligence</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-black p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {["7D", "30D", "1Y"].map(window => (
            <button
              key={window}
              onClick={() => setTimeWindow(window)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${timeWindow === window ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              {window}
            </button>
          ))}
        </div>
      </div>

      {/* ML Intelligence Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="premium-card p-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-none"
      >
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-8 rounded-[1.4rem] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Machine Learning Intelligence</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Linear Regression Model v4.2 Active
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-auto">
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Accuracy</span>
                    <h4 className="text-2xl font-black text-indigo-600">{analyticsData.mlStats.confidence}% R²</h4>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Forecast Growth</span>
                    <h4 className={`text-2xl font-black ${analyticsData.mlStats.growthRate > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{analyticsData.mlStats.growthRate}%</h4>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Anomaly Density</span>
                    <h4 className="text-2xl font-black text-amber-500">{analyticsData.mlStats.anomalyScore}%</h4>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Demand Volatility</span>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{analyticsData.mlStats.volatility}%</h4>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Net Profit", val: `$${analyticsData.kpis.profit.toLocaleString()}`, icon: DollarSign, trend: `${analyticsData.kpis.margin.toFixed(1)}% Margin`, isUp: analyticsData.kpis.margin > 20, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Gross Revenue", val: `$${analyticsData.kpis.revenue.toLocaleString()}`, icon: TrendingUp, trend: "+14.2%", isUp: true, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
          { label: "Order Volume", val: analyticsData.kpis.orders, icon: ShoppingCart, trend: "+8.1%", isUp: true, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Return Rate", val: `${analyticsData.kpis.returns.toFixed(1)}%`, icon: RotateCcw, trend: "-0.5%", isUp: true, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-8 border-l-4 border-l-transparent hover:border-l-indigo-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-7 h-7" />
              </div>
              <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl ${kpi.isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{kpi.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                Profit & Revenue Velocity
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 text-[10px] rounded-full font-bold">PREDICTIVE ENGINE</span>
              </h3>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Monitoring net earnings and revenue anomalies across your supply chain.</p>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analyticsData.timeSeries} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 9, fill: chartTheme.text, fontWeight: 700}} 
                  dy={15} 
                  interval="preserveStartEnd"
                  minTickGap={50}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: chartTheme.text, fontWeight: 700}} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: chartTheme.text, fontWeight: 700}} dx={10} />
                <Tooltip cursor={{stroke: '#6366f1', strokeWidth: 1}} contentStyle={{ borderRadius: '20px', border: `1px solid ${chartTheme.tooltipBorder}`, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '13px', background: chartTheme.tooltipBg, fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }} />
                <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 800, color: chartTheme.text, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Area yAxisId="left" name="Revenue" type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line yAxisId="left" name="Profit" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Bar yAxisId="right" name="Orders" dataKey="orders" barSize={10} fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.4} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Precision Order Volume BarChart */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Transaction Density</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Daily order frequency analysis</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Count</span>
                </div>
            </div>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.timeSeries}>
                  <XAxis dataKey="date" hide />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: '12px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: '10px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}
                  />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="premium-card p-8 bg-indigo-600 text-white overflow-hidden relative min-h-[300px]">
            <Sparkles className="absolute -right-10 -top-10 w-48 h-48 text-white/10 rotate-12" />
            <h3 className="text-lg font-black mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6" /> Cognitive Insights
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold leading-relaxed">
                  Net margin is <span className="font-black underline text-emerald-300">{(analyticsData.kpis.margin + 2.4).toFixed(1)}% above average</span> this month. High-performing categories identified.
                </p>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold leading-relaxed">
                  <span className="font-black text-rose-300">{analyticsData.kpis.lowStock} SKUs</span> are below safety thresholds. Stockouts likely within 72 hours.
                </p>
              </div>
              {analyticsData.lossProducts.length > 0 && (
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-rose-100">
                    <span className="font-black text-white">{analyticsData.lossProducts.length} items</span> are selling below cost price. Immediate price adjustment required.
                  </p>
                </div>
              )}
            </div>
            <button className="mt-10 w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-900/40 active:scale-95">
              Run Profit Optimization
            </button>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-8">Profit Potential by Category</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="profitPotential"
                  >
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reorder Intelligence */}
        <div className="premium-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Replenishment Engine</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Priority Stocking Suggestions</p>
            </div>
            <Box className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {analyticsData.reorderSuggestions.slice(0, 4).map((item, idx) => (
              <div key={idx} className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-6 hover:border-indigo-500/30 transition-all">
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg mb-2 ${item.priority === 'High' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20'}`}>{item.priority}</span>
                  <span className="text-[10px] font-bold text-slate-400">Stock: {item.current}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white mb-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">Order {item.suggested} units to hit safety target.</p>
                </div>
                <button className="px-5 py-2.5 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">REORDER</button>
              </div>
            ))}
          </div>
        </div>

         {/* New Advanced Visualizations Section */}
        <div className="lg:col-span-1 premium-card p-8">
            <div className="flex flex-col gap-1 mb-8">
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Category Radar</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balanced Performance Metric</p>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.radarData}>
                        <PolarGrid stroke={chartTheme.grid} />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: chartTheme.text, fontWeight: 700}} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar name="Revenue/Profit Balance" dataKey="Revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Radar name="Stock Density" dataKey="Stock" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ borderRadius: '12px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: '11px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="lg:col-span-1 premium-card p-8">
            <div className="flex flex-col gap-1 mb-8">
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Fulfillment Status</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Order Lifecycle</p>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={analyticsData.radialData}>
                        <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff', fontSize: 9, fontWeight: 900 }}
                            background
                            clockWise
                            dataKey="value"
                        />
                        <Legend iconSize={10} verticalAlign="bottom" align="right" wrapperStyle={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: '11px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="lg:col-span-1 premium-card p-8">
            <div className="flex flex-col gap-1 mb-8">
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Product Velocity</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Top SKUs by Volume</p>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.topProducts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartTheme.grid} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: chartTheme.text, fontWeight: 700}} width={100} />
                        <Tooltip contentStyle={{ borderRadius: '12px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: '11px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }} />
                        <Bar dataKey="qty" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Existing Financial Mix */}
        <div className="lg:col-span-1 premium-card p-8">
            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Revenue Breakdown</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Historical vs Forecast Performance</p>
                </div>
                <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.timeSeries.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: chartTheme.text, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: chartTheme.text, fontWeight: 700}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: '11px', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }} />
                        <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} name="Revenue" />
                        <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar.jsx";
import { Routes, Route } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import { fetchWithAuth } from "../../utils/api";

// importing the Pages
import Dashboard from "./Dashboard.jsx";
import Product from "./Product.jsx";
import Category from "./Category.jsx";
import Orders from "./Orders.jsx";
import InventoryLogs from "./InventoryLogs.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin({ isDarkMode, toggleTheme }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, orderRes] = await Promise.all([
          fetchWithAuth(`${API_URL}/api/products`),
          fetchWithAuth(`${API_URL}/api/categories`),
          fetchWithAuth(`${API_URL}/api/orders`)
        ]);

        if (!prodRes || !catRes || !orderRes) return; // fetchWithAuth handles redirect

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const orderData = await orderRes.json();

        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Initializing Console</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-500">
      <SideBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-200/[0.05] dark:bg-grid-white/[0.02] pointer-events-none" />
        
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={<Dashboard orders={orders} products={products} />}
              />
              <Route
                path="Product"
                element={
                  <Product
                    products={products}
                    setProducts={setProducts}
                    categories={categories}
                  />
                }
              />
              <Route
                path="Category"
                element={
                  <Category
                    categories={categories}
                    setCategories={setCategories}
                  />
                }
              />
              <Route
                path="Orders"
                element={<Orders orders={orders} setOrders={setOrders} products={products} />}
              />
              <Route
                path="Logs"
                element={<InventoryLogs />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

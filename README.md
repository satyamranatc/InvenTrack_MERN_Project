# 📦 InvenTrack: Enterprise Inventory Intelligence

InvenTrack is a high-end, production-ready Inventory Management System built on the **MERN** stack (MongoDB, Express, React, Node.js). Designed for administrative excellence, it combines professional design with advanced data analytics and deep business intelligence.

---

## ✨ Enterprise Features

### 🧠 Intelligence Dashboard
*   **Predictive Revenue Forecasting**: Integrated Linear Regression engine to project revenue trends for the next 7 days.
*   **Anomaly Detection**: Automated Z-Score statistical analysis to identify unusual spikes or drops in performance.
*   **Reorder Intelligence**: Automated replenishment suggestions based on inventory velocity and safety stock thresholds.
*   **Cognitive Insights**: AI-driven "Smart Insights" providing actionable advice on stock health and return rates.

### 📜 Advanced Inventory Control (Beyond CRUD)
*   **Movement Ledger (Audit Logs)**: Every stock change is automatically recorded in a tamper-evident audit trail, tracking Inbound, Outbound, and Manual Adjustments.
*   **Batch & Expiry Monitoring**: Professional tracking of batch numbers and expiry dates with automatic visual warnings for expired stock.
*   **Precision Thresholds**: Individual "Low Stock" thresholds per SKU with automated priority-based alerts.
*   **Location Tracking**: Physical warehouse/shelf location management for every product.

### 🌓 Premium UX & Design
*   **OLED Dark Mode**: A "True Black" (#000000) experience designed for professional workspaces and reduced eye strain.
*   **Enterprise Typography**: Systematic high-readability fonts optimized for data-dense environments.
*   **Fluid Transitions**: Global theme switching with smooth CSS transitions and micro-animations.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Tooling**: Vite, Nodemon, Dotenv

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd InvenTrack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with MONGODB_URI and PORT
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create a .env file with VITE_API_URL
   npm run dev
   ```

4. **Seed Data (Recommended)**
   ```bash
   cd backend
   node seed.js # Populates system with realistic enterprise-scale data
   ```

---

## 🎨 Design Philosophy

InvenTrack follows the **"Aesthetics of Efficiency"**:
- **Professional Density**: High-information layouts that minimize scrolling while maintaining clarity.
- **Visual Accountability**: Using color (Indigo for primary, Rose for alerts, Emerald for success) to guide administrative decisions instantly.
- **OLED First**: Optimized for high-end displays with absolute black levels and vibrant data visualization.

---

*Built for High-Scale Inventory Management by Satyam Rana*

# 📦 InvenTrack: Enterprise Inventory Intelligence (Django + React Edition)

InvenTrack is a high-end, production-ready Inventory Management System built on a modern **Full-Stack** architecture combining the power of **Django** and **React**. Designed for administrative excellence, it pairs a robust Python backend with a high-performance React interface for advanced data analytics and business intelligence.

---

## ✨ Enterprise Features

### 🧠 Intelligence Dashboard
*   **Predictive Revenue Forecasting**: Integrated regression engine (via Python's NumPy/Scikit-Learn) to project revenue trends for the next 7 days.
*   **Anomaly Detection**: Automated statistical analysis to identify unusual spikes or drops in inventory performance.
*   **Reorder Intelligence**: Automated replenishment suggestions based on inventory velocity and safety stock thresholds.
*   **Cognitive Insights**: Django-powered analytics providing actionable advice on stock health and turnover rates.

### 📜 Advanced Inventory Control
*   **Movement Ledger (Audit Logs)**: Every stock change is automatically recorded in a Django-audited trail, tracking Inbound, Outbound, and Manual Adjustments.
*   **Django Admin Integration**: Professional-grade administrative interface for rapid data management and user authorization.
*   **Precision Thresholds**: Individual "Low Stock" thresholds per SKU with automated priority-based alerts.
*   **Relational Integrity**: Powered by PostgreSQL/SQLite with strict relational constraints for data consistency.

### 🌓 Premium UX & Design
*   **React + Vite**: Blazing fast frontend performance with hot module replacement and optimized production builds.
*   **OLED Dark Mode**: A "True Black" (#000000) experience designed for professional workspaces.
*   **Tailwind Architecture**: A systematic design system ensuring visual consistency across the entire platform.

---

## 🚀 Tech Stack

### Backend (Python/Django)
- **Framework**: Django 5.0+
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL (Recommended) or SQLite
- **Auth**: JWT (SimpleJWT) / Session Auth

### Frontend (JavaScript/React)
- **Library**: React 18+
- **Styling**: Tailwind CSS
- **Charts**: Recharts / Chart.js
- **Icons**: Lucide React

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js (v18+)
- Virtualenv or Conda

### 1. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database Migrations
python manage.py migrate
python manage.py createsuperuser  # Create admin access

# Start Server
python manage.py runserver
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
# Configure .env with VITE_API_BASE_URL=http://localhost:8000/api/
npm run dev
```

### 3. Populating Data
```bash
python manage.py seed_inventory  # Optional custom command to seed realistic data
```

---

## 🎨 Design Philosophy

InvenTrack follows the **"Aesthetics of Efficiency"**:
- **Pythonic Robustness**: Leveraging Django's ORM for complex queries and data integrity.
- **Visual Accountability**: Using color-coded alerts (Indigo, Rose, Emerald) to guide administrative decisions instantly.
- **Real-Time Data**: React-powered UI that reflects backend state changes with minimal latency.

---

*Built for High-Scale Inventory Management by Satyam Rana*

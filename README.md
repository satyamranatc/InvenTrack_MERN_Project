# 📦 InvenTrack: Enterprise Inventory Intelligence

InvenTrack is a high-end, production-ready Inventory Management System built on the **Django + React** stack. Designed for administrative excellence, it combines professional design with advanced data analytics and a robust, automated backend intelligence layer.

---

## ✨ Enterprise Features

### 🧠 Intelligence & Stock Tracking
*   **Movement Ledger (Audit Logs)**: Every stock change is automatically recorded in a tamper-evident audit trail, tracking Inbound, Outbound, and Manual Adjustments.
*   **Order Intelligence**: Creating an order automatically synchronizes with inventory, deducting stock and generating audit logs in real-time.
*   **Batch & Expiry Monitoring**: Professional tracking of batch numbers and expiry dates with automatic visual warnings for expired stock.
*   **Precision Thresholds**: Individual "Low Stock" thresholds per SKU with automated priority-based alerts.
*   **Location Tracking**: Physical warehouse/shelf location management for every product.

### 🌓 Premium UX & Design
*   **OLED Dark Mode**: A "True Black" (#000000) experience designed for professional workspaces and reduced eye strain.
*   **Enterprise Typography**: Optimized for data-dense environments using Inter and Outfit fonts.
*   **Fluid Transitions**: Global theme switching with smooth CSS transitions and micro-animations.
*   **Responsive Architecture**: Fully responsive UI built with Tailwind CSS for mobile and desktop management.

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3.9+, Django 4.2+, Django REST Framework (DRF)
- **Authentication**: JWT (SimpleJWT)
- **Database**: SQLite (Default) / PostgreSQL (Ready)
- **Storage**: Local Media serving for product images

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd InvenTrack
   ```

2. **Backend Setup (Django)**
   ```bash
   cd backend
   # It is recommended to use a virtual environment
   python3 -m venv venv
   source venv/bin/activate # Mac/Linux
   # venv\Scripts\activate # Windows
   
   pip install -r requirements.txt # Coming soon, or install manually:
   # pip install django djangorestframework django-cors-headers djangorestframework-simplejwt Pillow
   
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup (React)**
   ```bash
   cd frontend
   npm install
   # Ensure .env has VITE_API_URL=http://localhost:8000
   npm run dev
   ```

---

## 🎨 Design Philosophy

InvenTrack follows the **"Aesthetics of Efficiency"**:
- **Professional Density**: High-information layouts that minimize scrolling while maintaining clarity.
- **Visual Accountability**: Using curated color palettes (Indigo for primary, Rose for alerts, Emerald for success) to guide administrative decisions instantly.
- **OLED First**: Optimized for high-end displays with absolute black levels and vibrant data visualization.

---

*Built for High-Scale Inventory Management by Satyam Rana*

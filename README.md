# Bazaar Plaza E-Commerce Suite

**Bazaar Plaza** is a premium, offline-ready e-commerce platform designed for a high-end shopping experience. It features deep integration for **multilingual support (English, Urdu, and Roman Urdu)** and an intelligent AI assistant to guide users through their journey.

---

## 🚀 Key Features

- **Premium Catalog:** Browse a curated collection of high-quality products with real-time search and filtering.
- **AI Support Copilot:** Integrated Gemini AI assistant capable of conversing in English, Urdu, and Roman Urdu.
- **Secure Checkout Gateway:** A multi-step checkout process featuring a PCI-compliant simulation with Credit Card inputs and **Two-Factor OTP authentication**.
- **Admin Hub:** A powerful dashboard for inventory management (CRUD), sales analytics, and order tracking.
- **Offline Persistence:** All data (cart, wishlist, product changes) is saved locally in the browser, allowing for a seamless experience even without an internet connection.
- **Database Backup & Restore:** Export your entire store state to a JSON file and restore it anytime.
- **User Workspace:** Personal profiles with social login simulation (Google/GitHub/Facebook), order history, and bookmarks.
- **Dual Ambience:** Fully responsive design with dynamic Light and Dark mode support.
- **Interactive Notifications:** A robust toast system for real-time feedback on all system actions.

---

## 🛠️ Technologies Used

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion (Framer), Lucide Icons.
- **Backend:** Node.js, Express.
- **AI:** Google Gemini AI API (@google/genai).
- **Styling:** Vanilla CSS & Tailwind CSS.
- **Storage:** Browser LocalStorage for offline-first architecture.

---

## 📦 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kiranMushtaque/ecommerce-demo.git
   cd ecommerce-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 🌐 Live Demo
*(https://ecommerce-demo-umber.vercel.app/)*





---

## 👨‍💻 Developer
**Sara Ahmed**

---
© 2026 Bazaar Plaza. All Rights Reserved.

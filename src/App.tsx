import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import ShopView from "./components/ShopView";
import AdminView from "./components/AdminView";
import CheckoutView from "./components/CheckoutView";
import ProfileView from "./components/ProfileView";
import SupportChat from "./components/SupportChat";
import Notifications from "./components/Notifications";
import { ShoppingBag, ShieldAlert, BadgeInfo, Compass, Laptop, Sun, Moon, Globe, Heart, ShoppingCart, User, HelpCircle } from "lucide-react";

function MainAppLayout() {
  const {
    cart,
    wishlist,
    language,
    changeLanguage,
    theme,
    toggleTheme,
    userProfile,
    t,
  } = useApp();

  // Active Screen states: "shop" | "checkout" | "admin" | "profile"
  const [activeTab, setActiveTab] = useState<"shop" | "checkout" | "admin" | "profile">("shop");

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* HEADER SECTION NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-150 transition-colors duration-300 dark:bg-slate-950/80 dark:border-slate-955/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Brand logo details */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black dark:bg-indigo-500 shadow-md shadow-indigo-500/10">
              <ShoppingBag className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-4 dark:text-white">
                Bazaar Plaza
              </h1>
              <span className="text-[10px] font-mono font-semibold text-indigo-500 dark:text-indigo-400">
                {language === "UR"
                  ? "محفوظ ڈیجیٹل مارکیٹ"
                  : language === "ROMAN"
                    ? "Secure digital bazaar"
                    : "Bazaar Plaza - Premium E-Commerce Store"}
              </span>
            </div>
          </div>

          {/* Core Menu Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("shop")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "shop"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
              }`}
            >
              {t("shop")}
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "checkout"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
              }`}
            >
              {t("checkout")}
              {totalCartCount > 0 && (
                <span
                  className={`rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold ${
                    activeTab === "checkout"
                      ? "bg-white text-indigo-600"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
              }`}
            >
              {t("admin")}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
              }`}
            >
              {t("profile")}
              {wishlist.length > 0 && (
                <span
                  className={`rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold ${
                    activeTab === "profile"
                      ? "bg-white text-indigo-600"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {wishlist.length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick utility controls (Theme, Language, and login badges) */}
          <div className="flex items-center gap-2">
            {/* Language Selection menu */}
            <div className="relative group/lang flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl dark:bg-slate-900 dark:border-slate-800">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold outline-none text-slate-700 dark:text-slate-300 pr-1 select-none pr-3"
              >
                <option value="EN" className="dark:bg-slate-900">
                  English
                </option>
                <option value="ROMAN" className="dark:bg-slate-900">
                  Roman Urdu
                </option>
                <option value="UR" className="dark:bg-slate-900">
                  اردو
                </option>
              </select>
            </div>

            {/* Dark Mode toggle icon switch */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 rounded-xl hover:scale-105 hover:bg-slate-50 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Small avatar profile connector */}
            <button
              onClick={() => setActiveTab("profile")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-slate-200 shadow-sm hover:scale-105 cursor-pointer dark:border-slate-800"
            >
              <img
                src={
                  userProfile.isLoggedIn
                    ? userProfile.avatar
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                }
                alt="Account Identity avatar representation"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU NAV AT BOTTOM FOR EXREME MOBILE FRIENDLINESS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-250 px-4 py-2.5 flex justify-around items-center dark:bg-slate-950/95 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("shop")}
          className={`flex flex-col items-center gap-1 transition ${activeTab === "shop" ? "text-indigo-600 dark:text-indigo-400 scale-105" : "text-slate-400"}`}
        >
          <Compass className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold">{t("shop")}</span>
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`relative flex flex-col items-center gap-1 transition ${activeTab === "checkout" ? "text-indigo-600 dark:text-indigo-400 scale-105" : "text-slate-400"}`}
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold">{t("cart")}</span>
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-2 rounded-full bg-rose-500 text-white text-[8px] h-3.5 min-w-3.5 px-0.5 flex items-center justify-center font-bold">
              {totalCartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`flex flex-col items-center gap-1 transition ${activeTab === "admin" ? "text-indigo-600 dark:text-indigo-400 scale-105" : "text-slate-400"}`}
        >
          <Laptop className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold">{t("admin")}</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`relative flex flex-col items-center gap-1 transition ${activeTab === "profile" ? "text-indigo-600 dark:text-indigo-400 scale-105" : "text-slate-400"}`}
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[9px] font-bold">{t("profile")}</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 rounded-full bg-rose-500 text-white text-[8px] h-3.5 min-w-3.5 px-0.5 flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>
      </div>

      {/* CORE SCREENS LAYOUT MOUNT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-8 transition-opacity duration-300">
        {/* Offline cached notification banner */}
        <div className="mb-6 flex items-center justify-between text-[11px] bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl dark:bg-slate-900/60 dark:border-slate-800">
          <p className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
            {t("offline_badge")}
          </p>
          <p className="hidden sm:block text-slate-500">
            All modifications, orders placed, and reviews added are saved
            automatically in your offline persistence layer.
          </p>
        </div>

        {/* View Router switcher */}
        <div id="active_view_wrapper" className="min-h-[400px]">
          {activeTab === "shop" && <ShopView />}
          {activeTab === "checkout" && <CheckoutView />}
          {activeTab === "admin" && <AdminView />}
          {activeTab === "profile" && <ProfileView />}
        </div>
      </main>

      {/* FLOATING SUPPORT COPILOT & PUSH LOG TOASTS */}
      <SupportChat />
      <Notifications />

      {/* FOOTER SECTION */}
      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Bazaar Plaza
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Bazaar Plaza - Premium E-Commerce Store
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-500 max-w-md mx-auto">
            Discover quality products carefully selected to bring you the best
            shopping experience.
          </p>

          <div className="flex justify-center gap-4 text-sm text-slate-500">
            <a
              href="/shop"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Shop
            </a>
            <a
              href="/about"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              About
            </a>
            <a
              href="/contact"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Privacy Policy
            </a>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Bazaar Plaza. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}

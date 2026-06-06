import { useState, FormEvent, ChangeEvent } from "react";
import { User, Calendar, MapPin, KeyRound, Download, Upload, LogIn, Heart, ShoppingCart, LogOut, CheckCircle, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ProfileView() {
  const {
    userProfile,
    loginUser,
    logoutUser,
    updateProfileAddress,
    wishlist,
    products,
    addToCart,
    exportBackup,
    importBackup,
    t,
  } = useApp();

  const [addressInput, setAddressInput] = useState(userProfile.address || "");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleUpdateAddress = (e: FormEvent) => {
    e.preventDefault();
    updateProfileAddress(addressInput);
  };

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultData = event.target?.result as string;
      if (resultData) {
        importBackup(resultData);
      }
    };
    reader.readAsText(file);
    // Reset file element value
    e.target.value = "";
  };

  // Get wishlist items
  const wishlistItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-8 font-sans">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* PROFILE CRADENTIALS COLUMN */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={userProfile.isLoggedIn ? userProfile.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt="Avatar representation"
              referrerPolicy="no-referrer"
              className="h-20 w-20 rounded-full object-cover border-4 border-slate-900/10 dark:border-amber-500/10"
            />
            {userProfile.isLoggedIn && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-md font-bold text-slate-900 dark:text-white">
              {userProfile.isLoggedIn ? userProfile.name : "Guest Session"}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {userProfile.isLoggedIn ? userProfile.email : "Anonymous Buyer"}
            </p>
          </div>

          {userProfile.isLoggedIn ? (
            <div className="w-full space-y-2">
              <div className="rounded-lg bg-slate-50 p-2.5 text-left text-[11px] dark:bg-slate-900 border border-slate-100 dark:border-slate-900">
                <span className="text-slate-400 font-bold block uppercase">{t("login_as")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{userProfile.provider} Auth Security Link</span>
              </div>
              <button
                onClick={logoutUser}
                className="w-full rounded-xl border border-rose-200 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center justify-center gap-1.5 transition dark:border-rose-900/30 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> {t("logout")}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <p className="text-[11px] text-slate-400">Unlock complete wishlist persistence and checkout credentials pre-fills:</p>
              
              {/* Simple Login Actions */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => loginUser("Google")}
                  className="rounded-lg border border-slate-200 py-2 text-[10px] font-bold text-slate-800 bg-white hover:bg-slate-50 hover:scale-105 transition dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  Google
                </button>
                <button
                  onClick={() => loginUser("GitHub")}
                  className="rounded-lg border border-slate-200 py-2 text-[10px] font-bold text-slate-800 bg-white hover:bg-slate-50 hover:scale-105 transition dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  GitHub
                </button>
                <button
                  onClick={() => loginUser("Facebook")}
                  className="rounded-lg border border-slate-200 py-2 text-[10px] font-bold text-slate-800 bg-white hover:bg-slate-50 hover:scale-105 transition dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  Facebook
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOGISTICS ADDRESS CONFIG & OFFLINE SYSTEM DUMP BACKUPS COLUMN */}
        <div className="md:col-span-2 space-y-6">
          {userProfile.isLoggedIn && (
            <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-amber-500" /> Dispatch Delivery Locations parameters
              </h3>
              
              <form onSubmit={handleUpdateAddress} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Set your billing & logistics destination coordinates..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-905 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer"
                >
                  Update
                </button>
              </form>
            </div>
          )}

          {/* SYSTEM OFFLINE DATA COMPILATION & BACKUPS TRIGGER */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="h-4.5 w-4.5 text-emerald-500" /> Offline Database Backup sandboxes
            </h3>
            <p className="text-[11px] text-slate-400">
              Bazaar Plaza operates with persistent reactive stores. You can download a structured JSON layout copy of your database sandbox containing products, wishlists, logins, and order audit indices, and restore it offline on other platforms instantly!
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Export backup action */}
              <button
                onClick={exportBackup}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-pointer"
              >
                <Download className="h-4 w-4 text-emerald-500" /> {t("backup_button")}
              </button>

              {/* Import backup input */}
              <label className="flex-1 rounded-xl border border-dashed border-slate-350 bg-slate-50/40 hover:bg-slate-50 py-3 text-xs font-bold text-slate-600 flex items-center justify-center gap-2 cursor-pointer dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-300">
                <Upload className="h-4 w-4 text-amber-500" />
                <span>Upload Restore File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-[10px] text-slate-400 font-serif italic text-center">
              * Supports persistent JSON local storage state transfers across modern browser engines.
            </p>
          </div>
        </div>
      </div>

      {/* WISHLIST PINNED COLLECTIONS GRID */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500" /> {t("wishlist")} ({wishlistItems.length})
        </h3>
        
        {wishlistItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No pinned bookmarked interests inside your workspace database sheet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {wishlistItems.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition duration-300 flex justify-between items-center text-xs dark:border-slate-900 dark:bg-slate-900/30">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white truncate max-w-[120px]">{p.name}</h4>
                    <p className="font-mono font-bold text-slate-500">${p.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="rounded-lg bg-slate-950 text-white p-2 hover:bg-slate-900 transition dark:bg-amber-500 dark:text-slate-950 cursor-pointer"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

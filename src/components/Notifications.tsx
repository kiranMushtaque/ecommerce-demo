import { Bell, Sparkles, X, AlertTriangle, ShieldCheck, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Notifications() {
  const { notifications, clearNotifications, t } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 font-sans space-y-2">
      {/* Sliding mini alert toast container */}
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-none">
        {notifications.slice(0, 3).map((n) => (
          <div
            key={n.id}
            className={`flex gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-500 animate-bounce-subtle ${
              n.type === "success"
                ? "border-emerald-100 bg-white/95 text-slate-800 dark:border-emerald-950/40 dark:bg-slate-900/95"
                : n.type === "warning"
                ? "border-rose-100 bg-rose-50/95 text-slate-800 dark:border-rose-950/40 dark:bg-indigo-950/95"
                : "border-slate-100 bg-white/95 text-slate-800 dark:border-slate-800 dark:bg-slate-900/95"
            }`}
          >
            {/* Context Logo */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              n.type === "success"
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40"
                : n.type === "warning"
                ? "bg-rose-100 text-rose-600 dark:bg-rose-950/40"
                : "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
            }`}>
              {n.type === "success" ? (
                <ShieldCheck className="h-4.5 w-4.5" />
              ) : n.type === "warning" ? (
                <AlertTriangle className="h-4.5 w-4.5" />
              ) : (
                <Bell className="h-4.5 w-4.5" />
              )}
            </div>

            {/* Notification content */}
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-slate-950 dark:text-white flex items-center gap-1">
                  {n.title} <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                </h4>
                <span className="text-[8px] text-slate-400 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed dark:text-slate-400">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 1 && (
        <button
          onClick={clearNotifications}
          className="w-full rounded-xl bg-slate-900/90 text-white py-2 text-[10px] font-bold tracking-wider uppercase hover:bg-slate-950 transition shadow-lg backdrop-blur-sm dark:bg-slate-800"
        >
          Clear Push Center Log ({notifications.length})
        </button>
      )}
    </div>
  );
}

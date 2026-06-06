import { useState, FormEvent } from "react";
import { Plus, Trash, Edit, RefreshCw, BarChart3, ShieldCheck, CheckSquare, PlusCircle, AlertTriangle, Coins, TrendingUp, Layers } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product, Order } from "../types";

export default function AdminView() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    t,
  } = useApp();

  // Add Product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductNameUr, setNewProductNameUr] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Electronics");
  const [newProductPrice, setNewProductPrice] = useState(50);
  const [newProductStock, setNewProductStock] = useState(10);
  const [newProductImage, setNewProductImage] = useState("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80");
  const [newProductDesc, setNewProductDesc] = useState("Premium high quality durable item.");

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  // Compute live analytical statistics securely
  const totalSales = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingSales = orders
    .filter((o) => o.status !== "Delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);

  // Low Stock inventory listings
  const lowStockItems = products.filter((p) => p.stock <= 3);

  const handleCreateProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    addProduct({
      name: newProductName,
      nameUr: newProductNameUr || newProductName,
      nameRoman: newProductName,
      price: Number(newProductPrice) || 20,
      category: newProductCategory,
      categoryUr: "الیکٹرانکس",
      categoryRoman: newProductCategory,
      description: newProductDesc,
      descriptionUr: "پریمیم معیار کی عمدہ مصنوعات فروخت کے لیے پیش۔",
      descriptionRoman: newProductDesc,
      stock: Number(newProductStock) || 0,
      rating: 5.0,
      image: newProductImage || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    });

    // Reset fields
    setNewProductName("");
    setNewProductNameUr("");
    setNewProductPrice(50);
    setNewProductStock(10);
    setNewProductImage("");
    setNewProductDesc("");
    setShowAddForm(false);
  };

  const handleQuickStockUpdate = (p: Product) => {
    updateProduct({
      ...p,
      stock: editStockValue,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            Bazaar Core Admin System
          </h1>
          <p className="text-xs text-slate-500">
            Real-time catalog sync, ledger tracking, coupon records, and low level stock alert thresholds.
          </p>
        </div>

        {/* Add Product trigger */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 flex items-center gap-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 cursor-pointer self-start shadow-md shadow-indigo-600/15"
        >
          <PlusCircle className="h-4 w-4" />
          {showAddForm ? "Hide Catalog Form" : "Create New Product"}
        </button>
      </div>

      {/* STATS ANALYTICS Bento Grids */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Sales */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t("total_sales")}</span>
            <Coins className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white font-mono">
              ${totalSales.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center">
              <TrendingUp className="h-3 w-3" /> Live
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Pending: ${pendingSales.toLocaleString()}</p>
        </div>

        {/* Completed Transactions */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t("total_orders")}</span>
            <CheckSquare className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white font-mono">
              {totalOrdersCount}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total placed bills.</p>
        </div>

        {/* Total Stock Count */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t("inventory_health")}</span>
            <Layers className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white font-mono">
              {totalStockCount}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Units distributed in catalogs.</p>
        </div>

        {/* Low inventory alert notification box */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm dark:border-rose-950/20 dark:bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-500">{t("low_stock_alert")}</span>
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              {lowStockItems.length}
            </span>
          </div>
          <p className="text-[10px] text-rose-500/80 mt-1 font-semibold">
            {lowStockItems.length > 0 ? "Needs immediate restock attention!" : "All stocks safe!"}
          </p>
        </div>
      </div>

      {/* DYNAMIC PURE SVG SALES ANALYTICS CHART BLOCK */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-amber-500" /> Hourly Audit Sales Chart
        </h3>
        
        {/* Simple responsive interactive block showing order volumes bar chart */}
        <div className="h-40 w-full flex items-end gap-1.5 pt-4 border-b border-slate-100 dark:border-slate-900">
          {products.map((p) => {
            const productSalesCount = orders
              .flatMap((o) => o.items)
              .filter((item) => item.product.id === p.id)
              .reduce((sum, item) => sum + item.quantity, 0);

            const heightPct = Math.min(100, Math.max(10, (productSalesCount * 25) || 5));
            return (
              <div key={p.id} className="group flex flex-col items-center flex-1 h-full justify-end cursor-pointer">
                <span className="text-[9px] font-bold text-slate-500 scale-90 mb-1 font-mono transition group-hover:text-amber-500">
                  {productSalesCount}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    productSalesCount > 0
                      ? "bg-slate-900 group-hover:bg-amber-500 dark:bg-amber-500 dark:group-hover:bg-amber-400"
                      : "bg-slate-200/60 dark:bg-slate-800"
                  }`}
                ></div>
                <span className="text-[8px] truncate mt-1 text-slate-400 text-center w-full block">
                  {p.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-right italic font-mono">
          * Unit Quantity Sold index across catalog
        </p>
      </div>

      {/* ADD NEW PRODUCT FORM DRAWER */}
      {showAddForm && (
        <form onSubmit={handleCreateProduct} className="rounded-2xl border border-slate-150 bg-slate-50 p-6 space-y-4 dark:border-slate-800 dark:bg-slate-900/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Catalog Product Listing</h3>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Product Name (EN)</label>
              <input
                type="text"
                required
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="e.g. Smart Watch Active"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Product Name (URDU)</label>
              <input
                type="text"
                value={newProductNameUr}
                onChange={(e) => setNewProductNameUr(e.target.value)}
                placeholder="صرف اردو میں نام لکھیں"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white text-right"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category Select</label>
              <select
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Initial Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Photo Image URL (Unsplash Link preferred)</label>
              <input
                type="text"
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">General Description</label>
              <textarea
                value={newProductDesc}
                onChange={(e) => setNewProductDesc(e.target.value)}
                rows={2}
                placeholder="Short attractive details description..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition shadow-md shadow-indigo-600/15"
          >
            Authorize & Submit Product Listing
          </button>
        </form>
      )}

      {/* PRODUCT LIST GRID WITH EDIT CONTROLS */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Interactive Product Inventory Registry</h3>
        <p className="text-[11px] text-slate-400">View current stock levels. Adjust stocks directly to alert buyers instant inventory updates.</p>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-900">
          <table className="w-full border-collapse text-left text-xs bg-white dark:bg-slate-950">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Photo / Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-slate-900 dark:text-white font-semibold">${p.price}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="number"
                          value={editStockValue}
                          onChange={(e) => setEditStockValue(Number(e.target.value))}
                          className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                        />
                        <button
                          onClick={() => handleQuickStockUpdate(p)}
                          className="rounded-lg bg-emerald-500 text-white p-1 hover:bg-emerald-600 cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] ${
                        p.stock <= 3
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      }`}>
                        {p.stock} units
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditStockValue(p.stock);
                        }}
                        title="Edit Stock"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        title="Delete Product"
                        className="rounded-lg border border-slate-200 p-1.5 text-rose-500 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-900/30 cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPATCH ORDER SHIPMENTS CONTROL LEDGER */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Core Shipment dispatch ledger</h3>
        <p className="text-[11px] text-slate-400">View incoming sales checkout bills. Control tracking states in order success indicators.</p>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No checkout orders placed in secure session ledger yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs space-y-2 dark:border-slate-900 dark:bg-slate-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Order {o.id}</span>
                    <span className="text-[10px] text-slate-400">({o.date})</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">
                    Shipment destination: <span className="font-sans font-medium text-slate-800 dark:text-slate-300">{o.shippingAddress}</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[10px] text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                        {item.product.name} (x{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className="font-black text-slate-900 dark:text-white font-mono">${o.total}</span>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-amber-400"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

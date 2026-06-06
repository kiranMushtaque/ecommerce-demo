import { useState } from "react";
import { Search, ShoppingCart, Heart, Star, LayoutGrid, Check, Eye, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";

export default function ShopView() {
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    language,
    t,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState("");

  const categories = ["All", "Electronics", "Fashion", "Sports", "Home & Living"];

  // Filter products by searching query and selected category
  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
    
    // Choose appropriate name/desc for language filter
    const lowerSearch = search.toLowerCase();
    const nameMatch =
      p.name.toLowerCase().includes(lowerSearch) ||
      p.nameUr.toLowerCase().includes(lowerSearch) ||
      p.nameRoman.toLowerCase().includes(lowerSearch);

    return categoryMatch && nameMatch;
  });

  const getLocalizedName = (p: Product) => {
    if (language === "UR") return p.nameUr;
    if (language === "ROMAN") return p.nameRoman;
    return p.name;
  };

  const getLocalizedDesc = (p: Product) => {
    if (language === "UR") return p.descriptionUr;
    if (language === "ROMAN") return p.descriptionRoman;
    return p.description;
  };

  const getLocalizedCategory = (p: Product) => {
    if (language === "UR") return p.categoryUr;
    if (language === "ROMAN") return p.categoryRoman;
    return p.category;
  };

  const handleSubmitReview = (productId: number) => {
    if (!userComment.trim()) return;
    addReview(productId, userRating, userComment);
    setUserComment("");
    setUserRating(5);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Jumbotron Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 dark:bg-slate-950">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-amber-500 opacity-10 blur-3xl"></div>
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            Bazaar Plaza - Premium E-Commerce Store
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {language === "UR" ? (
              "خالص معیار اور پائیداری کے ساتھ نئی شاپنگ کارٹ"
            ) : language === "ROMAN" ? (
              "Premium quality aur behtreen discount offers!"
            ) : (
              "Bazaar Premium Curated Collections"
            )}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === "UR"
              ? "مفت ہوم ڈلیوری اور ۳۰ دن کی واپسی کی مکمل گارنٹی۔ کسٹمرز پہلے آئیں اب شاپنگ کریں۔"
              : "Enjoy nation-wide swift logistics dispatch, interactive security codes verification, and offline-persistent data architecture."}
          </p>
          <div className="pt-2 text-[11px] font-mono text-amber-400">
            ⚡ Use code: <span className="underline font-bold text-white">WELCOME50</span> for flat 50% discount!
          </div>
        </div>
      </div>

      {/* Searching filters and Category Toggles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-150 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-400"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all duration-200 ${
                selectedCategory === c
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {c === "All" ? t("category_all") : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Collections displaying products */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-350 dark:bg-slate-950 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500">No items match your filters.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting category or search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => {
            const reviewsCount = reviews.filter((r) => r.productId === p.id).length;
            const isBookmarked = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
              >
                {/* Images Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category overlay */}
                  <span className="absolute left-3.5 top-3.5 rounded-lg bg-slate-900/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm dark:bg-black/70">
                    {getLocalizedCategory(p)}
                  </span>
                  {/* Stock counter indicators */}
                  {p.stock <= 3 && p.stock > 0 ? (
                    <span className="absolute right-3.5 top-3.5 rounded-lg bg-rose-500 px-2.5 py-1 text-[9px] font-bold text-white flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="h-3 w-3" /> Low Stock ({p.stock})
                    </span>
                  ) : p.stock === 0 ? (
                    <span className="absolute right-3.5 top-3.5 rounded-lg bg-slate-700 px-2.5 py-1 text-[9px] font-bold text-white">
                      {t("out_of_stock")}
                    </span>
                  ) : null}
                </div>

                {/* Details text area */}
                <div className="flex flex-col gap-2 p-5 flex-grow">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{p.rating}</span>
                      <span className="text-[10px] font-normal text-slate-400">({reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white line-clamp-1">
                    {getLocalizedName(p)}
                  </h3>

                  <p className="text-[11px] text-slate-500 leading-relaxed dark:text-slate-400 line-clamp-2">
                    {getLocalizedDesc(p)}
                  </p>
                </div>

                {/* Pricing & Checkout action buttons */}
                <div className="flex items-center justify-between border-t border-slate-50 p-5 pt-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950">
                  <span className="text-base font-black text-slate-950 dark:text-white font-mono">
                    ${p.price.toLocaleString()}
                  </span>

                  <div className="flex gap-1.5">
                    {/* View details button */}
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setUserComment("");
                      }}
                      title="Quick View"
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Bookmark toggler */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      title="Bookmark"
                      className={`rounded-xl border p-2 transition ${
                        isBookmarked
                          ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900/30 dark:bg-rose-950/20"
                          : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>

                    {/* Basket action */}
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock <= 0}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition ${
                        p.stock <= 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900 dark:text-slate-600"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md shadow-indigo-600/10 cursor-pointer"
                      }`}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {p.stock <= 0 ? t("out_of_stock") : t("add_to_cart")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK VIEW & DETAILED REVIEW SUBMISSION MODAL AT WORK */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            {/* Header / close action */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-amber-500" />
                {t("shop")} - Product Profile
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
              {/* Product Layout structure */}
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="w-full sm:w-1/2 aspect-video rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <span className="rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-2 py-1 text-[10px] font-semibold">
                    {getLocalizedCategory(selectedProduct)}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {getLocalizedName(selectedProduct)}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                    {getLocalizedDesc(selectedProduct)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-950 dark:text-white font-mono">
                      ${selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {t("inventory")}: <span className="font-bold text-slate-700 dark:text-amber-400">{selectedProduct.stock}</span> units
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 transition"
                  >
                    Add to Shop Basket
                  </button>
                </div>
              </div>

              {/* REVIEWS ARCHIVE SECTION & STATS */}
              <div className="border-t border-slate-100 pt-6 space-y-4 dark:border-slate-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("reviews")} ({reviews.filter((r) => r.productId === selectedProduct.id).length})
                </h4>

                {/* List Review items */}
                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {reviews
                    .filter((r) => r.productId === selectedProduct.id)
                    .map((r) => (
                      <div key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{r.userName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mt-1 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-current" />
                          ))}
                        </div>
                        <p className="text-slate-600 mt-1 dark:text-slate-400 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}

                  {reviews.filter((r) => r.productId === selectedProduct.id).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No reviews compiled for this item yet. Be the first!</p>
                  )}
                </div>

                {/* FORM ALLOWING USER COMMENTS TO BE PUBLISHED REALTIME */}
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{t("write_review")}</h4>
                  
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Your Rating:</span>
                    <div className="flex gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="hover:scale-110 cursor-pointer text-amber-500"
                        >
                          <Star className={`h-4.5 w-4.5 ${userRating >= star ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Share your experience honestly..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        handleSubmitReview(selectedProduct.id);
                      }}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition"
                    >
                      {t("submit_review")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

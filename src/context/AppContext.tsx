import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Product,
  CartItem,
  Review,
  Coupon,
  UserProfile,
  Order,
  AppLanguage,
  AppTheme,
  PushNotification,
} from "../types";
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_REVIEWS } from "../data/initialProducts";

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  coupons: Coupon[];
  reviews: Review[];
  userProfile: UserProfile;
  orders: Order[];
  language: AppLanguage;
  theme: AppTheme;
  notifications: PushNotification[];
  activeCoupon: Coupon | null;
  t: (key: string) => string;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  applyCouponCode: (code: string) => boolean;
  removeCouponCode: () => void;
  addReview: (productId: number, rating: number, comment: string) => void;
  loginUser: (provider: UserProfile["provider"], name?: string, email?: string) => void;
  logoutUser: () => void;
  updateProfileAddress: (address: string) => void;
  submitOrder: (paymentMethod: string, address: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  toggleTheme: () => void;
  changeLanguage: (lang: AppLanguage) => void;
  addNotification: (title: string, message: string, type: PushNotification["type"]) => void;
  clearNotifications: () => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Localized translation matrices
const languageStrings: Record<AppLanguage, Record<string, string>> = {
  EN: {
    shop: "Bazaar Products",
    admin: "Admin Hub",
    profile: "User Workspace",
    wishlist: "Bookmark Wishlist",
    cart: "Cart Basket",
    support: "AI Assistant Help",
    checkout: "Secure Checkout Gateway",
    add_to_cart: "Add to Basket",
    out_of_stock: "Sold Out",
    search_placeholder: "Search our active collections...",
    category_all: "Show All Items",
    inventory: "Physical Stock Units",
    reviews: "Trust Reviews",
    write_review: "Add Authentic Feedback",
    submit_review: "Publish Review",
    checkout_summary: "Review Checkout Summary",
    subtotal: "Subtotal Value",
    discount: "Discount Code Savings",
    total: "Grand Payable Total",
    apply_coupon: "Validate Promotion Code",
    place_order: "Verify & Securely Pay",
    order_tracked: "Order Tracked Successfully!",
    order_status: "Processing Action Status",
    low_stock_alert: "Low Stock Inventory Warning!",
    offline_badge: "Offline Sandbox Active",
    backup_button: "Generate JSON Backup Export",
    restore_button: "Restore Database Sandbox",
    notification_title: "Active Push Center",
    dark_mode: "Toggle Ambience Contrast",
    quick_stats: "Analytics Performance Indicators",
    total_sales: "Gross Digital Sales",
    total_orders: "Completed Transactions",
    customer_ratings: "Average Customer Sentiment",
    inventory_health: "Catalog Stock items",
    recent_transactions: "Live Store Audit Log",
    coupon_valid_msg: "Promo code validated! Save {percent}% on checkout.",
    login_as: "Signed in securely as",
    logout: "Exit Account",
    simulate_social: "Secure Social Sign-In Mock"
  },
  UR: {
    shop: "مصنوعاتِ بازار",
    admin: "ایڈمن پینل",
    profile: "سرگرمی ہب",
    wishlist: "میری پسندیدہ اشیاء",
    cart: "خریداری ٹوکری",
    support: "اے آئی گائیڈ چیٹ",
    checkout: "محفوظ چیک آؤٹ",
    add_to_cart: "ٹوکری میں ڈالیں",
    out_of_stock: "اسٹاک ختم ہو گیا",
    search_placeholder: "ہمارے کیٹلاگ میں تلاش کریں...",
    category_all: "تمام کیٹیگریز",
    inventory: "دستیاب اسٹاک مینو",
    reviews: "گاہکوں کے مستند تبصرے",
    write_review: "اپنی مخلص رائے شامل کریں",
    submit_review: "رائے شائع کریں",
    checkout_summary: "آرڈر بل کی تفصیل",
    subtotal: "کل رقم",
    discount: "رعایتی کوپن بچت",
    total: "کل واجب الادا رقم",
    apply_coupon: "پرومو کوڈ لاگو کریں",
    place_order: "تصدیق اور بل ادا کریں",
    order_tracked: "آرڈر کامیابی سے بک ہو گیا!",
    order_status: "آرڈر کی حالت",
    low_stock_alert: "اسٹاک ختم ہونے کا خطرہ!",
    offline_badge: "آف لائن لوکل ڈیٹا فعال ہے",
    backup_button: "سلوشن بیک اپ ڈاؤن لوڈ کریں",
    restore_button: "سسٹم ری اسٹور کریں",
    notification_title: "پش نوٹیفیکیشن سینٹر",
    dark_mode: "سیاہ/سفید تھیم تبدیل کریں",
    quick_stats: "کاروباری تجزیات کا گراف",
    total_sales: "مجموعی کمائی",
    total_orders: "کامیاب آرڈرز تعداد",
    customer_ratings: "صارفین کا اوسط جوائے",
    inventory_health: "موجود کل ڈبہ اسٹاک",
    recent_transactions: "لائیو خریداری آڈٹ لاگ",
    coupon_valid_msg: "مبارک ہو! پرومو کامیابی سے چالو۔ {percent}% رعایت۔",
    login_as: "محفوظ طریقے سے لاگ ان بذریعہ",
    logout: "اکاؤنٹ سے باہر نکلیں",
    simulate_social: "سوشل لاگ ان کی نقل کریں"
  },
  ROMAN: {
    shop: "Bazaar Products",
    admin: "Admin Hub",
    profile: "Apka Account",
    wishlist: "Wishlist Folder",
    cart: "Basket Me",
    support: "AI Chat Assistant",
    checkout: "Secure Checkout Flow",
    add_to_cart: "Basket me Dalein",
    out_of_stock: "Khatam Stock",
    search_placeholder: "Items talaash karein...",
    category_all: "Dikhayein Sab",
    inventory: "Physical Stock Units",
    reviews: "Trust Reviews",
    write_review: "Feedback likhein",
    submit_review: "Review Publish Karein",
    checkout_summary: "Checkout Summary Details",
    subtotal: "Subtotal Value",
    discount: "Discount Code",
    total: "payable Grand Total",
    apply_coupon: "Promo code Apply Karein",
    place_order: "Aadigi Karein & Secure Checkout",
    order_tracked: "Order book ho chuka hai!",
    order_status: "Order Status Check",
    low_stock_alert: "Kam Stock Alert!",
    offline_badge: "Offline Status Ready",
    backup_button: "JSON File Backup lein",
    restore_button: "Dump Backup Restore Karein",
    notification_title: "Active Notifications Log",
    dark_mode: "Theme Style Toggle",
    quick_stats: "Analytics Performance indicators",
    total_sales: "Gross sales",
    total_orders: "Completed Orders",
    customer_ratings: "Average customer Rating",
    inventory_health: "Full Stock Count",
    recent_transactions: "Live Store Audit Log",
    coupon_valid_msg: "Coupon lag gya! {percent}% bachat check kijiye.",
    login_as: "Log in Status",
    logout: "Log Out Account",
    simulate_social: "Social Media sign-in option"
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialization of states, loading from LocalStorage for durable offline support!
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("bazaar_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("bazaar_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("bazaar_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("bazaar_coupons");
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("bazaar_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("bazaar_user");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Kiran khan",
          email: "kiran99@gmail.com",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          address: "124-B Mall Road, Lahore, Pakistan",
          isLoggedIn: true,
          provider: "Google",
        };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("bazaar_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("bazaar_language");
    return (saved as AppLanguage) || "EN";
  });

  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem("bazaar_theme");
    return (saved as AppTheme) || "dark";
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem("bazaar_notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "init1",
        title: "Khush Amdeed / Welcome!",
        message: "Welcome to Bazaar Plaza! Explore our premium items, try WELCOME50 for massive discounts, and ask our AI Copilot support for help.",
        type: "success",
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem("bazaar_active_coupon");
    return saved ? JSON.parse(saved) : null;
  });

  // Track state transfers to sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("bazaar_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("bazaar_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bazaar_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("bazaar_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("bazaar_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("bazaar_user", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("bazaar_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("bazaar_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("bazaar_theme", theme);
    // Apply dark class to html document
    const rootEl = window.document.documentElement;
    if (theme === "dark") {
      rootEl.classList.add("dark");
    } else {
      rootEl.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("bazaar_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("bazaar_active_coupon", JSON.stringify(activeCoupon));
  }, [activeCoupon]);

  // Translate helper function
  const t = (key: string): string => {
    const section = languageStrings[language];
    return section[key] || languageStrings["EN"][key] || key;
  };

  // Push notifications generator helper
  const addNotification = (title: string, message: string, type: PushNotification["type"]) => {
    const newNotif: PushNotification = {
      id: "notif_" + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Admin controls
  const addProduct = (productData: Omit<Product, "id">) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = { ...productData, id: newId };
    setProducts((prev) => [...prev, newProduct]);
    addNotification("Product Added", `New item "${newProduct.name}" posted successfully in our active database catalog!`, "success");
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    addNotification("Stock Updated", `"${updatedProduct.name}" details and stock counts synchronized to live clients!`, "info");
    
    // Check for low inventory thresholds
    if (updatedProduct.stock <= 3 && updatedProduct.stock > 0) {
      addNotification("Low Stock Danger", `Item "${updatedProduct.name}" is dropping fast! Only ${updatedProduct.stock} items left in storage grid!`, "warning");
    }
  };

  const deleteProduct = (id: number) => {
    const victim = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (victim) {
      addNotification("Product Deleted", `"${victim.name}" was permanently removed from listings directory.`, "info");
    }
  };

  // Cart Management
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      addNotification("Sold Out Error", `"${product.name}" is currently sold out! Cant add to Basket.`, "warning");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Prevent exceeding inventory limits
        if (existing.quantity >= product.stock) {
          addNotification("Quantity Exceeded", `Only ${product.stock} units are physically stored in warehouse. Limit reached!`, "warning");
          return prev;
        }
        addNotification("Linked Cart Updated", `Increased "${product.name}" quantity to ${existing.quantity + 1}.`, "info");
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addNotification("Item Added To Cart", `"${product.name}" placed in secure cart basket.`, "success");
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addNotification("Cart Updated", "Item ejected from checkout bag.", "info");
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    const productDef = products.find((p) => p.id === productId);
    if (!productDef) return;

    if (quantity > productDef.stock) {
      addNotification("Insufficient Warehouse Stock", `Warehouse holds only ${productDef.stock} total items.`, "warning");
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist controls
  const toggleWishlist = (productId: number) => {
    const item = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addNotification("Wishlist Updated", `"${item?.name}" removed from wish interest sheet.`, "info");
        return prev.filter((id) => id !== productId);
      } else {
        addNotification("Added to Favourites", `"${item?.name}" pinned to bookmarks successfully!`, "success");
        return [...prev, productId];
      }
    });
  };

  // Applying promo action
  const applyCouponCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode);
    if (found) {
      setActiveCoupon(found);
      addNotification("Coupon Approved", `Promo "${found.code}" active! Enjoy flat ${found.discountPercent}% instant discount.`, "success");
      return true;
    }
    addNotification("Coupon Refused", "Promo code invalid, expired, or mismatch.", "warning");
    return false;
  };

  const removeCouponCode = () => {
    setActiveCoupon(null);
    addNotification("Coupon Reset", "Promotion code disengaged from checkout.", "info");
  };

  // Review publish action
  const addReview = (productId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: "rev_" + Date.now(),
      productId,
      userName: userProfile.isLoggedIn ? userProfile.name : "Anonymous Buyer",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews((prev) => [newReview, ...prev]);
    addNotification("Review Published", `Rating review for product pushed successfully. Thanks for your support!`, "success");
  };

  // Profile operations
  const loginUser = (provider: UserProfile["provider"], name?: string, email?: string) => {
    const selectedName = name || (provider === "Google" ? "Kiran Mushtaque" : provider === "GitHub" ? "Dev Kiran" : "Facebook VIP Guest");
    const selectedEmail = email || "kiranmushtaque373@gmail.com";
    const selectedAvatar =
      provider === "Google"
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        : provider === "GitHub"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80";

    setUserProfile({
      name: selectedName,
      email: selectedEmail,
      avatar: selectedAvatar,
      address: userProfile.address,
      isLoggedIn: true,
      provider,
    });
    addNotification("Identity Verified", `Logged in successfully via secure ${provider} provider gateway. Welcome, ${selectedName}!`, "success");
  };

  const logoutUser = () => {
    setUserProfile({
      name: "",
      email: "",
      avatar: "",
      address: "",
      isLoggedIn: false,
      provider: "None",
    });
    addNotification("Disconnected Session", "Safely logged out of account portal session.", "info");
  };

  const updateProfileAddress = (address: string) => {
    setUserProfile((prev) => ({ ...prev, address }));
  };

  // Complete Placement of secure checkout orders
  const submitOrder = (paymentMethod: string, address: string): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const finalTotal = subtotal - discountAmount;

    const newOrder: Order = {
      id: "ORDER_" + Math.floor(Math.random() * 900000 + 100000),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      shippingAddress: address || userProfile.address || "124-B Mall Road, Lahore",
      paymentMethod,
      status: "Processing",
      date: new Date().toLocaleDateString(),
      couponCode: activeCoupon?.code,
    };

    // Deduct physical inventory stock securely
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          const updatedStock = Math.max(0, p.stock - cartMatch.quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveCoupon(null);

    addNotification(
      "Secure Receipt Issued",
      `Order #${newOrder.id} authorized through encrypted gateway using ${paymentMethod}. Paid $${finalTotal}.`,
      "success"
    );

    // Simulate standard outbound SMS/Email notification popping up in 4 seconds
    setTimeout(() => {
      addNotification(
        "Shipping Handshake",
        `Order ${newOrder.id} packed. Courier handoff scheduled for logistics dispatch within Mall Road corridors.`,
        "info"
      );
    }, 4000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addNotification("Logistics Dispatched", `Order #${orderId} status updated to: ${status}`, "info");
  };

  // Ambience themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const changeLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    addNotification("Language Set", `Translations switched cleanly to ${lang} environment settings context!`, "info");
  };

  // Export fully serialized file content JSON to disk for offline backup!
  const exportBackup = () => {
    try {
      const dump = {
        products,
        cart,
        wishlist,
        coupons,
        reviews,
        userProfile,
        orders,
        language,
        theme,
        notifications,
      };
      
      const fileData = JSON.stringify(dump, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BAZAAR_SUITE_BACKUP_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification("Cloud Backup Generated", "Local databases compiled into direct-download serialized JSON backup file.", "success");
    } catch (e: any) {
      addNotification("Backup Failed", "Unable to compile databases securely.", "warning");
    }
  };

  // Restore client JSON database dump cleanly into context state
  const importBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Verification checkpoints
      if (parsed.products) setProducts(parsed.products);
      if (parsed.cart) setCart(parsed.cart);
      if (parsed.wishlist) setWishlist(parsed.wishlist);
      if (parsed.coupons) setCoupons(parsed.coupons);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.userProfile) setUserProfile(parsed.userProfile);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.language) setLanguage(parsed.language);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.notifications) setNotifications(parsed.notifications);

      addNotification("Dump Restored Successfully", "Local sandbox indexes overwritten and updated from backup file.", "success");
      return true;
    } catch (e: any) {
      addNotification("Restore Denied", "Selected file exhibits corrupt scheme or formatting anomalies.", "warning");
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        coupons,
        reviews,
        userProfile,
        orders,
        language,
        theme,
        notifications,
        activeCoupon,
        t,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        applyCouponCode,
        removeCouponCode,
        addReview,
        loginUser,
        logoutUser,
        updateProfileAddress,
        submitOrder,
        updateOrderStatus,
        toggleTheme,
        changeLanguage,
        addNotification,
        clearNotifications,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider wrapper");
  }
  return context;
}

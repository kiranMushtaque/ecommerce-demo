import { useState, useEffect, FormEvent } from "react";
import { CreditCard, Truck, Receipt, CheckCircle, ShieldAlert, ArrowRight, ArrowLeft, RefreshCw, KeyRound, Ticket } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function CheckoutView() {
  const {
    cart,
    activeCoupon,
    applyCouponCode,
    removeCouponCode,
    userProfile,
    submitOrder,
    orders,
    addNotification,
    language,
    t,
  } = useApp();

  // Wizard active step state: 1 = Address/Basket, 2 = CreditCard payment, 3 = Success/Receipt
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(userProfile.address || "");
  const [couponInput, setCouponInput] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Credit Card state variables
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(userProfile.name || "Kiran Mushtaque");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardBrand, setCardBrand] = useState<"Visa" | "MasterCard" | "Amex" | "Unknown">("Unknown");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Two-Factor Verification states
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [userOTPField, setUserOTPField] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState("");

  // Subtotal parameters
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalPayable = subtotal - discountAmount;

  // Track and identify Credit Card logo brand pattern
  useEffect(() => {
    const rawDigits = cardNumber.replace(/\D/g, "");
    if (rawDigits.startsWith("4")) {
      setCardBrand("Visa");
    } else if (rawDigits.startsWith("5") || rawDigits.startsWith("2")) {
      setCardBrand("MasterCard");
    } else if (rawDigits.startsWith("3")) {
      setCardBrand("Amex");
    } else {
      setCardBrand("Unknown");
    }
  }, [cardNumber]);

  // Handle countdown triggers in active OTP verification
  useEffect(() => {
    let interval: any;
    if (showOTPDialog && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setShowOTPDialog(false);
      addNotification("OTP Expired", "Double-check credit security details and retry verification workflow.", "warning");
    }
    return () => clearInterval(interval);
  }, [showOTPDialog, otpTimer]);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCouponCode(couponInput);
    if (success) setCouponInput("");
  };

  const cleanAndFormatCard = (val: string) => {
    const numbersOnly = val.replace(/\D/g, "");
    const trimmed = numbersOnly.substring(0, 16);
    const parts = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      parts.push(trimmed.substring(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  const cleanAndFormatExpiry = (val: string) => {
    const numbersOnly = val.replace(/\D/g, "");
    const trimmed = numbersOnly.substring(0, 4);
    if (trimmed.length >= 3) {
      setCardExpiry(`${trimmed.substring(0, 2)}/${trimmed.substring(2, 4)}`);
    } else {
      setCardExpiry(trimmed);
    }
  };

  // Launch simulated payment check & OTP generation
  const handleInitiateGatewayTransaction = (e: FormEvent) => {
    e.preventDefault();
    const cleanCardStr = cardNumber.replace(/\s+/g, "");
    if (cleanCardStr.length < 13) {
      addNotification("Payment Error", "Credit Card parameter length appears incomplete.", "warning");
      return;
    }
    if (!cardName.trim()) {
      addNotification("Payment Error", "Cardholder initials required for authorization.", "warning");
      return;
    }
    if (cardCVV.length < 3) {
      addNotification("Payment Error", "Security Card Verification Code is required.", "warning");
      return;
    }

    setPaymentLoading(true);

    setTimeout(() => {
      // Create random 5 digit OTP code securely
      const randomOTP = Math.floor(Math.random() * 90000 + 10000).toString();
      setGeneratedOTP(randomOTP);
      setOtpTimer(60);
      setUserOTPField("");
      setOtpError("");
      setPaymentLoading(false);
      setShowOTPDialog(true);

      // Instantly dispatch SMS push notification
      addNotification(
        "Secure OTP Dispatched",
        `ALERT: Bazaar Plaza security validator code is [${randomOTP}] to authorize charge of $${totalPayable}.`,
        "success"
      );
    }, 1500);
  };

  // Confirm OTP validation matches and authorize order insertion
  const handleVerify2FADialog = () => {
    if (userOTPField === generatedOTP) {
      setShowOTPDialog(false);
      const paymentBrandStr = `${cardBrand} (Ending in *${cardNumber.slice(-4)})`;
      const finalOrder = submitOrder(paymentBrandStr, address);
      setPlacedOrder(finalOrder);
      setStep(3);
    } else {
      setOtpError("Incorrect verification digits. Verify code and try again.");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Step Progress indicators */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4 dark:bg-slate-900/40 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            step >= 1 ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white" : "bg-slate-200 text-slate-500"
          }`}>1</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery details</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200 flex-1 mx-3 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            step >= 2 ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white" : "bg-slate-200 text-slate-500"
          }`}>2</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Gateway billing</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200 flex-1 mx-3 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            step === 3 ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white" : "bg-slate-200 text-slate-500"
          }`}>3</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Tracking Receipt</span>
        </div>
      </div>

      {/* STAGE 1 : Address / Basket checks */}
      {step === 1 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Basket items listing details */}
          <div className="md:col-span-2 rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-amber-500" /> Deliver Destination Logistics Address
            </h3>

            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase text-slate-400">Home/Office Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Type your complete corridor street delivery destination details..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              ></textarea>
              <p className="text-[10px] text-slate-400">Pre-filled automatically from your secure workspace parameters.</p>
            </div>

            {/* Cart summary checklist */}
            <div className="border-t border-slate-100 pt-4 space-y-3 dark:border-slate-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cart Basket Checkout List</h4>
              {cart.length === 0 ? (
                <p className="text-xs text-rose-500 italic">Basket is empty! Add products to basket from Bazaar shop.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 dark:bg-slate-900/30 dark:border-slate-900 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{item.product.name}</span>
                        <span className="ml-2 text-[10px] text-slate-400">x{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 dark:text-amber-400">${item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Summary Side column containing PROMO CODE validate fields */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("checkout_summary")}</h3>
            
            <div className="space-y-2 border-b border-slate-100 pb-4 text-xs dark:border-slate-900">
              <div className="flex justify-between">
                <span className="text-slate-500">{t("subtotal")}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${subtotal}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>{t("discount")} ({activeCoupon.code})</span>
                  <span className="font-mono">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Logistics Shipping</span>
                <span className="text-emerald-500 font-bold text-[10px] uppercase">Free Shipping</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-slate-950 dark:text-white">
              <span>{t("total")}</span>
              <span className="font-mono">${totalPayable}</span>
            </div>

            {/* Coupons apply box */}
            {activeCoupon ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-990/30 flex justify-between items-center">
                <p className="flex items-center gap-1.5 font-semibold">
                  <Ticket className="h-4 w-4 shrink-0" />
                  Promo Active: {activeCoupon.code}
                </p>
                <button
                  onClick={removeCouponCode}
                  className="p-1 rounded bg-white font-bold text-rose-500 text-[10px] uppercase shadow-sm cursor-pointer hover:bg-rose-50"
                >
                  Clear
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder={t("apply_coupon")}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-indigo-550"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white cursor-pointer"
                >
                  OK
                </button>
              </form>
            )}

            <button
              onClick={() => {
                if (!address.trim()) {
                  addNotification("Address Error", "Please provide a delivery address before checkout.", "warning");
                  return;
                }
                if (cart.length === 0) {
                  addNotification("Basket Empty", "Unable to proceed with empty cart values.", "warning");
                  return;
                }
                setStep(2);
              }}
              disabled={cart.length === 0}
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
            >
              Confirm Addresses & Proceed <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2 : Interactive Credit Card payment gate */}
      {step === 2 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Visa Card Layout styling based on digits typed */}
          <div className="flex flex-col justify-center items-center">
            <div className={`relative h-44 w-72 rounded-2xl p-5 text-white shadow-2xl flex flex-col justify-between transition-all duration-500 ${
              cardBrand === "Visa"
                ? "bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600"
                : cardBrand === "MasterCard"
                ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"
                : cardBrand === "Amex"
                ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800"
                : "bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700"
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] tracking-widest text-slate-350 uppercase">Bazaar Secure Premium Card</p>
                  <p className="text-lg font-black tracking-tight mt-1">{cardBrand}</p>
                </div>
                <CreditCard className="h-7 w-7 text-white/80" />
              </div>

              <div className="text-sm font-semibold tracking-widest font-mono text-center my-3 text-white/95">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <div>
                  <p className="text-slate-300 uppercase scale-90 -ml-1">Cardholder Name</p>
                  <p className="font-semibold text-white uppercase">{cardName || "KIRAN MUSHTAQUE"}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-300 uppercase scale-90 -mr-1">Expiry</p>
                  <p className="font-semibold text-white font-mono">{cardExpiry || "MM/YY"}</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
              🔐 Encrypted 256-Bit SSL Handshake Active
            </p>
          </div>

          {/* Secure interactive Form variables */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <form onSubmit={handleInitiateGatewayTransaction} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Secure PCI Credit Gateway</h3>
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Credit Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => cleanAndFormatCard(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Cardholder Initials</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="KIRAN MUSHTAQUE"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Valid Till Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => cleanAndFormatExpiry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-center font-mono focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">CVV / CVN</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").substring(0,4))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-center font-mono focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 font-bold transition flex items-center gap-1 cursor-pointer text-xs"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
                >
                  {paymentLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Verifying encrypted link...
                    </>
                  ) : (
                    <>
                      Authorize Encrypted Payment <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TWO-FACTOR OTP POPUP VERIFICATION WINDOW */}
      {showOTPDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40">
              <KeyRound className="h-6 w-6 stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorized Multi-Factor verification</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed dark:text-slate-400">
                A verification passcode has been dispatched via secure push channels to your current session registry.
              </p>
            </div>

            {/* OTP input action */}
            <div className="space-y-3">
              <input
                type="text"
                maxLength={5}
                placeholder="Ex. 48392"
                value={userOTPField}
                onChange={(e) => setUserOTPField(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-lg font-black tracking-widest text-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />

              {otpError && (
                <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 justify-center">
                  <ShieldAlert className="h-3.5 w-3.5" /> {otpError}
                </p>
              )}

              {/* Countdown timer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Passcode countdown:</span>
                <span className="font-bold text-slate-700 dark:text-amber-400">{otpTimer} seconds</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOTPDialog(false)}
                className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify2FADialog}
                className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-xs text-white font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white cursor-pointer shadow-md shadow-indigo-600/15"
              >
                Validate Charge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: SUCCESS & LIVE DELIVERY RECEIPT TRACKER */}
      {step === 3 && placedOrder && (
        <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
            <CheckCircle className="h-9 w-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">{t("order_tracked")}</h2>
            <p className="text-xs text-slate-500">
              Your payments have been processed. Transaction ID: <span className="font-mono font-bold text-slate-800 dark:text-amber-400">{placedOrder.id}</span>
            </p>
          </div>

          {/* Renders visually delightful logistical shipping timeline graphic */}
          <div className="border border-slate-100 p-5 rounded-xl bg-slate-50/50 dark:border-slate-900 dark:bg-slate-900/40 max-w-lg mx-auto space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Real-Time Logistics Tracker</h3>
            
            <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-400 relative">
              {/* Progress Line */}
              <div className="absolute top-2.5 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0 dark:bg-slate-800">
                <div className="h-full bg-emerald-500 w-1/3 transition-all duration-1000"></div>
              </div>

              <div className="space-y-2 z-10 flex flex-col items-center">
                <span className="h-5.5 w-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</span>
                <span className="text-emerald-500 font-extrabold uppercase scale-90">Placed</span>
              </div>
              <div className="space-y-2 z-10 flex flex-col items-center">
                <span className="h-5.5 w-5.5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono">2</span>
                <span className="text-slate-900 dark:text-amber-400 font-extrabold uppercase scale-90 animate-pulse">Packing</span>
              </div>
              <div className="space-y-2 z-10 flex flex-col items-center">
                <span className="h-5.5 w-5.5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold font-mono">3</span>
                <span className="scale-90 uppercase">Shipped</span>
              </div>
              <div className="space-y-2 z-10 flex flex-col items-center">
                <span className="h-5.5 w-5.5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold font-mono">4</span>
                <span className="scale-90 uppercase">On Road</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic mt-3 text-left">
              🚚 Estimate: Swift parcel handoff scheduled under Mall Road log codes within <span className="font-bold text-slate-700 dark:text-amber-400">2 to 3 Business days</span>.
            </p>
          </div>

          {/* Checkout stats details */}
          <div className="text-left max-w-sm mx-auto space-y-3 bg-slate-50 p-4 rounded-xl text-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-900">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Destination</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{placedOrder.shippingAddress}</span>
            </div>
            <div className="flex justify-between border-b pb-2 font-mono">
              <span className="text-slate-400">Payment Platform</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold">
              <span>Amount Deducted</span>
              <span className="font-mono text-emerald-500 font-extrabold">${placedOrder.total}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setStep(1);
            }}
            className="rounded-xl border border-slate-200 px-6 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 transition cursor-pointer"
          >
            Create Another Order
          </button>
        </div>
      )}
    </div>
  );
}

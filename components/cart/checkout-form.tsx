"use client";

import type { Address } from "@prisma/client";

import { Check, CreditCard, Loader2, MapPin, Package, ShieldCheck, Truck } from "lucide-react";

import Image from "next/image";

import Link from "next/link";

import { useSession } from "next-auth/react";

import { FormEvent, useEffect, useState } from "react";

import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";

import { Button } from "@/components/ui/button";

import { applyCoupon } from "@/lib/delivery";

import { computeOrderTotals, formatLocalPrice } from "@/lib/pricing";

import { cn } from "@/lib/utils";

import { useMarket } from "@/hooks/use-market";

import type { CheckoutStep } from "@/types";

const steps: { id: CheckoutStep; label: string; icon: typeof MapPin }[] = [

  { id: "address", label: "Address", icon: MapPin },

  { id: "delivery", label: "Delivery", icon: Truck },

  { id: "payment", label: "Payment", icon: CreditCard },

  { id: "review", label: "Review", icon: Package }

];

const fieldClass =

  "store-input mt-1 h-11 w-full px-3 text-[color:var(--store-text)] placeholder:text-[color:var(--store-text-muted)]";

function selectOptionClass(selected: boolean, disabled = false) {
  return cn(
    "rounded-xl border transition",
    disabled && "cursor-not-allowed opacity-50",
    !disabled && "cursor-pointer hover:border-[color:color-mix(in_srgb,var(--store-accent)_35%,var(--store-border))]",
    selected
      ? "border-[color:var(--store-accent)] bg-[color:var(--store-accent-soft)]"
      : "border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)]"
  );
}

export function CheckoutForm() {

  const { market, config, formatPrice } = useMarket();

  const { data: session, status } = useSession();

  const items = useCartStore((s) => s.items);

  const subtotalINR = useCartStore((s) => s.subtotal());

  const couponCode = useCartStore((s) => s.couponCode);

  const applyCouponStore = useCartStore((s) => s.applyCoupon);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<CheckoutStep>("address");

  const [loading, setLoading] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [couponInput, setCouponInput] = useState("");

  const [address, setAddress] = useState({

    fullName: "",

    phone: "",

    line1: "",

    line2: "",

    city: "",

    state: "",

    pincode: ""

  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {

    if (!session?.user) return;

    let cancelled = false;

    (async () => {

      try {

        const response = await fetch("/api/addresses");

        if (!response.ok) return;

        const data = (await response.json()) as { addresses: Address[] };

        if (cancelled) return;

        setSavedAddresses(data.addresses);

        const preferred = data.addresses.find((a) => a.isDefault) ?? data.addresses[0];

        if (preferred) {

          setSelectedAddressId(preferred.id);

          setAddress({

            fullName: preferred.fullName,

            phone: preferred.phone,

            line1: preferred.line1,

            line2: preferred.line2 ?? "",

            city: preferred.city,

            state: preferred.state,

            pincode: preferred.pincode

          });

        }

      } catch {

        // saved addresses are a convenience; manual entry still works

      }

    })();

    return () => {

      cancelled = true;

    };

  }, [session?.user]);

  function selectSavedAddress(saved: Address) {

    setSelectedAddressId(saved.id);

    setAddress({

      fullName: saved.fullName,

      phone: saved.phone,

      line1: saved.line1,

      line2: saved.line2 ?? "",

      city: saved.city,

      state: saved.state,

      pincode: saved.pincode

    });

  }

  const totals = computeOrderTotals({

    subtotalINR,

    marketCode: market,

    deliveryMethod: deliveryMethod as "standard" | "express",

    couponCode: couponCode ?? undefined

  });

  const { subtotal, shipping, tax, couponDiscount, total } = totals;

  const stepIndex = steps.findIndex((s) => s.id === step);

  async function placeOrder(event: FormEvent) {

    event.preventDefault();

    if (!session?.user) {

      toast.error("Please sign in before checkout.");

      return;

    }

    setLoading(true);

    try {

      const coupon = useCartStore.getState().couponCode;

      const response = await fetch("/api/checkout", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),

          address,

          market,

          deliveryMethod,

          paymentMethod,

          ...(coupon ? { couponCode: coupon } : {})

        })

      });

      const data = (await response.json().catch(() => null)) as { message?: string; url?: string } | null;

      if (!response.ok) throw new Error(data?.message ?? "Checkout failed");

      clearCart();

      if (data?.url) window.location.href = data.url;
      else window.location.href = "/checkout/success";

    } catch (error) {

      toast.error(error instanceof Error ? error.message : "Checkout failed");

    } finally {

      setLoading(false);

    }

  }

  function validateCoupon() {

    const result = applyCoupon(subtotalINR, couponInput, market);

    if (result.discount > 0) {

      applyCouponStore(couponInput.toUpperCase(), result.discount);

      toast.success(result.message);

    } else {

      toast.error(result.message);

    }

  }

  if (items.length === 0) {

    return (

      <div className="mx-auto max-w-3xl px-5 py-16 text-center">

        <h1 className="dashboard-heading text-3xl">No items to checkout</h1>

        <Link href="/search" className="store-btn-primary mt-6 inline-flex">

          Continue shopping

        </Link>

      </div>

    );

  }

  return (

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">

      <nav className="mb-8 flex flex-wrap items-center gap-2" aria-label="Checkout progress">

        {steps.map((s, i) => {

          const Icon = s.icon;

          const done = i < stepIndex;

          const current = s.id === step;

          return (

            <div key={s.id} className="flex items-center gap-2">

              <div

                className={cn(

                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition",

                  current &&

                    "border-[color:var(--store-accent)] bg-[color:var(--store-accent)] text-white shadow-sm",

                  done &&

                    !current &&

                    "border-[color:color-mix(in_srgb,var(--store-success)_35%,var(--store-border))] bg-[color:color-mix(in_srgb,var(--store-success)_12%,var(--store-surface-muted))] text-[color:var(--store-success)]",

                  !current &&

                    !done &&

                    "border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] text-[color:var(--store-text-muted)]"

                )}

              >

                {done ? <Check className="h-4 w-4 shrink-0" /> : <Icon className="h-4 w-4 shrink-0" />}

                {s.label}

              </div>

              {i < steps.length - 1 && (

                <span className="text-[color:var(--store-text-muted)]" aria-hidden="true">

                  →

                </span>

              )}

            </div>

          );

        })}

      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        <div className="store-panel p-5 sm:p-6">

          {status !== "loading" && !session?.user && (

            <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--store-accent)_25%,var(--store-border))] bg-[color:var(--store-accent-soft)] p-4 text-sm text-[color:var(--store-text)]">

              <Link href="/login?callbackUrl=/checkout" className="dashboard-link">

                Sign in

              </Link>{" "}

              to place your order.

            </div>

          )}

          {step === "address" && (

            <div>

              <h1 className="dashboard-heading text-2xl">Select delivery address</h1>

              {savedAddresses.length > 0 && (

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  {savedAddresses.map((saved) => (

                    <label

                      key={saved.id}

                      className={cn(

                        "flex items-start gap-2 p-3 text-sm",

                        selectOptionClass(selectedAddressId === saved.id)

                      )}

                    >

                      <input

                        type="radio"

                        name="savedAddress"

                        className="mt-1 accent-[color:var(--store-accent)]"

                        checked={selectedAddressId === saved.id}

                        onChange={() => selectSavedAddress(saved)}

                      />

                      <span>

                        <span className="block font-semibold text-[color:var(--store-text)]">

                          {saved.fullName}{" "}

                          {saved.isDefault && (

                            <span className="text-xs font-normal text-[color:var(--store-accent)]">(Default)</span>

                          )}

                        </span>

                        <span className="dashboard-muted mt-0.5 block">

                          {saved.line1}, {saved.city}, {saved.state} {saved.pincode}

                        </span>

                      </span>

                    </label>

                  ))}

                  <label

                    className={cn(

                      "flex items-center gap-2 p-3 text-sm",

                      selectOptionClass(selectedAddressId === null)

                    )}

                  >

                    <input

                      type="radio"

                      name="savedAddress"

                      className="accent-[color:var(--store-accent)]"

                      checked={selectedAddressId === null}

                      onChange={() => {

                        setSelectedAddressId(null);

                        setAddress({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

                      }}

                    />

                    <span className="font-medium text-[color:var(--store-text)]">Use a different address</span>

                  </label>

                </div>

              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                {Object.entries({

                  fullName: "Full name",

                  phone: "Mobile",

                  line1: "Address line 1",

                  line2: "Address line 2",

                  city: "City",

                  state: "State",

                  pincode: config.postal.label

                }).map(([key, label]) => (

                  <label key={key} className={key.startsWith("line") ? "sm:col-span-2" : ""}>

                    <span className="dashboard-label">{label}</span>

                    <input

                      required={key !== "line2"}

                      value={address[key as keyof typeof address]}

                      onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}

                      className={fieldClass}

                    />

                  </label>

                ))}

              </div>

              <Button className="mt-6" onClick={() => setStep("delivery")}>

                Continue

              </Button>

            </div>

          )}

          {step === "delivery" && (

            <div>

              <h1 className="dashboard-heading text-2xl">Choose delivery speed</h1>

              <div className="mt-4 space-y-3">

                {[

                  { id: "standard", label: "Standard Delivery", eta: "3-5 business days", price: 0 },

                  { id: "express", label: "Express Delivery", eta: "1-2 business days", price: config.shipping.expressFee }

                ].map((opt) => (

                  <label key={opt.id} className={cn("flex items-center justify-between p-4", selectOptionClass(deliveryMethod === opt.id))}>

                    <div className="flex items-center gap-3">

                      <input

                        type="radio"

                        name="delivery"

                        className="accent-[color:var(--store-accent)]"

                        checked={deliveryMethod === opt.id}

                        onChange={() => setDeliveryMethod(opt.id)}

                      />

                      <div>

                        <p className="font-semibold text-[color:var(--store-text)]">{opt.label}</p>

                        <p className="dashboard-muted">{opt.eta}</p>

                      </div>

                    </div>

                    <span className="font-semibold text-[color:var(--store-text)]">

                      {opt.price === 0 ? "FREE" : formatLocalPrice(opt.price, market)}

                    </span>

                  </label>

                ))}

              </div>

              <div className="mt-6 flex gap-3">

                <Button variant="outline" onClick={() => setStep("address")}>

                  Back

                </Button>

                <Button onClick={() => setStep("payment")}>Continue</Button>

              </div>

            </div>

          )}

          {step === "payment" && (

            <div>

              <h1 className="dashboard-heading text-2xl">Payment method</h1>

              <p className="dashboard-muted mt-1">Pay when your order arrives. Card, UPI, and wallet options are coming soon.</p>

              <div className="mt-4 space-y-3">

                {[

                  { id: "cod", label: "Cash on Delivery" },

                  { id: "stripe", label: "Card / UPI (Stripe)", disabled: true },

                  { id: "razorpay", label: "Razorpay", disabled: true },

                  { id: "paypal", label: "PayPal", disabled: true }

                ].map((opt) => (

                  <label

                    key={opt.id}

                    className={cn(

                      "flex items-center gap-3 p-4",

                      selectOptionClass(paymentMethod === opt.id, opt.disabled)

                    )}

                  >

                    <input

                      type="radio"

                      name="payment"

                      className="accent-[color:var(--store-accent)]"

                      disabled={opt.disabled}

                      checked={paymentMethod === opt.id}

                      onChange={() => setPaymentMethod(opt.id)}

                    />

                    <span className="font-semibold text-[color:var(--store-text)]">{opt.label}</span>

                    {opt.disabled && <span className="text-xs text-[color:var(--store-text-muted)]">(Coming soon)</span>}

                  </label>

                ))}

              </div>

              <div className="mt-6 flex gap-3">

                <Button variant="outline" onClick={() => setStep("delivery")}>

                  Back

                </Button>

                <Button onClick={() => setStep("review")}>Review order</Button>

              </div>

            </div>

          )}

          {step === "review" && (

            <form onSubmit={placeOrder}>

              <h1 className="dashboard-heading text-2xl">Review your order</h1>

              <div className="dashboard-card-inner mt-4 text-sm">

                <p className="font-semibold text-[color:var(--store-text)]">Deliver to</p>

                <p className="dashboard-muted mt-1">

                  {address.fullName}, {address.line1}, {address.city}, {address.state} {address.pincode}

                </p>

                <p className="mt-2 text-[color:var(--store-text)]">

                  <strong>Delivery:</strong> {deliveryMethod === "express" ? "Express" : "Standard"} ·{" "}
                  <strong>Payment:</strong> Cash on Delivery

                </p>

              </div>

              <div className="mt-6 flex gap-3">

                <Button type="button" variant="outline" onClick={() => setStep("payment")}>

                  Back

                </Button>

                <Button type="submit" disabled={loading || !session?.user}>

                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}

                  Place order

                </Button>

              </div>

            </form>

          )}

        </div>

        <aside className="store-panel h-fit p-5 sm:p-6">

          <h2 className="dashboard-heading text-xl">Order summary</h2>

          <div className="store-scroll mt-4 max-h-48 space-y-3">

            {items.map((item) => (

              <div key={item.product.id} className="flex gap-3">

                <div className="store-image-frame relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">

                  <Image src={item.product.images[0]} alt="" fill sizes="56px" className="object-cover" />

                </div>

                <div className="min-w-0 flex-1 text-sm">

                  <p className="line-clamp-2 font-medium text-[color:var(--store-text)]">{item.product.title}</p>

                  <p className="dashboard-muted">Qty {item.quantity}</p>

                </div>

                <strong className="text-sm text-[color:var(--store-text)]">

                  {formatPrice(item.product.price * item.quantity)}

                </strong>

              </div>

            ))}

          </div>

          <div className="mt-4 flex gap-2">

            <input

              value={couponInput}

              onChange={(e) => setCouponInput(e.target.value)}

              placeholder="Coupon code"

              className="store-input h-11 flex-1 px-3 placeholder:text-[color:var(--store-text-muted)]"

            />

            <Button type="button" variant="outline" onClick={validateCoupon}>

              Apply

            </Button>

          </div>

          <div className="mt-4 space-y-2 border-t border-[color:var(--store-border)] pt-4 text-sm text-[color:var(--store-text)]">

            <div className="flex justify-between">

              <span>Subtotal</span>

              <strong>{formatLocalPrice(subtotal, market)}</strong>

            </div>

            {couponDiscount > 0 && (

              <div className="flex justify-between text-[color:var(--store-success)]">

                <span>Coupon</span>

                <strong>-{formatLocalPrice(couponDiscount, market)}</strong>

              </div>

            )}

            <div className="flex justify-between">

              <span>Shipping</span>

              <strong>{shipping === 0 ? "FREE" : formatLocalPrice(shipping, market)}</strong>

            </div>

            <div className="flex justify-between">

              <span>{config.tax.label}</span>

              <strong>{formatLocalPrice(tax, market)}</strong>

            </div>

            <div className="flex justify-between text-base font-bold">

              <span>Total</span>

              <span className="text-[color:var(--store-accent)]">{formatLocalPrice(total, market)}</span>

            </div>

          </div>

          <p className="mt-4 flex gap-2 rounded-xl border border-[color:color-mix(in_srgb,var(--store-success)_25%,var(--store-border))] bg-[color:color-mix(in_srgb,var(--store-success)_8%,var(--store-surface-muted))] p-3 text-xs text-[color:var(--store-success)]">

            <ShieldCheck className="h-4 w-4 shrink-0" />

            Secure checkout. Payment providers ready for production.

          </p>

        </aside>

      </div>

    </div>

  );

}


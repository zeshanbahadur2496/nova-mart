"use client";

import { MapPin } from "lucide-react";
import { FormEvent, useState } from "react";

import { useDeliveryStore } from "@/components/providers/delivery-store";
import { useMarket } from "@/hooks/use-market";

export function DeliveryChecker({ fastDelivery = true }: { fastDelivery?: boolean }) {
  const { pincode, setLocation } = useDeliveryStore();
  const { market, config } = useMarket();
  const [input, setInput] = useState(pincode);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/delivery/check?postalCode=${encodeURIComponent(input)}&prime=${fastDelivery}&market=${market}`
      );
      const data = (await res.json()) as { serviceable: boolean; estimatedDelivery?: string; message: string };
      setMessage(data.serviceable ? `Delivery by ${data.estimatedDelivery}` : data.message);
      if (data.serviceable) setLocation(input, "Your location", market);
    } catch {
      setMessage("Unable to check delivery");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={check} className="mt-4">
      <p className="text-sm font-semibold text-[color:var(--store-text)]">
        Deliver to {config.flag} {config.name}
      </p>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--store-text-muted)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.postal.placeholder}
            maxLength={config.postal.maxLength}
            className="store-input h-10 w-full pl-9 pr-3"
          />
        </div>
        <button type="submit" disabled={loading} className="store-btn-secondary h-10 px-4 text-sm">
          Check
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-[color:var(--store-success)]">{message}</p>}
    </form>
  );
}

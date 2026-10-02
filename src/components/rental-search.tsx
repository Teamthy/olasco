"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { cityLabels } from "@/config/business";
import { ActionButton } from "@/components/ui";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function RentalSearch({ initialLocation = "Lagos" }: { initialLocation?: string }) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation === "Abuja" ? "Abuja" : "Lagos");
  const [category, setCategory] = useState("SUV");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pickupDate || !returnDate) {
      setError("Choose both a pickup and return date.");
      return;
    }
    if (returnDate < pickupDate) {
      setError("Return date cannot be before pickup.");
      return;
    }
    setError("");
    const params = new URLSearchParams({ location, category, pickupDate, returnDate });
    router.push(`/rentals/search?${params.toString()}`);
  }

  return (
    <form className="search-panel" onSubmit={submit} noValidate>
      <div className="search-panel-heading">
        <div><h2>Start with your journey</h2><p>We’ll confirm the exact car, rate, and availability with you.</p></div>
      </div>
      <div className="search-field">
        <label htmlFor="search-location">City</label>
        <select id="search-location" value={location} onChange={(event) => setLocation(event.target.value)}>
          {cityLabels.map((city) => <option key={city}>{city}</option>)}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-category">Vehicle class</label>
        <select id="search-category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="SUV">SUV</option>
          <option value="Executive">Executive</option>
          <option value="Sedan">Sedan</option>
          <option value="Luxury">Luxury</option>
          <option value="Not sure">Help me choose</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-pickup">Pickup date</label>
        <input id="search-pickup" type="date" min={today()} value={pickupDate} onChange={(event) => { setPickupDate(event.target.value); setError(""); }} />
      </div>
      <div className="search-field">
        <label htmlFor="search-return">Return date</label>
        <input id="search-return" type="date" min={pickupDate || today()} value={returnDate} onChange={(event) => { setReturnDate(event.target.value); setError(""); }} />
      </div>
      <ActionButton type="submit"><Search size={15} aria-hidden="true" />Check availability<ArrowUpRight size={14} aria-hidden="true" /></ActionButton>
      <p className="search-note" role={error ? "alert" : undefined}>{error || "A request is not a confirmed reservation. No online payment is taken."}</p>
    </form>
  );
}

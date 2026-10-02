"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, X } from "lucide-react";
import type { VehicleRecord } from "@/domain/types";
import { VehicleCard } from "@/components/vehicle-card";
import { EmptyState } from "@/components/empty-state";
import { ActionButton } from "@/components/ui";

const categories = ["All classes", "ECONOMY", "SEDAN", "SUV", "LUXURY", "EXECUTIVE", "VAN", "CONVERTIBLE", "SPORTS"];

type VehicleCatalogProps = { vehicles: VehicleRecord[]; mode: "rent" | "sale"; initialCategory?: string };

export function VehicleCatalog({ vehicles, mode, initialCategory = "All classes" }: VehicleCatalogProps) {
  const [city, setCity] = useState("All cities");
  const [category, setCategory] = useState(initialCategory);
  const [transmission, setTransmission] = useState("Any transmission");
  const [fuel, setFuel] = useState("Any fuel type");
  const [maxPrice, setMaxPrice] = useState("");
  const [seats, setSeats] = useState("Any capacity");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      if (city !== "All cities" && vehicle.location !== city) return false;
      if (category !== "All classes" && vehicle.category !== category) return false;
      if (transmission !== "Any transmission" && vehicle.transmission?.toLowerCase() !== transmission.toLowerCase()) return false;
      if (fuel !== "Any fuel type" && vehicle.fuelType?.toLowerCase() !== fuel.toLowerCase()) return false;
      if (seats !== "Any capacity" && (vehicle.seats || 0) < Number(seats)) return false;
      if (availableOnly && !vehicle.isAvailable) return false;
      if (maxPrice) {
        const price = mode === "rent" ? vehicle.rentalPriceDaily : vehicle.salePrice;
        if (price === null || price === undefined || price > Number(maxPrice)) return false;
      }
      return true;
    });
    return result.sort((a, b) => {
      const aPrice = mode === "rent" ? a.rentalPriceDaily : a.salePrice;
      const bPrice = mode === "rent" ? b.rentalPriceDaily : b.salePrice;
      if (sortBy === "price-low") return (aPrice ?? Number.MAX_SAFE_INTEGER) - (bPrice ?? Number.MAX_SAFE_INTEGER);
      if (sortBy === "price-high") return (bPrice ?? -1) - (aPrice ?? -1);
      if (sortBy === "year") return b.year - a.year;
      return Number(b.isFeatured) - Number(a.isFeatured) || b.year - a.year;
    });
  }, [vehicles, city, category, transmission, fuel, seats, availableOnly, maxPrice, mode, sortBy]);

  function reset() {
    setCity("All cities"); setCategory("All classes"); setTransmission("Any transmission"); setFuel("Any fuel type"); setSeats("Any capacity"); setMaxPrice(""); setAvailableOnly(false);
  }

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const returnFocus = filterTriggerRef.current;
    filterCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>(".filter-sheet");
        const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]')) : [];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      returnFocus?.focus();
    };
  }, [mobileFiltersOpen]);

  const filters = (
    <div className="catalog-filters" aria-label="Filter vehicles">
      <label><span>City</span><select value={city} onChange={(event) => setCity(event.target.value)}><option>All cities</option><option>Lagos</option><option>Abuja</option></select></label>
      <label><span>Class</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === "All classes" ? item : item.toLowerCase()}</option>)}</select></label>
      <label><span>Transmission</span><select value={transmission} onChange={(event) => setTransmission(event.target.value)}><option>Any transmission</option><option>Automatic</option><option>Manual</option></select></label>
      <label><span>Fuel</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option>Any fuel type</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></label>
      <label><span>{mode === "rent" ? "Daily max (NGN)" : "Maximum budget (NGN)"}</span><input type="number" min="0" inputMode="numeric" placeholder="Any price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
      <label><span>Seats from</span><select value={seats} onChange={(event) => setSeats(event.target.value)}><option>Any capacity</option><option value="2">2+</option><option value="4">4+</option><option value="5">5+</option><option value="7">7+</option></select></label>
      <label className="catalog-available"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} /><span>Available now</span></label>
      <button className="catalog-reset" type="button" onClick={reset}>Clear filters</button>
    </div>
  );

  return (
    <div className="vehicle-catalog">
      <div className="catalog-toolbar">
        <p>{vehicles.length ? `${filtered.length} ${filtered.length === 1 ? "vehicle" : "vehicles"} match your filters` : "Live inventory is being verified before publication."}</p>
        <button ref={filterTriggerRef} className="filter-open-button" type="button" aria-expanded={mobileFiltersOpen} aria-controls="vehicle-filters-sheet" onClick={() => setMobileFiltersOpen(true)}><Filter size={15} aria-hidden="true" />Filters</button>
        <label className="sort-control"><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="year">Newest model year</option></select></label>
      </div>
      <div className="catalog-content">
        <aside className="desktop-filters">{filters}</aside>
        {filtered.length ? (
          <div className="vehicle-grid">{filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} mode={mode} />)}</div>
        ) : vehicles.length ? (
          <EmptyState compact title="No vehicles match those filters." description="Clear a filter or contact Olasco with your city, dates, budget, and preferred class. The team can check options that are not listed here." primaryHref={mode === "rent" ? "/rentals/booking" : "/cars/consultation"} primaryLabel={mode === "rent" ? "Request availability" : "Request a consultation"} context={mode === "rent" ? "rental" : "purchase"} />
        ) : (
          <EmptyState title={mode === "rent" ? "Current rental listings are being confirmed." : "Current sale listings are being confirmed."} description={mode === "rent" ? "We do not publish sample cars as live Olasco inventory. Tell us your dates, city, and preferred vehicle class; our team will check real availability and current pricing." : "No unverified car is shown as for sale. Tell us your preferred model, city, and budget and ask the team for confirmed, current options."} primaryHref={mode === "rent" ? "/rentals/booking" : "/cars/consultation"} primaryLabel={mode === "rent" ? "Request a rental" : "Talk to a sales specialist"} context={mode === "rent" ? "rental" : "purchase"} />
        )}
      </div>
      {mobileFiltersOpen ? (
        <div className="filter-backdrop" role="presentation" onClick={() => setMobileFiltersOpen(false)}>
          <section className="filter-sheet" id="vehicle-filters-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" onClick={(event) => event.stopPropagation()}>
            <header><div><p className="eyebrow">NARROW YOUR SEARCH</p><h2 id="filter-sheet-title">Filters</h2></div><button ref={filterCloseRef} type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}><X size={20} aria-hidden="true" /></button></header>
            {filters}
            <ActionButton type="button" onClick={() => setMobileFiltersOpen(false)}>Show {filtered.length} vehicles</ActionButton>
          </section>
        </div>
      ) : null}
      <div className="visually-hidden" aria-live="polite">{filtered.length} vehicles shown</div>
    </div>
  );
}

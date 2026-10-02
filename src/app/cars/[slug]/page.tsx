import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, CircleDollarSign, FileSearch, ShieldCheck } from "lucide-react";
import { saleCategoryPages } from "@/content/catalog-pages";
import { getVehicleBySlug, listVehicles } from "@/server/repositories";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCatalog } from "@/components/vehicle-catalog";
import { VehicleDetail } from "@/components/vehicle-detail";
import { InquiryForm } from "@/components/inquiry-form";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

 type Params = { slug: string };
export const dynamic = "force-dynamic";

const purchasePoints = [
  { text: "Ask for verified current stock, photos, and condition details.", icon: BadgeCheck },
  { text: "Arrange an inspection and ask what documentation is available.", icon: FileSearch },
  { text: "Confirm price, payment, and handover terms before committing.", icon: ShieldCheck },
];

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = saleCategoryPages[slug];
  if (category) return { title: category.metaTitle, description: category.metaDescription, alternates: { canonical: `/cars/${slug}` } };
  if (slug === "consultation") return { title: "Vehicle purchase consultation", description: "Ask Olasco Autos for verified car options, inspection details, pricing and purchase handover information in Lagos or Abuja.", alternates: { canonical: "/cars/consultation" } };
  if (slug === "sell-trade-in") return { title: "Sell or trade in a car", description: "Send Olasco details of a car you want to sell or trade in. Availability and terms are confirmed directly.", alternates: { canonical: "/cars/sell-trade-in" } };
  const vehicle = await getVehicleBySlug(slug);
  if (vehicle?.isForSale) return { title: `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale`, description: vehicle.description, alternates: { canonical: `/cars/${slug}` } };
  return { title: "Car listing not found" };
}

export default async function CarSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = saleCategoryPages[slug];
  if (category) {
    const vehicles = await listVehicles({ mode: "sale", category: category.category });
    return (
      <>
        <PageHero eyebrow={category.eyebrow} title={<>{category.title}</>} description={category.description} aside="No sample vehicle is shown as for sale. Only verified listings with current details and approved photos appear here." dark>
          <div className="hero-actions page-hero-actions"><ButtonLink href="/cars/consultation">Ask for current options<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="purchase" details={{ vehicle: category.category }} variant="text" className="hero-secondary" icon="whatsapp">Talk to sales</WhatsAppLink></div>
        </PageHero>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cars for sale", href: "/cars" }, { label: category.title }]} />
        <section className="section section--white"><div className="container"><SectionHeading eyebrow="VERIFIED LISTINGS" title="Current options, when confirmed." description="Ask the team for the exact price, location, mileage, condition, inspection, and documents for a specific vehicle." /><VehicleCatalog vehicles={vehicles} mode="sale" initialCategory={category.category} /></div></section>
      </>
    );
  }

  if (slug === "consultation" || slug === "sell-trade-in") {
    const isTradeIn = slug === "sell-trade-in";
    return (
      <>
        <PageHero eyebrow={isTradeIn ? "SELL / TRADE-IN ENQUIRY" : "VEHICLE PURCHASE CONSULTATION"} title={isTradeIn ? <>Let’s discuss <span>your current car.</span></> : <>Ask the right questions <span>before you buy.</span></>} description={isTradeIn ? "Tell Olasco the make, model, year, city, condition, and any details that help the team understand your sell or trade-in enquiry." : "Share the kind of car you have in mind. Olasco can confirm current options and talk through inspection, documents, price, and handover for a specific vehicle."} aside="Trade-in, financing, warranty, vehicle assessment, and handover terms are not assumed. The team will confirm what is currently offered." />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cars for sale", href: "/cars" }, { label: isTradeIn ? "Sell / trade-in" : "Purchase consultation" }]} />
        <section className="section section--white"><div className="container form-layout"><InquiryForm type={isTradeIn ? "SELL_TRADE_IN" : "PURCHASE_CONSULTATION"} title={isTradeIn ? "Tell us about the car." : "Tell us what you want to buy."} /><aside className="form-aside"><p className="eyebrow">A BETTER PURCHASE CONVERSATION</p><h2>Specific questions, verified answers.</h2><p>There is no payment or sale commitment in this enquiry. Ask the Olasco representative to confirm the individual vehicle and the written process before you proceed.</p><ul className="form-aside-list">{purchasePoints.map(({ text, icon: Icon }) => <li key={text}><Icon size={14} aria-hidden="true" />{text}</li>)}</ul><div className="form-aside-contact"><CircleDollarSign size={17} aria-hidden="true" /><span>Price and financing availability must be confirmed by the business.</span></div></aside></div></section>
      </>
    );
  }

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle || !vehicle.isForSale) notFound();
  return <VehicleDetail vehicle={vehicle} mode="sale" />;
}

export const primaryNavigation = [
  { label: "Rent a car", href: "/rentals" },
  { label: "Cars for sale", href: "/cars" },
  { label: "Pickup & travel", href: "/pickup" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
] as const;

export const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "About Olasco", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Rent",
    links: [
      { label: "Rent a car", href: "/rentals" },
      { label: "SUV rentals", href: "/rentals/suv" },
      { label: "Executive rentals", href: "/rentals/executive" },
      { label: "Daily & long-term", href: "/rentals/long-term" },
      { label: "Rental policies", href: "/rentals/policies" },
    ],
  },
  {
    title: "Buy & move",
    links: [
      { label: "Cars for sale", href: "/cars" },
      { label: "Purchase consultation", href: "/cars/consultation" },
      { label: "Sell / trade-in", href: "/cars/sell-trade-in" },
      { label: "Pickup services", href: "/pickup" },
      { label: "Corporate & events", href: "/pickup/corporate" },
    ],
  },
] as const;

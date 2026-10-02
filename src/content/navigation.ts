export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Rent a car", href: "/rentals" },
  { label: "Cars for sale", href: "/cars" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
] as const;

export const footerGroups = [
  {
    title: "Quick links",
    links: [
      { label: "Home", href: "/" },
      { label: "Cars for sale", href: "/cars" },
      { label: "Categories", href: "/categories" },
      { label: "Fleet & services", href: "/services" },
      { label: "About Olasco", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Chat on WhatsApp", href: "/whatsapp" },
      { label: "FAQs", href: "/faq" },
      { label: "Rental policies", href: "/rentals/policies" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Rent & move",
    links: [
      { label: "SUV rentals", href: "/rentals/suv" },
      { label: "Executive rentals", href: "/rentals/executive" },
      { label: "Airport pickup", href: "/pickup/airport" },
      { label: "Corporate & events", href: "/pickup/corporate" },
      { label: "Interstate trips", href: "/pickup/interstate" },
    ],
  },
] as const;

export interface FAQItem {
  question: string;
  answer: string;
  group: "Rentals" | "Buying a car" | "Pickup & travel" | "Website requests";
}

export const faqs: FAQItem[] = [
  {
    group: "Rentals",
    question: "What do I need to rent a vehicle?",
    answer: "Requirements depend on the vehicle, city, and whether you are self-driving or requesting a driver. Before confirming, ask Olasco about eligible driver age, licence and ID documents, deposit, insurance, and any other requirements for your specific request.",
  },
  {
    group: "Rentals",
    question: "Are rental prices shown on the website?",
    answer: "No rates are published until Olasco approves current pricing. Share your city, dates, preferred class, and itinerary to receive an availability and price confirmation. Any deposit, delivery charge, tax, or other mandatory fee should be explained before you accept.",
  },
  {
    group: "Rentals",
    question: "Can I rent by the day or for a longer period?",
    answer: "Daily and long-term rental requests are supported. The minimum period, extension rules, rate basis, and availability are confirmed for the requested vehicle and dates.",
  },
  {
    group: "Rentals",
    question: "Can I request airport or interstate use with a rental?",
    answer: "Yes, you can submit the route or airport details for review. Airport collection, interstate travel, driver needs, waiting time, and route eligibility must be confirmed by Olasco before the request is accepted.",
  },
  {
    group: "Rentals",
    question: "Can I request delivery or a chauffeur?",
    answer: "You can ask for pickup, drop-off, or a driver in your request. Exact service areas, timing, vehicle availability, and any related fees need to be agreed with the team first.",
  },
  {
    group: "Rentals",
    question: "What are the mileage, fuel, extension, and cancellation rules?",
    answer: "These terms have not been supplied for publication. Ask Olasco to confirm them for the vehicle and rental dates before you agree to a booking.",
  },
  {
    group: "Buying a car",
    question: "Can I inspect a car before buying?",
    answer: "Request an inspection through the purchase consultation form. The team will confirm which vehicle is available, where it can be inspected, and the inspection process.",
  },
  {
    group: "Buying a car",
    question: "Are financing or trade-ins available?",
    answer: "Financing and trade-in terms have not been confirmed for publication. Choose purchase consultation or sell/trade-in and ask the team what is currently offered.",
  },
  {
    group: "Buying a car",
    question: "How are payment, documents, and handover handled?",
    answer: "Payment, verification, ownership documents, delivery, and handover steps should be agreed for the specific vehicle before payment. Ask Olasco for the approved process and written terms.",
  },
  {
    group: "Pickup & travel",
    question: "Which airports, routes, and areas do you cover?",
    answer: "Olasco operates primarily in Lagos and Abuja, but exact airport meeting points, route eligibility, service hours, and interstate coverage need to be confirmed against your itinerary.",
  },
  {
    group: "Pickup & travel",
    question: "Can you provide event, conference, or business-trip transport?",
    answer: "You can request event, conference, corporate, and business-trip transport. Share the schedule, passenger count, stops, and dates; Olasco will confirm capacity, availability, and a quote.",
  },
  {
    group: "Pickup & travel",
    question: "How do I arrange an airport pickup?",
    answer: "Use the pickup request form and include your airport, flight arrival time, destination, passenger count, and luggage needs. The meeting point, waiting terms, vehicle, and price must be confirmed by the team.",
  },
  {
    group: "Website requests",
    question: "Does submitting a request confirm my booking?",
    answer: "No. A submitted request receives a reference and is marked pending. Olasco will check availability, price, requirements, and itinerary with you before confirming. The website does not take payment.",
  },
  {
    group: "Website requests",
    question: "How do I reach a person quickly?",
    answer: "Use the WhatsApp buttons on the site or call the supplied customer number. The WhatsApp message includes the service context so the team can continue the conversation.",
  },
];

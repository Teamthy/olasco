import { faqs } from "@/content/faqs";

export function FAQAccordion({ groups }: { groups?: string[] }) {
  const filtered = groups ? faqs.filter((item) => groups.includes(item.group)) : faqs;
  const grouped = Array.from(new Set(filtered.map((item) => item.group))).map((group) => ({
    group,
    items: filtered.filter((item) => item.group === group),
  }));
  return (
    <div className="faq-groups">
      {grouped.map(({ group, items }) => (
        <section className="faq-group" key={group}>
          <h2>{group}</h2>
          <div>
            {items.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

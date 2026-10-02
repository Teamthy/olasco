import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center" | "split";
  dark?: boolean;
}) {
  return (
    <div className={`section-heading section-heading--${align}${dark ? " section-heading--dark" : ""}`}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="section-heading-description">{description}</p> : null}
      </div>
      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  );
}

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";

export function buttonClass(variant: ButtonVariant = "primary", className = "") {
  return `button button--${variant}${className ? ` ${className}` : ""}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return <Link className={buttonClass(variant, className)} href={href} {...props}>{children}</Link>;
}

export function ActionButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return <button className={buttonClass(variant, className)} {...props}>{children}</button>;
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return <p className="field-error" id={id} role="alert">{children}</p>;
}

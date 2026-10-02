// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BookingConfirmationPanel } from "@/components/booking-confirmation-panel";

const reference = "OLA-2026-000123";

function response(status: number, payload: unknown = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => payload };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("booking confirmation verification", () => {
  it("does not claim receipt while the reference check is still pending", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));
    render(<BookingConfirmationPanel reference={reference} />);
    expect(screen.getByRole("heading", { name: "Verifying your reference." })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "We have your request." })).toBeNull();
  });

  it("only shows success after the saved reference is verified", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(200, { reference, status: "PENDING" })));
    render(<BookingConfirmationPanel reference={reference} />);
    expect(await screen.findByRole("heading", { name: "We have your request." })).toBeTruthy();
    expect(screen.getByText("Status · pending")).toBeTruthy();
  });

  it("shows a not-found state rather than success for an unknown reference", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(404)));
    render(<BookingConfirmationPanel reference={reference} />);
    expect(await screen.findByRole("heading", { name: "We couldn't find this request." })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "We have your request." })).toBeNull();
  });

  it("does not claim receipt when request storage cannot be checked", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(503)));
    render(<BookingConfirmationPanel reference={reference} />);
    expect(await screen.findByRole("heading", { name: "We can't confirm receipt yet." })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "We have your request." })).toBeNull();
  });
});

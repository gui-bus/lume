import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";

vi.mock("next-intl", () => ({
  useLocale: () => "pt",
}));

const mockReplace = vi.fn();
const mockRefresh = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
  usePathname: () => "/test",
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("LanguageSwitcher", () => {
  it("should render both language buttons", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("PT")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("should call router.replace when a language is clicked", () => {
    render(<LanguageSwitcher />);
    const enButton = screen.getByText("EN").closest("button");
    if (enButton) fireEvent.click(enButton);

    expect(mockReplace).toHaveBeenCalled();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("should render title", () => {
    render(<Header title='Test Title' />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render without rightContent", () => {
    const { container } = render(<Header title='Test' />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("should render with rightContent", () => {
    render(<Header title='Test' rightContent={<button>Click me</button>} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should have correct structure", () => {
    const { container } = render(<Header title='Test' />);
    const header = container.querySelector("header");

    expect(header).toHaveClass("w-full", "bg-white", "px-8", "py-6");
  });
});

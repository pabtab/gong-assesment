import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { UserMenu } from "./UserMenu";

describe("UserMenu", () => {
  it("should render user full name", () => {
    const onLogout = vi.fn();
    render(<UserMenu firstName='John' lastName='Doe' onLogout={onLogout} />);

    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it("should render logout button", () => {
    const onLogout = vi.fn();
    render(<UserMenu firstName='John' lastName='Doe' onLogout={onLogout} />);

    expect(screen.getByText("(Logout)")).toBeInTheDocument();
  });

  it("should call onLogout when logout button is clicked", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    render(<UserMenu firstName='John' lastName='Doe' onLogout={onLogout} />);

    const logoutButton = screen.getByText("(Logout)");
    await user.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple clicks", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    render(<UserMenu firstName='John' lastName='Doe' onLogout={onLogout} />);

    const logoutButton = screen.getByText("(Logout)");
    await user.click(logoutButton);
    await user.click(logoutButton);
    await user.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(3);
  });
});

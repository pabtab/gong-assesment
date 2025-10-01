import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";
import type { User } from "../types";

describe("UserCard", () => {
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "pass",
  };

  it("should render user full name", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render user email", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should display initials when no photo", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should display photo when available", () => {
    const userWithPhoto: User = {
      ...mockUser,
      photo: "https://example.com/photo.jpg",
    };

    render(<UserCard user={userWithPhoto} />);

    const img = screen.getByAltText("John Doe");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("should handle long names gracefully", () => {
    const userWithLongName: User = {
      ...mockUser,
      firstName: "VeryLongFirstName",
      lastName: "VeryLongLastName",
    };

    render(<UserCard user={userWithLongName} />);
    expect(screen.getByText("VeryLongFirstName VeryLongLastName")).toBeInTheDocument();
  });

  it("should handle long email gracefully", () => {
    const userWithLongEmail: User = {
      ...mockUser,
      email: "verylongemailaddress@verylongdomainname.com",
    };

    render(<UserCard user={userWithLongEmail} />);
    expect(screen.getByText("verylongemailaddress@verylongdomainname.com")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { encode, getInitials } from "./encode";

describe("encode", () => {
  it("should generate consistent hash for same credentials", () => {
    const email = "test@example.com";
    const password = "password123";

    const hash1 = encode(email, password);
    const hash2 = encode(email, password);

    expect(hash1).toBe(hash2);
  });

  it("should generate different hashes for different emails", () => {
    const password = "password123";

    const hash1 = encode("user1@example.com", password);
    const hash2 = encode("user2@example.com", password);

    expect(hash1).not.toBe(hash2);
  });

  it("should generate different hashes for different passwords", () => {
    const email = "test@example.com";

    const hash1 = encode(email, "password1");
    const hash2 = encode(email, "password2");

    expect(hash1).not.toBe(hash2);
  });

  it("should generate 64-character uppercase hex string", () => {
    const hash = encode("test@example.com", "password");

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
  });

  it("should handle short inputs", () => {
    const hash = encode("a", "b");

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
  });

  it("should handle long inputs", () => {
    const longEmail = "a".repeat(100) + "@example.com";
    const longPassword = "b".repeat(100);

    const hash = encode(longEmail, longPassword);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
  });
});

describe("getInitials", () => {
  it("should return uppercase initials from first and last name", () => {
    expect(getInitials("John", "Doe")).toBe("JD");
  });

  it("should handle lowercase names", () => {
    expect(getInitials("john", "doe")).toBe("JD");
  });

  it("should handle mixed case names", () => {
    expect(getInitials("JoHn", "DoE")).toBe("JD");
  });

  it("should handle single character names", () => {
    expect(getInitials("A", "B")).toBe("AB");
  });

  it("should take first character only", () => {
    expect(getInitials("Anthony", "Xiouping")).toBe("AX");
  });

  it("should handle names with special characters", () => {
    expect(getInitials("José", "María")).toBe("JM");
  });
});

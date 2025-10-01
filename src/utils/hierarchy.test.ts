import { describe, it, expect } from "vitest";
import { buildHierarchy } from "./hierarchy";
import type { User } from "../types";

describe("buildHierarchy", () => {
  it("should build tree with single root user", () => {
    const users: User[] = [
      {
        id: 1,
        email: "ceo@company.com",
        firstName: "John",
        lastName: "Doe",
        password: "pass",
      },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].id).toBe(1);
    expect(hierarchy[0].children).toHaveLength(0);
  });

  it("should build tree with parent and children", () => {
    const users: User[] = [
      {
        id: 1,
        email: "ceo@company.com",
        firstName: "John",
        lastName: "Doe",
        password: "pass",
      },
      {
        id: 2,
        email: "manager@company.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "pass",
        managerId: 1,
      },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].id).toBe(1);
    expect(hierarchy[0].children).toHaveLength(1);
    expect(hierarchy[0].children[0].id).toBe(2);
  });

  it("should handle multiple root users", () => {
    const users: User[] = [
      {
        id: 1,
        email: "ceo1@company.com",
        firstName: "John",
        lastName: "Doe",
        password: "pass",
      },
      {
        id: 2,
        email: "ceo2@company.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "pass",
      },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy).toHaveLength(2);
  });

  it("should handle deep hierarchies", () => {
    const users: User[] = [
      { id: 1, email: "ceo@c.com", firstName: "A", lastName: "A", password: "p" },
      { id: 2, email: "vp@c.com", firstName: "B", lastName: "B", password: "p", managerId: 1 },
      { id: 3, email: "mgr@c.com", firstName: "C", lastName: "C", password: "p", managerId: 2 },
      { id: 4, email: "emp@c.com", firstName: "D", lastName: "D", password: "p", managerId: 3 },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].children[0].children[0].children[0].id).toBe(4);
  });

  it("should handle orphaned users (missing manager)", () => {
    const users: User[] = [
      {
        id: 1,
        email: "emp@c.com",
        firstName: "John",
        lastName: "Doe",
        password: "p",
        managerId: 999, // Non-existent manager
      },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].id).toBe(1);
  });

  it("should handle empty array", () => {
    const hierarchy = buildHierarchy([]);
    expect(hierarchy).toHaveLength(0);
  });

  it("should preserve user properties", () => {
    const users: User[] = [
      {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "pass",
        photo: "https://example.com/photo.jpg",
      },
    ];

    const hierarchy = buildHierarchy(users);

    expect(hierarchy[0].email).toBe("test@example.com");
    expect(hierarchy[0].firstName).toBe("Test");
    expect(hierarchy[0].lastName).toBe("User");
    expect(hierarchy[0].photo).toBe("https://example.com/photo.jpg");
  });
});

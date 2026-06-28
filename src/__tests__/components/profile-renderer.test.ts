// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { renderProfileContent } from "../../../src/lib/profile-renderer";

describe("renderProfileContent", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("renders email as text, not markup — XSS payload creates no elements", () => {
    renderProfileContent(container, '<img src=x onerror=alert(1)>@evil.com');
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>@evil.com');
  });

  it("shows logged-in message containing the email", () => {
    renderProfileContent(container, "user@example.com");
    expect(container.textContent).toContain("Logged in as");
    expect(container.textContent).toContain("user@example.com");
  });

  it("renders email inside a strong element", () => {
    renderProfileContent(container, "user@example.com");
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe("user@example.com");
  });

  it("includes a sign-out button with id sign-out-btn", () => {
    renderProfileContent(container, "user@example.com");
    const btn = container.querySelector("#sign-out-btn");
    expect(btn).not.toBeNull();
    expect(btn?.tagName).toBe("BUTTON");
  });

  it("replaces previous content on re-render", () => {
    renderProfileContent(container, "first@example.com");
    renderProfileContent(container, "second@example.com");
    expect(container.textContent).not.toContain("first@example.com");
    expect(container.textContent).toContain("second@example.com");
  });
});

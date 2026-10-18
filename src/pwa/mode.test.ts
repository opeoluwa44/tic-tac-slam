import { describe, it, expect } from "vitest";
import { getInstallMode } from "./mode";

describe("getInstallMode", () => {
  const base = { installed: false, canPrompt: false, ios: false };

  it("hides everything when already installed", () => {
    expect(
      getInstallMode({ installed: true, canPrompt: true, ios: true }),
    ).toBe("installed");
  });
  it("offers the native prompt when the browser provides one", () => {
    expect(getInstallMode({ ...base, canPrompt: true })).toBe("prompt");
  });
  it("shows manual steps on iOS", () => {
    expect(getInstallMode({ ...base, ios: true })).toBe("ios");
  });
  it("offers nothing on unsupported browsers", () => {
    expect(getInstallMode(base)).toBe("none");
  });
});

import { parser } from "@/packages";
import "@testing-library/jest-dom";

describe("Parser Test Suite", () => {
  it("returns correct output", () => {
    const result = parser();

    expect(result).toBe("parser");
  });

  it("passes prose test", () => {});
});
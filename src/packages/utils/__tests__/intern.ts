import "@testing-library/jest-dom";
import { intern } from "@/packages/utils";

describe("Intern Test Suite", () => {
  it("returns correct output", () => {
    const fn = (arg: string) => ({ arg });
    const fni = intern(fn);

    expect(fn("a")).not.toBe(fn("a"));
    expect(fni("a")).toBe(fni("a"));
    expect(fni("a")).not.toBe(fni("b"));

    const fn2 = intern((arg1: string) =>
      intern((arg2: string) => ({ arg1, arg2 }))
    );
    expect(fn2("a")("b")).toBe(fn2("a")("b"));
    expect(fn2("a")("b")).not.toBe(fn2("c")("b"));
    expect(fn2("a")("b")).not.toBe(fn2("a")("c"));
  });
});

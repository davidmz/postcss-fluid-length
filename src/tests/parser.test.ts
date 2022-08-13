import { describe, expect, it } from "vitest";
import { parseValue } from "../parser";

describe("Parser", () => {
  it(`should parse valid syntax`, () => {
    const result = parseValue("fluid(10px/100px, 20px/200px)");
    expect(result).toEqual({
      variableArg: undefined,
      fallback: undefined,
      checkpoints: [
        {
          test: { value: 100, unit: "px" },
          result: { value: 10, unit: "px" },
        },
        {
          test: { value: 200, unit: "px" },
          result: { value: 20, unit: "px" },
        },
      ],
    });
  });

  it(`should parse complex valid syntax`, () => {
    const result = parseValue(
      "fluid(10/100px,30  / 300px /* ddd */ , 20 /* ddd *// 200px, by   2234vw)"
    );
    expect(result).toEqual({
      variableArg: "2234vw",
      fallback: undefined,
      checkpoints: [
        {
          test: { value: 100, unit: "px" },
          result: { value: 10, unit: "" },
        },
        {
          test: { value: 200, unit: "px" },
          result: { value: 20, unit: "" },
        },
        {
          test: { value: 300, unit: "px" },
          result: { value: 30, unit: "" },
        },
      ],
    });
  });

  describe("Errors", () => {
    it("function name is invalid", () => {
      expect(() => parseValue(`xxx()`)).toThrowError(
        /there should be only one/
      );
    });

    it("there are multiple statements in value", () => {
      expect(() => parseValue(`xxx() / 33%`)).toThrowError(
        /there should be only one/
      );
    });

    it("argument syntax is invalid", () => {
      expect(() => parseValue(`fluid(11 22 33)`)).toThrowError(
        /invalid argument syntax/
      );
    });

    it("argument syntax is invalid (2)", () => {
      expect(() => parseValue(`fluid(11: 33)`)).toThrowError(
        /invalid argument syntax/
      );
    });

    it("multiple 'by' arguments", () => {
      expect(() => parseValue(`fluid(by 100vw, by 200wv)`)).toThrowError(
        /only one 'by' argument allowed/
      );
    });

    it("multiple 'fallback' arguments", () => {
      expect(() =>
        parseValue(`fluid(fallback 10pt, fallback 20%)`)
      ).toThrowError(/only one 'fallback' argument allowed/);
    });

    it("unknown argument", () => {
      expect(() => parseValue(`fluid(qqq 10pt, fallback 20%)`)).toThrowError(
        /unknown argument: qqq/
      );
    });

    it("one checkpoint", () => {
      expect(() => parseValue(`fluid(20px / 200px)`)).toThrowError(
        /minimum two checkpoints required/
      );
    });

    it("different units", () => {
      expect(() =>
        parseValue(`fluid(20px / 200px, 10pt / 100px)`)
      ).toThrowError(/all test\/result units must be the same/);
    });

    it("different units (2)", () => {
      expect(() =>
        parseValue(`fluid(20px / 200px, 10px / 100pt)`)
      ).toThrowError(/all test\/result units must be the same/);
    });

    it("different units (fallback)", () => {
      expect(() =>
        parseValue(`fluid(20px / 200px, 10px / 100px, fallback 30pt)`)
      ).toThrowError(/fallback must have the same unit as checkpoints/);
    });

    it("invalid value", () => {
      expect(() =>
        parseValue(`fluid(x20px / 200px, 10px / 100px, fallback 30pt)`)
      ).toThrowError(/invalid value: x20px/);
    });
  });
});

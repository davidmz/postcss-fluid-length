import { describe, expect, it } from "vitest";
import { parseValue } from "../parser";
import { UValue } from "../u-value";

describe("Parser", () => {
  it(`should parse valid syntax`, () => {
    const result = parseValue("fluid(10px/100px, 20px/200px)");
    expect(result).toEqual({
      variableArg: undefined,
      fallback: undefined,
      checkpoints: [
        {
          test: UValue.parse("100px"),
          result: UValue.parse("10px"),
        },
        {
          test: UValue.parse("200px"),
          result: UValue.parse("20px"),
        },
      ],
    });
  });

  it(`should parse complex valid syntax`, () => {
    const result = parseValue(
      "fluid(10px/100px,30px  / 300px /* ddd */ , 20px /* ddd *// 200px, by   2234vw)"
    );
    expect(result).toEqual({
      variableArg: "2234vw",
      fallback: undefined,
      checkpoints: [
        {
          test: UValue.parse("100px"),
          result: UValue.parse("10px"),
        },
        {
          test: UValue.parse("200px"),
          result: UValue.parse("20px"),
        },
        {
          test: UValue.parse("300px"),
          result: UValue.parse("30px"),
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

    it("different units (3)", () => {
      expect(() =>
        parseValue(`fluid(20pt / 200px, 10pt / 100px)`)
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

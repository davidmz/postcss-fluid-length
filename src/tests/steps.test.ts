import { describe, expect, it } from "vitest";
import { parseValue } from "../parser";
import { createSteps } from "../steps";
import { UValue } from "../u-value";

describe("Steps", () => {
  const testData = [
    {
      input: "fluid(10px/100px, 20px/200px)",
      result: [
        {
          start: UValue.parse("100px"),
          min: UValue.parse("10px"),
          max: UValue.parse("20px"),
          k: 0.1,
        },
      ],
    },
    {
      input: "fluid(10px/100px, 20px/200px, 30px/250px)",
      result: [
        {
          start: UValue.parse("100px"),
          min: UValue.parse("10px"),
          max: UValue.parse("20px"),
          k: 0.1,
        },
        {
          start: UValue.parse("200px"),
          min: UValue.parse("0px"),
          max: UValue.parse("10px"),
          k: 0.2,
        },
      ],
    },
    {
      input: "fluid(10px/100px, 0px/200px, 30px/250px)",
      result: [
        {
          start: UValue.parse("100px"),
          min: UValue.parse("0px"),
          max: UValue.parse("10px"),
          k: -0.1,
        },
        {
          start: UValue.parse("200px"),
          min: UValue.parse("0px"),
          max: UValue.parse("30px"),
          k: 0.6,
        },
      ],
    },
  ];

  for (const { input, result } of testData) {
    it(`should parse '${input}'`, () => {
      const parsed = parseValue(input);
      expect(createSteps(parsed.checkpoints)).toEqual(result);
    });
  }
});

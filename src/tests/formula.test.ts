import { describe, expect, it } from "vitest";
import { createFormula } from "../formula";
import { parseValue } from "../parser";
import { createSteps } from "../steps";

describe("Steps", () => {
  const testData = [
    {
      input: "fluid(10px/100px, 20px/200px)",
      result: "clamp(10px, 10px + (100vw - 100px) / 10, 20px)",
    },
    {
      input: "fluid(10px/100px, 20px/200px, 30px/250px)",
      result:
        "calc(clamp(10px, 10px + (100vw - 100px) / 10, 20px) + clamp(0px, (100vw - 200px) / 5, 10px))",
    },
    {
      input: "fluid(10px/100px, 0px/200px, 30px/250px)",
      result:
        "calc(clamp(0px, 10px - (100vw - 100px) / 10, 10px) + clamp(0px, (100vw - 200px) / 1.667, 30px))",
    },
    {
      input: "fluid(10px/100px, 20px/200px, by 120vw)",
      result: "clamp(10px, 10px + (120vw - 100px) / 10, 20px)",
    },
    {
      input: "fluid(10px/100px, 20px/200px, by 120vw)",
      result: "clamp(10px, 10px + (120vw - 100px) / 10, 20px)",
    },
  ];

  for (const { input, result } of testData) {
    it(`should parse '${input}'`, () => {
      const parsed = parseValue(input);
      const steps = createSteps(parsed.checkpoints);
      expect(
        createFormula(steps, parsed.variableArg || "100vw", false)
      ).toEqual(result);
    });
  }
});

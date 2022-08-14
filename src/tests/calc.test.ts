import { describe, expect, it } from "vitest";
import { parseValue } from "../parser";
import { createCalculator, createSteps } from "../steps";

describe("Calculations", () => {
  const testData = [
    {
      rule: "fluid(10px/100px, 20px/200px)",
      expectations: [
        [90, 10],
        [100, 10],
        [130, 13],
        [150, 15],
        [190, 19],
        [200, 20],
        [230, 20],
      ],
    },
    {
      rule: "fluid(20px/100px, 10px/200px)",
      expectations: [
        [90, 20],
        [100, 20],
        [130, 17],
        [150, 15],
        [190, 11],
        [200, 10],
        [230, 10],
      ],
    },
    {
      rule: "fluid(10px/100px, 20px/200px, 30px/400px)",
      expectations: [
        [90, 10],
        [100, 10],
        [130, 13],
        [150, 15],
        [190, 19],
        [200, 20],
        [300, 25],
        [350, 27.5],
        [400, 30],
        [430, 30],
      ],
    },
  ];

  for (const { rule, expectations } of testData) {
    const calc = createCalculator(createSteps(parseValue(rule).checkpoints));
    describe(`testing '${rule}'`, () => {
      for (const [input, output] of expectations) {
        it(`should get ${output} for ${input}`, () => {
          expect(calc(input)).toBe(output);
        });
      }
    });
  }
});

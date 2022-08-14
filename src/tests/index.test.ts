import postcss from "postcss";
import { describe, expect, it } from "vitest";
import plugin from "..";

describe("PostCSS integration", () => {
  it(`should work`, async () => {
    const input = "a{ line-height: fluid(10px/100px,  20px / 200px) }";
    const result = await postcss([plugin()]).process(input, {
      from: undefined,
    });
    expect(result.css).toBe(
      "a{ line-height: 20px; line-height: clamp(10px, (100vw - 100px) / 10, 20px) }"
    );
    expect(result.warnings()).toHaveLength(0);
  });

  it(`should work with fallback in function arguments`, async () => {
    const input =
      "a{ line-height: fluid(10px/100px,  20px / 200px, fallback 33px) }";
    const result = await postcss([plugin()]).process(input, {
      from: undefined,
    });
    expect(result.css).toBe(
      "a{ line-height: 33px; line-height: clamp(10px, (100vw - 100px) / 10, 20px) }"
    );
    expect(result.warnings()).toHaveLength(0);
  });
});

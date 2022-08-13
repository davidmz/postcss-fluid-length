import postcss from "postcss";
import { describe, expect, it } from "vitest";
import plugin from "..";

describe("PostCSS integration", () => {
  it(`should work`, async () => {
    const input = "a{ line-height: fluid(10pt/100px,  20pt / 200px) }";
    const result = await postcss([plugin()]).process(input, {
      from: undefined,
    });
    expect(result.css).toBe(
      "a{ line-height: 20pt; line-height: clamp(10pt, (100vw - 100px) / 10, 20pt) }"
    );
    expect(result.warnings()).toHaveLength(0);
  });
});

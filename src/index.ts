import { type Declaration } from "postcss";
import { createFormula } from "./formula";
import { parseValue } from "./parser";
import { createSteps } from "./steps";

const postcssFluidLength = ({
  byValue = "100vw",
  fallbackBy = "max-value",
  useMinMax = false,
} = {}) => ({
  postcssPlugin: "postcss-fluid",
  Declaration(decl: Declaration) {
    // Fast check
    if (decl.value.indexOf("fluid(") !== 0) {
      return;
    }
    try {
      const parsed = parseValue(decl.value);
      let fallback = parsed.fallback;
      if (!fallback) {
        if (fallbackBy === "max-value") {
          fallback = parsed.checkpoints[parsed.checkpoints.length - 1].result;
        } else if (fallbackBy === "min-value") {
          fallback = parsed.checkpoints[0].result;
        } else if (fallbackBy !== "none") {
          throw new Error(
            `unknown 'fallbackBy' option (use 'max-value', 'min-value' or 'none')`
          );
        }
      }

      const steps = createSteps(parsed.checkpoints);
      fallback && decl.cloneBefore({ value: fallback.toString() });
      decl.value = createFormula(
        steps,
        parsed.variableArg || byValue,
        useMinMax
      );
    } catch (e) {
      throw new Error(`Invalid fluid value: ${e}`);
    }
  },
});

postcssFluidLength.postcss = true;

export = postcssFluidLength;

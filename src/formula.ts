import { Step } from "./steps";

const precision = 1000;

export function createFormula(
  steps: Step[],
  byValue: string,
  useMinMax: boolean
): string {
  const sSteps = steps.map(({ k, start, min, max }) => {
    let sign = "";
    let op = "*";
    if (k < 0) {
      sign = "-";
      k = -k;
    }
    if (k < 1) {
      k = 1 / k;
      op = "/";
    }

    k = Math.round(k * precision) / precision;

    const formula = `${sign}(${byValue} - ${start}) ${op} ${k}`;
    if (useMinMax) {
      return `max(${min}, min(${formula}, ${max}))`;
    } else {
      return `clamp(${min}, ${formula}, ${max})`;
    }
  });

  if (sSteps.length === 1) {
    return sSteps[0];
  }
  return `calc(${sSteps.join(" + ")})`;
}

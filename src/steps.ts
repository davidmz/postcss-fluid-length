import { type Checkpoint } from "./parser";
import { UValue } from "./u-value";

export type Step = {
  min: UValue;
  max: UValue;
  start: UValue;
  k: number;
};

export function createSteps(checkpoints: Checkpoint[]): Step[] {
  const steps: Step[] = [];
  let prevLevel = 0;
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const [c1, c2] = [checkpoints[i], checkpoints[i + 1]];

    const min = new UValue(
      Math.min(c1.result.value, c2.result.value) - prevLevel,
      c1.result.unit
    );
    const max = new UValue(
      Math.max(c1.result.value, c2.result.value) - prevLevel,
      c1.result.unit
    );
    const k =
      (c2.result.value - c1.result.value) / (c2.test.value - c1.test.value);

    steps.push({ min, max, start: c1.test, k });

    prevLevel = c2.result.value;
  }
  return steps;
}

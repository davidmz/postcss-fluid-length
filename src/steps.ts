import { type Checkpoint } from "./parser";
import { UValue } from "./u-value";

export class Step {
  constructor(
    private readonly point1: Checkpoint,
    private readonly point2: Checkpoint,
    private readonly groundLevel: number
  ) {
    // none
  }

  get startPoint() {
    return {
      test: this.point1.test,
      result: this.point1.result.addValue(-this.groundLevel),
    };
  }

  get outLevel() {
    return this.point2.result.value;
  }

  get maxResult() {
    return new UValue(
      Math.max(this.point1.result.value, this.point2.result.value),
      this.point1.result.unit
    ).addValue(-this.groundLevel);
  }

  get minResult() {
    return new UValue(
      Math.min(this.point1.result.value, this.point2.result.value),
      this.point1.result.unit
    ).addValue(-this.groundLevel);
  }

  get k() {
    return (
      (this.point2.result.value - this.point1.result.value) /
      (this.point2.test.value - this.point1.test.value)
    );
  }
}

export function createSteps(checkpoints: Checkpoint[]): Step[] {
  const steps: Step[] = [];
  let groundLevel = 0;
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const step = new Step(checkpoints[i], checkpoints[i + 1], groundLevel);
    groundLevel = step.outLevel;
    steps.push(step);
  }
  return steps;
}

// For the tests
export function createCalculator(steps: Step[]) {
  return (value: number) => {
    let result = 0;
    for (const step of steps) {
      const { minResult, maxResult } = step;
      const v =
        step.startPoint.result.value +
        step.k * (value - step.startPoint.test.value);
      if (v <= minResult.value) {
        result += minResult.value;
      } else if (v >= maxResult.value) {
        result += maxResult.value;
      } else {
        result += v;
      }
    }

    return result;
  };
}

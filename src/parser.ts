import valueParser, { Node } from "postcss-value-parser";
import { UValue } from "./u-value";

export type Checkpoint = {
  test: UValue;
  result: UValue;
};

export type ParseResult = {
  variableArg?: string;
  fallback?: UValue;
  checkpoints: Checkpoint[];
};

export function parseValue(value: string): ParseResult {
  // Remove comments
  const parsed = valueParser(value.replace(/\/\*.*?\*\//g, ""));

  if (parsed.nodes.length !== 1) {
    throw new Error(
      `there should be only one 'fluid' function call in declaration`
    );
  }

  const [fnNode] = parsed.nodes;
  if (
    fnNode.type !== "function" ||
    fnNode.value !== "fluid" ||
    fnNode.nodes.length === 0
  ) {
    throw new Error(
      `there should be only one 'fluid' function call in declaration`
    );
  }

  const args: Node[][] = [[]];
  for (const node of fnNode.nodes) {
    // Split by ','
    if (node.type === "div" && node.value === ",") {
      args.push([]);
      continue;
    }
    args[args.length - 1].push(node);
  }

  let variableArg: string | undefined;
  let fallback: UValue | undefined;
  const checkpoints: Checkpoint[] = [];

  for (const arg of args) {
    if (!isValidArg(arg)) {
      throw new Error(`invalid argument syntax`);
    }

    const [p1, div, p2] = arg;

    if (div.type === "space") {
      if (p1.value === "by") {
        if (variableArg) {
          throw new Error(`only one 'by' argument allowed`);
        }
        variableArg = p2.value;
      } else if (p1.value === "fallback") {
        if (fallback) {
          throw new Error(`only one 'fallback' argument allowed`);
        }
        fallback = UValue.parse(p2.value);
      } else {
        throw new Error(`unknown argument: ${p1.value}`);
      }
      continue;
    }
    if (div.value !== "/") {
      throw new Error(`invalid argument syntax`);
    }
    checkpoints.push({
      test: UValue.parse(p2.value),
      result: UValue.parse(p1.value),
    });
  }

  if (checkpoints.length < 2) {
    throw new Error(`minimum two checkpoints required`);
  }

  if (
    checkpoints[0].result.unit !== checkpoints[0].test.unit ||
    !checkpoints.every(
      (c) =>
        c.test.unit === checkpoints[0].test.unit &&
        c.result.unit === checkpoints[0].result.unit
    )
  ) {
    throw new Error(`all test/result units must be the same`);
  }

  if (fallback && fallback.unit !== checkpoints[0].result.unit) {
    throw new Error(`fallback must have the same unit as checkpoints`);
  }

  checkpoints.sort((a, b) => a.test.value - b.test.value);

  return {
    variableArg,
    fallback,
    checkpoints,
  };
}

function isValidArg(arg: Node[]) {
  return (
    arg.length === 3 &&
    arg[0].type === "word" &&
    (arg[1].type === "div" || arg[1].type === "space") &&
    arg[2].type === "word"
  );
}

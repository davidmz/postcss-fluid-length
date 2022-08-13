import { unit } from "postcss-value-parser";

export class UValue {
  public constructor(
    public readonly value: number,
    public readonly unit: string
  ) {
    // empty
  }

  static parse(text: string) {
    const u = unit(text);
    if (!u) {
      throw new Error(`invalid value: ${text}`);
    }
    return new UValue(parseFloat(u.number), u.unit);
  }

  toString() {
    return this.value.toString(10) + this.unit;
  }
}

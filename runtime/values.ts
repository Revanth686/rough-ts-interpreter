// This file defines the runtime values used in the interpreter.

// different types of values like strings, bool, number, null
export type ValueType = "null" | "number";

export interface RuntimeVal {
  type: ValueType;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: "null";
}

// more like StringVal, ObjectVal, etc

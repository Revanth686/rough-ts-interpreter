// This file defines the runtime values used in the interpreter.

// different types of values like strings, bool, number, null
export type ValueType = "null" | "number" | "boolean";

export interface RuntimeVal {
  type: ValueType;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: Boolean;
}

// more like StringVal, ObjectVal, etc

export function MK_NULL(): NullVal {
  return { type: "null", value: null } as NullVal;
}

export function MK_NUMBER(n = 0): NumberVal {
  return { type: "number", value: n } as NumberVal;
}

export function MK_BOOL(b = true): BooleanVal {
  return { type: "boolean", value: b } as BooleanVal;
}

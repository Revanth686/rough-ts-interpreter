import Environment from "../environment";
import evaluate from "../interpreter";

import { type RuntimeVal, type NumberVal, MK_NULL } from "../values";
import { type BinaryExpr, type Identifier } from "../../frontend/ast";

export function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal {
  let result = 0;
  if (operator == "+") result = Number(lhs.value) + Number(rhs.value);
  else if (operator == "-") result = Number(lhs.value) - Number(rhs.value);
  else if (operator == "*") result = Number(lhs.value) * Number(rhs.value);
  //TODO: handle division by zero
  else if (operator == "/") result = Number(lhs.value) / Number(rhs.value);
  else if (operator == "%") result = Number(lhs.value) % Number(rhs.value);
  return { type: "number", value: result };
}

export function eval_binary_expr(
  binop: BinaryExpr,
  env: Environment,
): RuntimeVal {
  //TODO:
  //identifiers inside binaryExpr
  const lhs = evaluate(binop.left, env) as NumberVal; //left recursive
  const rhs = evaluate(binop.right, env) as NumberVal; //right recursive

  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(lhs, rhs, binop.operator);
  }

  //one or both null
  return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment) {
  const val = env.lookupVar(ident.symbol);
  return val;
}

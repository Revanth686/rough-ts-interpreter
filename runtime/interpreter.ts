// A tree walk interpreter that evaluates the AST nodes and produces runtime values.

import { type RuntimeVal, type NumberVal, type NullVal } from "./values";
import Environment from "./environment";

import {
  type Stmt,
  type NumericLiteral,
  type BinaryExpr,
  type Program,
  type Identifier,
} from "../frontend/ast";

function eval_numeric_binary_expr(
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

function evaluate_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  //TODO:
  //identifiers inside binaryExpr
  const lhs = evaluate(binop.left, env) as NumberVal; //left recursive
  const rhs = evaluate(binop.right, env) as NumberVal; //right recursive

  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(lhs, rhs, binop.operator);
  }

  //one or both null
  return { type: "null", value: "null" } as NullVal;
}

function evaluate_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  //return final evaluated result
  return lastEvaluated;
}

function eval_identifier(ident: Identifier, env: Environment) {
  const val = env.lookupVar(ident.symbol);
  return val;
}

export default function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NullLiteral":
      return { type: "null", value: "null" } as NullVal;

    case "NumericLiteral": {
      return {
        type: "number",
        value: (astNode as NumericLiteral).value,
      } as NumberVal;
    }

    case "BinaryExpr": {
      return evaluate_binary_expr(astNode as BinaryExpr, env);
    }

    case "Program": {
      return evaluate_program(astNode as Program, env);
    }

    case "Identifier": {
      return eval_identifier(astNode as Identifier, env);
    }

    default: {
      console.error(
        "Unsupported AST Node Type: ",
        astNode.kind,
        "Node: ",
        astNode,
      );
      process.exit(1);
    }
  }
}

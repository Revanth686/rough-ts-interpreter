// A tree walk interpreter that evaluates the AST nodes and produces runtime values.

import {
  type ValueType,
  type RuntimeVal,
  type NumberVal,
  type NullVal,
} from "./values";

import {
  type Stmt,
  type NodeType,
  type NumericLiteral,
  type BinaryExpr,
  type Program,
} from "../frontend/ast";

function evaluate_binary_expr(binop: BinaryExpr): RuntimeVal {
  //TODO: take care of operator precedence
  //edge case handling of null inside binaryExpr
  //currently: left:expr, right:expr, operator
  const left = evaluate(binop.left); //left recursive
  const right = evaluate(binop.right); //right recursive
  switch (binop.operator) {
    case "+": {
      return {
        type: "number",
        value:
          Number((left as NumberVal).value) +
          Number((right as NumberVal).value),
      } as NumberVal;
    }
    case "-": {
      return {
        type: "number",
        value:
          Number((left as NumberVal).value) -
          Number((right as NumberVal).value),
      } as NumberVal;
    }
    case "*": {
      return {
        type: "number",
        value:
          Number((left as NumberVal).value) *
          Number((right as NumberVal).value),
      } as NumberVal;
    }
    case "/": {
      return {
        type: "number",
        value:
          Number((left as NumberVal).value) /
          Number((right as NumberVal).value),
      } as NumberVal;
    }
    case "%": {
      return {
        type: "number",
        value:
          Number((left as NumberVal).value) %
          Number((right as NumberVal).value),
      } as NumberVal;
    }

    default: {
      console.error(
        "Unsupported binary operator during interpretation: ",
        binop.operator,
      );
      process.exit(1);
    }
  }
}

function evaluate_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }
  //return final evaluated result
  return lastEvaluated;
}

export default function evaluate(astNode: Stmt): RuntimeVal {
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
      return evaluate_binary_expr(astNode as BinaryExpr);
    }

    case "Program": {
      return evaluate_program(astNode as Program);
    }

    // case "BinaryExpr":{
    // }

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

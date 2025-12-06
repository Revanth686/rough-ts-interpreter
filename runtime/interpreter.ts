// A tree walk interpreter that evaluates the AST nodes and produces runtime values.

import { type RuntimeVal, type NumberVal } from "./values";
import Environment from "./environment";
import { evaluate_program, eval_variable_declaration } from "./eval/statements";
import { eval_binary_expr, eval_identifier } from "./eval/expressions";

import {
  type Stmt,
  type NumericLiteral,
  type BinaryExpr,
  type Program,
  type Identifier,
  type VarDeclaration,
} from "../frontend/ast";

export default function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral": {
      return {
        type: "number",
        value: (astNode as NumericLiteral).value,
      } as NumberVal;
    }

    case "BinaryExpr": {
      return eval_binary_expr(astNode as BinaryExpr, env);
    }

    case "Program": {
      return evaluate_program(astNode as Program, env);
    }

    case "VarDeclaration": {
      return eval_variable_declaration(astNode as VarDeclaration, env);
    }

    case "Identifier": {
      return eval_identifier(astNode as Identifier, env);
    }

    default: {
      console.error(
        "Unsupported AST Node Type in interpretation: ",
        astNode.kind,
        "Node: ",
        astNode,
      );
      process.exit(1);
    }
  }
}

import { type RuntimeVal, MK_NULL } from "../values";
import Environment from "../environment";
import evaluate from "../interpreter";

import { type Program, type VarDeclaration } from "../../frontend/ast";

export function evaluate_program(
  program: Program,
  env: Environment,
): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  //return final evaluated result
  return lastEvaluated;
}

export function eval_variable_declaration(
  declaration: VarDeclaration,
  env: Environment,
) {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();
  return env.declareVar(declaration.identifier, value, declaration.constant);
}

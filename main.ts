import Parser from "./frontend/parser";
import readline from "readline";
import evaluate from "./runtime/interpreter";
import Environment from "./runtime/environment";
import { MK_NUMBER, MK_BOOL, MK_NULL } from "./runtime/values";

function repl() {
  const parser = new Parser();

  const env = new Environment();
  //BUG: currently variable declaration is manual
  env.declareVar("x", MK_NUMBER(119));
  env.declareVar("true", MK_BOOL(true));
  env.declareVar("false", MK_BOOL(false));
  env.declareVar("null", MK_NULL());

  console.log("\nRepl v1.0");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function interpret(input: string) {
    const program = parser.produceAST(input);
    // console.log("program: ", JSON.stringify(program));

    const interpretedVal = evaluate(program, env);
    console.log(interpretedVal);
  }

  rl.question("> ", (input) => {
    if (!input || input == "exit") process.exit();
    // console.log(`entered ${input} parsing...`);
    interpret(input);
    rl.close();
  });
}

repl();

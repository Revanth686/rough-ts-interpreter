import Parser from "./frontend/parser";
import readline from "readline";
import evaluate from "./runtime/interpreter";

function repl() {
  const parser = new Parser();

  console.log("\nRepl v1.0");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("> ", (input) => {
    if (!input || input == "exit") process.exit();

    // console.log(`entered ${input} parsing...`);

    const program = parser.produceAST(input);
    // console.log("program: ", JSON.stringify(program));

    const interpretedVal = evaluate(program);
    console.log(interpretedVal);

    rl.close();
  });
}

repl();

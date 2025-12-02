import Parser from "./frontend/parser";
import readline from "readline";

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
    console.log(JSON.stringify(program));
    rl.close();
  });
}

repl();

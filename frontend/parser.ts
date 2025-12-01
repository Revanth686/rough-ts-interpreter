import {
  type Stmt,
  type Program,
  type Expr,
  type BinaryExpr,
  type Identifier,
  type NumericLiteral,
} from "./ast.js";
import { tokenize, type Token, TokenType } from "./lexer";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): Boolean {
    return this.tokens[0].type != TokenType.EOF;
  }
  private at() {
    return this.tokens[0] as Token;
  }
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  public produceAST(sourceCode: string): Program {
    console.log("Producing AST...", sourceCode);
    this.tokens = tokenize(sourceCode);
    const program: Program = { kind: "Program", body: [] };

    //Parse until end of file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  private parse_stmt(): Stmt {
    //parse statments like func decl, for while loops var decl
    //skip to parse expr
    return this.parse_expr();
  }

  private parse_expr(): Expr {
    //parse expressions like binary expr, function calls, identifiers, literals
    return this.parse_primary_expr();
  }

  private parse_primary_expr(): Expr {
    //most basic expr: identifiers and literals
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier: {
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      }

      case TokenType.Number: {
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      }
      default: {
        console.error("Unexpected token: " + JSON.stringify(this.at()));
        process.exit(1);
      }
    }
  }
}

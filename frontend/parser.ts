// -----------------------------------
// -------------     Parser         ---------
// ------   builds the ast using the generated tokens   -----
// ------   basic syntax to symantics conversion   ------
// -----------------------------------

import {
  type Stmt,
  type Program,
  type Expr,
  type BinaryExpr,
  type Identifier,
  type NumericLiteral,
  type NullLiteral,
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

  private expect(expectedType: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != expectedType) {
      console.error(
        "Parser Error:\n",
        err,
        prev,
        " - Expecting: ",
        expectedType,
      );
      process.exit(1);
    }
  }

  /**
   * Produces an (AST) from the given source code string
   * Tokenizes the input and parses statements until the end of the file.
   * @param sourceCode - The raw source code
   * @returns The generated AST as a *Program node*
   */
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
    return this.parse_additive_expr();
  }

  //Order of presedence:
  //9. assignment expr
  //8. member expr
  //7. function call
  //6. logical expr and or
  //5. comparision expr > < >= <= !=
  //4.additive expr
  //3.multiplicative expr
  //2.unary expr
  //1.primary expr
  private parse_additive_expr(): BinaryExpr {
    let left = this.parse_multiplicative_expr(); //bcoz * more precedence and must be parsed b4 + or -
    while (
      (this.at().type == TokenType.BinaryOperator && this.at().value == "-") ||
      this.at().value == "+"
    ) {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left as BinaryExpr;
  }

  private parse_multiplicative_expr(): BinaryExpr {
    let left = this.parse_primary_expr();
    while (
      (this.at().type == TokenType.BinaryOperator && this.at().value == "*") ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left as BinaryExpr;
  }

  private parse_primary_expr(): Expr {
    //most basic expr: identifiers and literals
    const tk = this.at().type;

    //TODO: handle boolean, null token
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

      case TokenType.Null: {
        this.eat();
        return {
          kind: "NullLiteral",
          value: "null",
        } as NullLiteral;
      }

      case TokenType.OpenParen: {
        this.eat(); // open paren
        let value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        ); // if not close paren throw error
        return value;
      }

      default: {
        console.error(
          "Unexpected token during parsing: " + JSON.stringify(this.at()),
        );
        process.exit(1);
      }
    }
  }
}

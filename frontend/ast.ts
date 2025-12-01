// -----------------------------------
// ------------- AST (Abstract Syntax Tree) Types ---------
// ------ Defines the stucture of our language's AST -----
// -----------------------------------

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "BinaryExpr"
  | "Identifier";

//NOTE: currently statement doesn't return anything
//but in some REPL's statements evaluate to *undefined*
//ex: Let x=119 --statement
//x=119 --assignment expression in c, cpp, java -evaluate to 119  but in python its a statement

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  //foo + bar
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  //foo
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  //675
  kind: "NumericLiteral";
  value: Number;
}

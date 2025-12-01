import { readFileSync } from "fs";

console.log("hello world");
//Let x = 112
//[LetToken, IdentifierToken("x"), EqualToken, NumberToken(112)]

export enum TokenType {
  Number,
  Equals,
  Identifier,
  OpenParen,
  CloseParen,

  BinaryOperator,

  Let,
  for,
}

export interface Token {
  value: string;
  type: TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

//helper function to create tokens
function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isalpha(src: string): Boolean {
  return src.toUpperCase() != src.toLowerCase();
}
function isint(char: string): Boolean {
  // return char >= "0" && char <= "9";
  const c = char.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}
function isskippable(src: string): Boolean {
  return src === " " || src == "\t" || src == "\n";
}

export function tokenize(sourceCode: string): Token[] {
  const tokens: Token[] = [];

  let src = sourceCode.split("");

  //read each character and make tokens
  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      //multi-character tokens >= => let for
      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      }

      //identifier tokens can be reserved keyword or user defined identifier
      else if (isalpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }

        const reservedToken = KEYWORDS[ident]; //let for fn
        if (reservedToken == undefined)
          tokens.push(token(ident, TokenType.Identifier));
        else tokens.push(token(ident, reservedToken));
      }

      //skip whitespace
      else if (isskippable(src[0])) {
        src.shift();
      } else {
        console.error("Unexpected character: " + src[0]);
        process.exit(1);
      }
    }
  }

  return tokens;
}

const sourceCode = readFileSync("test.rv", "utf8");
console.log("Tokenizing lexer.ts...");
for (const token of tokenize(sourceCode)) {
  console.log(token);
}
console.log("Done");

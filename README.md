# lex.js
`lex.js` is a regex-based lexical analyzer for JavaScript. Here's a quick example of using it to parse a simple language:

```javascript
let tokens = {
  plus: /\+/,
  minus: /-/,
  times: /\*/,

  number: lex.token(/\d+/, function (ctx, lexeme) {
    lexeme.value = +lexeme.value;
  }),

  // skip white spaces
  whitespace: lex.token(/\s+/, function (ctx, lexeme) {
    ctx.ignore();
  })
};

let lexer = new lex.Lexer(tokens);

for (let lexeme in lexer.tokenize("3 + 5 * 6 - 7")) {
  print("[" + lexeme.type + ", " + lexeme.value + "]");
}
```

This will output the following:

    [number, 3]
    [plus, +]
    [number, 5]
    [times, *]
    [number, 6]
    [minus, -]
    [number, 7]

# lex.js
`lex.js` is a regex-based lexical analyzer for JavaScript. Here's a quick example of using it to tokenize a simple language:

```javascript
var tokens = {
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

var lexer = new lex.Lexer(tokens);
lexer.tokenize("3 + 5 * 6 - 7").forEach(function (lexeme) {
  console.log("[" + lexeme.type + ", " + lexeme.value + "]");
});
```

This will output the following:

    [number, 3]
    [plus, +]
    [number, 5]
    [times, *]
    [number, 6]
    [minus, -]
    [number, 7]

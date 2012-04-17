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
var iter = lexer.tokenize("3 + 5 * 6 - 7");

for (var lexeme; lexeme = iter.next();) {
  console.log(lexeme);
}
```

This will output the following:

    { token: 'number', value: 3 }
    { token: 'plus', value: '+' }
    { token: 'number', value: 5 }
    { token: 'times', value: '*' }
    { token: 'number', value: 6 }
    { token: 'minus', value: '-' }
    { token: 'number', value: 7 }

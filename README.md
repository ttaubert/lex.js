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

# Example #2 - PHP tokenizer (small subset)

```javascript
var tokens = {
  ret: /return/,
  funcdef: /function/,
  variable: /\$[a-zA-Z][_a-zA-Z0-9]*/,
  identifier: /[a-zA-Z][_a-zA-Z0-9]*/,
  character: /[\+\-\*\/\(\)\{\};,]/,

  number: lex.token(/\d+/, function (ctx, lexeme) {
    lexeme.value = +lexeme.value;
  }),

  // skip white spaces
  whitespace: lex.token(/\s+/, function (ctx, lexeme) {
    ctx.ignore();

    // count new lines for better error reporting
    var newlines = lexeme.value.match(/\n/g);
    if (newlines) {
      ctx.lineno = (ctx.lineno || 1) + newlines.length;
    }
  }),

  // throw for unexpected characters
  unexpected: lex.token(/./, function (ctx, lexeme) {
    var line = ctx.lineno || 0;
    throw "Unexpected character '" + lexeme.value + "' at line " + line + ".";
  })
};

var lexer = new lex.Lexer(tokens);
var iter = lexer.tokenize("function main($a, $b) { return ($a + 2) * $b; }");

for (var lexeme; lexeme = iter.next();) {
  console.log(lexeme);
}
```

The resulting lexemes:

    { token: 'funcdef', value: 'function' }
    { token: 'identifier', value: 'main' }
    { token: 'character', value: '(' }
    { token: 'variable', value: '$a' }
    { token: 'character', value: ',' }
    { token: 'variable', value: '$b' }
    { token: 'character', value: ')' }
    { token: 'character', value: '{' }
    { token: 'ret', value: 'return' }
    { token: 'character', value: '(' }
    { token: 'variable', value: '$a' }
    { token: 'character', value: '+' }
    { token: 'number', value: 2 }
    { token: 'character', value: ')' }
    { token: 'character', value: '*' }
    { token: 'variable', value: '$b' }
    { token: 'character', value: ';' }
    { token: 'character', value: '}' }

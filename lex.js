let lex = (function () {

  function token(def, callback) {
    if (def instanceof RegExp)
      return new Token(def, callback);

    throw "invalid token definition";
  }

  function Lexer(tokens) {
    this.tokens = tokens;

    for (let [type, def] in Iterator(this.tokens)) {
      if (!(def instanceof Token)) {
        this.tokens[type] = token(def);
      }
    }
  }

  Lexer.prototype = {
    tokens: null,

    tokenize: function Lexer_tokenize(input) {
      let lexeme;

      let context = {
        skip: function Context_skip(num) {
          input = input.slice(num);
        },

        ignore: function Context_ignore() {
          lexeme = null;
        }
      };

      loop: while (input.length) {
        // iterate through and match all tokens
        for (let [type, token] in Iterator(this.tokens)) {
          let value = token.match(input);

          if (value) {
            // skip the lexeme we just found
            context.skip(value.length);

            // create the lexeme
            lexeme = new Lexeme(type, value);

            // call the token callback if any
            if (token.callback) {
              token.callback(context, lexeme);
            }

            if (lexeme) {
              yield lexeme;
            }

            continue loop;
          }
        }

        // nothing found
        context.skip(1);
      }
    }
  };

  function Token(pattern, callback) {
    this.pattern = pattern;
    this.callback = callback;
  }

  Token.prototype = {
    pattern: null,
    callback: null,

    match: function Token_match(string) {
      let match = string.match(this.pattern);
      if (match && string.indexOf(match[0]) == 0) {
        return match[0];
      }

      return "";
    }
  };

  function Lexeme(type, value) {
    this.type = type;
    this.value = value;
  }

  Lexeme.prototype = {
    type: null,
    value: null
  };

  return {
    token: token,
    Lexer: Lexer
  };
})();

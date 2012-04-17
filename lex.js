function LexerContext(input) {
  this.input = input;
}

LexerContext.prototype = {
  input: null,

  ignore: function Context_ignore() {
  },

  skip: function Context_skip(num) {
    this.input = this.input.slice(num);
  }
};

function LexerIterator(tokens, input) {
  this.tokens = tokens;
  this.context = new LexerContext(input);
}

LexerIterator.prototype = {
  tokens: null,
  context: null,

  next: function LexerIterator_next() {
    var next;
    var context = this.context;

    context.ignore = function Context_ignore() {
      next = null;
    };

    loop: while (context.input.length) {
      // iterate through and match all tokens
      for (var name in this.tokens) {
        var token = this.tokens[name];
        var value = token.match(context.input);

        if (value) {
          // skip the lexeme we just found
          context.skip(value.length);

          // create the lexeme
          next = {token: name, value: value};

          // call the token callback if any
          if (token.callback) {
            token.callback(context, next);
          }

          if (next) {
            return next;
          }

          continue loop;
        }
      }

      // nothing found
      context.skip(1);
    }
  }
};

function Lexer(tokens) {
  this.tokens = tokens;

  for (var name in this.tokens) {
    var def = this.tokens[name];
    if (!(def instanceof Token)) {
      this.tokens[name] = token(def);
    }
  }
}

Lexer.prototype = {
  tokens: null,

  tokenize: function Lexer_tokenize(input) {
    return new LexerIterator(this.tokens, input);
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
    var match = string.match(this.pattern);
    if (match && string.indexOf(match[0]) == 0) {
      return match[0];
    }

    return "";
  }
};

function token(def, callback) {
  if (def instanceof RegExp)
    return new Token(def, callback);

  throw "invalid token definition";
}

exports.token = token;
exports.Lexer = Lexer;

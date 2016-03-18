var abs = require('../index')
  , ast = require('mkast');
ast.src('[readme](/README.md)')
  .pipe(abs({base: 'https://github.com/mkdoc/mkabs'}))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);

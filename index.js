var mkast = require('mkast')
  , path = require('path')
  , Absolute = require('./absolute');

/**
 *  Prepends a base URL to link destinations.
 *
 *  When no base is given an attempt to load `package.json` from the 
 *  current working directory is made and a URL is extracted from `homepage` or 
 *  `repository.url`; if there is still no base path then the operation is a 
 *  passthrough stream (noop).
 *
 *  @function abs
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {String} base path to prepend to relative links.
 *  @option {Readable} [input] input stream.
 *  @option {Writable} [output] output stream.
 *
 *  @returns an output stream.
 */
function abs(opts, cb) {

  opts = opts || {};
  opts.input = opts.input;
  opts.output = opts.output;

  var base = opts.base
    , pkg
    , rel = opts.rel || '/blob/master'

  if(!base) {
    try {
      pkg = require(path.join(process.cwd(), 'package.json'));
      /* istanbul ignore next: not going to mock this */
      if(pkg.homepage) {
        base = pkg.homepage; 
      /* istanbul ignore next: not going to mock change in cwd() */
      }else if(pkg.repository && pkg.repository.url) {
        base =  pkg.repository
          .url.replace(/\.(git)$/, '') + rel; 
      }
    // optional auto-extract logic
    }catch(e) {}
  }

  var stream = new Absolute({base: base});

  if(!opts.input || !opts.output) {
    return stream; 
  }

  mkast.parser(opts.input)
    .pipe(stream)
    .pipe(mkast.stringify())
    .pipe(opts.output);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

module.exports = abs;

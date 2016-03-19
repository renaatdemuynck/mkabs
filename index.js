var mkast = require('mkast')
  , path = require('path')
  , Absolute = require('./absolute');

/**
 *  Prepends a base URL to relative link destinations.
 *
 *  A relative link is deemed to be a link beginning a slash (/) unless the 
 *  `greedy` option is given which will also include anchor links beginning 
 *  with a hash (#) and query string links beginning with a question mark (?).
 *
 *  When no base is given an attempt to load `package.json` from the 
 *  current working directory is made and a URL is extracted from `homepage` or 
 *  `repository.url`; if there is still no base path then the operation is a 
 *  passthrough stream (noop).
 *
 *  If `rel` is specified it is appended when the source for `base` is the 
 *  `repository.url` field.
 *
 *  @function abs
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {String} base path to prepend to relative links.
 *  @option {String=/blob/master} rel relative path to append to auto url.
 *  @option {Boolean} [greedy] also convert links beginning with # and ?.
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

  var stream = new Absolute({base: base, greedy: opts.greedy});

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

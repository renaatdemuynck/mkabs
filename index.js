var mkast = require('mkast')
  , Absolute = require('./absolute');

/**
 *  Prepends a base URL to link destinations.
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

  var base = opts.base;

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

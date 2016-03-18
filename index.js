var mkast = require('mkast')
  , Absolute = require('./absolute')
  , Serialize = require('mkast/lib/serialize');

/**
 *  Prepends a base URL to link destinations.
 *
 *  @function abs
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
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

  var stream = new Absolute({base: base})
    , serialize = new Serialize();

  if(!opts.input || !opts.output) {
    return stream; 
  }

  mkast.parser(opts.input)
    .pipe(stream)
    .pipe(serialize)
    .pipe(opts.output);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

module.exports = abs;

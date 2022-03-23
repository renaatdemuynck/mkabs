var through = require('through3')
  , ast = require('mkast')
  , Node = ast.Node
  , walker = ast.NodeWalker.walk
  , pattern = /^[\/]/
  , greedy = /^[\/#\?]/;

/**
 *  Makes relative link destinations absolute.
 *
 *  @module {constructor} Absolute
 *  @param {Object} [opts] stream options.
 *
 *  @option {String} [base] prepend path for relative links.
 *  @option {Boolean=false} [greedy] convert # and ? link destinations.
 */
function Absolute(opts) {
  opts = opts || {};

  // noop with no base path
  this.base = opts.base || '';

  // default to false for backwards compatibility
  this.images = opts.images || false;

  // default to `base` if not set
  this.imageBase = opts.imageBase || (opts.images && opts.base);

  this.pattern = opts.greedy ? greedy : pattern;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member Absolute
 *
 *  @param {Array} node input AST node.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {
  var base = this.base
    , images = this.images
    , imageBase = this.imageBase
    , ptn = this.pattern;

  function linkify(node) {
    if(Node.is(node, Node.LINK) || (Node.is(node, Node.IMAGE) && images && !imageBase)) {
      /* istanbul ignore next: must have a string value for re.test() */
      var dest = node.destination || '';
      if(ptn.test(dest)) {
        node.destination = base + dest; 
      }
    } else if(Node.is(node, Node.IMAGE) && imageBase) {
      /* istanbul ignore next: must have a string value for re.test() */
      var dest = node.destination || '';
      if(ptn.test(dest)) {
        node.destination = imageBase + dest; 
      }
    } 
  }

  linkify(chunk);
  walker(chunk, linkify);

  this.push(chunk);
  cb();
}

module.exports = through.transform(transform, {ctor: Absolute})

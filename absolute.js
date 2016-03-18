var through = require('through3')
  , Node = require('mkast').Node
  //, attach = require('mkast/lib/attach');
  //
  //
function walker(node, cb) {
  var child = node._firstChild;
  while(child) {
    cb(child);
    if(child._firstChild) {
      walker(child._firstChild, cb);
    }
    child = child._next; 
  }
}

/**
 *  Makes relative link destinations absolute.
 *
 *  @module {constructor} AstAbsolute
 *  @param {Object} [opts] stream options.
 *
 *  @option {String} base prepend path for relative links.
 */
function AstAbsolute(opts) {
  opts = opts || {};
  this.refs = [];
  this.base = opts.base;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstAbsolute
 *
 *  @param {Array} node input AST node.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {

  var base = this.base;

  function linkify(node) {
    if(Node.is(node, Node.LINK)) {
      console.error('got link node');
      var dest = node._destination || ''
        , re = /^[#\/]/;

      if(re.test(dest)) {
        node._destination = base + dest; 
      }
    } 
  }

  linkify(chunk);
  walker(chunk, linkify);
  this.push(chunk);
  cb();
}

module.exports = through.transform(transform, {ctor: AstAbsolute})

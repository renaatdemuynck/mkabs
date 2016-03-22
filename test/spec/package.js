var expect = require('chai').expect
  , fs = require('fs')
  , mkast = require('mkast')
  , Node = mkast.Node
  , parser = new mkast.Parser()
  , mkabs = require('../../index')
  , utils = require('../util')
  , collect = mkast.NodeWalker.collect;

describe('mkabs:', function() {

  it('should use repository with no base (package.json)', function(done) {
    var source = 'test/fixtures/abs.md'
      , target = 'target/abs.json.log'
      , data = parser.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data.file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output}
      , base = require('../../package.json')
          .repository.url.replace(/\.git$/, '') + '/blob/master';
    
    function onFinish() {
      var result = utils.result(target);

      // open document
      expect(result[0].type).to.eql(Node.DOCUMENT);
      // mock document paragraph
      expect(result[1].type).to.eql(Node.PARAGRAPH);

      var links = collect(result, Node.LINK)
        , slash = links[0]
        , anchor = links[1]
        , absolute = links[2]
        , query = links[3];

      expect(slash.destination).to.eql(base + '/README.md');
      expect(anchor.destination).to.eql('#api');
      expect(absolute.destination).to.eql('http://example.com');
      expect(query.destination).to.eql('?foo=val');

      // eof main document
      expect(result[2].type).to.eql(Node.EOF);

      done();
    }

    mkabs(opts, onFinish);
  });

});

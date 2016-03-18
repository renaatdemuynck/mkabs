var expect = require('chai').expect
  , fs = require('fs')
  , mkast = require('mkast')
  , Node = mkast.Node
  , parser = new mkast.Parser()
  , mkabs = require('../../index')
  , utils = require('../util');

describe('mkabs:', function() {

  it('should make relative links absolute w/ callback', function(done) {
    var source = 'test/fixtures/abs.md'
      , target = 'target/abs.json.log'
      , data = parser.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data._file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output};
    
    function onFinish() {
      var result = utils.result(target);

      //console.dir(result);

      // open document
      //expect(result[0]._type).to.eql(Node.DOCUMENT);
      // mock document paragraph
      //expect(result[1]._type).to.eql(Node.PARAGRAPH);
      // eof main document
      //expect(result[2]._type).to.eql(Node.EOF);

      // link reference document + paragraph
      //expect(result[3]._type).to.eql(Node.DOCUMENT);
      //expect(result[4]._type).to.eql(Node.PARAGRAPH);
      //expect(result[4]._firstChild._type).to.eql(Node.LINK);
      //expect(result[4]._firstChild._linkType).to.eql('ref');
      //expect(result[4]._firstChild._label).to.eql('example');
      //expect(result[4]._firstChild._destination).to.eql('http://example.com');
      //expect(result[5]._type).to.eql(Node.EOF);

      done();
    }

    mkabs(opts, onFinish);
  });

});

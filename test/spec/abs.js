var expect = require('chai').expect
  , fs = require('fs')
  , mkast = require('mkast')
  , Node = mkast.Node
  , parser = new mkast.Parser()
  , mkabs = require('../../index')
  , utils = require('../util');

describe('mkabs:', function() {
  
  it('should return stream with no options', function(done) {
    var stream = mkabs();
    expect(stream).to.be.an('object');
    done();
  });

  it('should make relative links absolute', function(done) {
    var source = 'test/fixtures/abs.md'
      , target = 'target/abs.json.log'
      , data = parser.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data._file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output};
    
    mkabs(opts);

    output.once('finish', function() {
      var result = utils.result(target);

      //console.dir(result);

      // open document
      expect(result[0]._type).to.eql(Node.DOCUMENT);
      // mock document paragraph
      expect(result[1]._type).to.eql(Node.PARAGRAPH);

      var link1 = result[1]._firstChild;

      console.dir(link1);


      // eof main document
      expect(result[2]._type).to.eql(Node.EOF);

      done();
    })
  });

});

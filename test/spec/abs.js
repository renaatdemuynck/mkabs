var expect = require('chai').expect
  , fs = require('fs')
  , mkast = require('mkast')
  , Node = mkast.Node
  , parser = new mkast.Parser()
  , mkabs = require('../../index')
  , Absolute = require('../../absolute')
  , utils = require('../util')
  , collect = mkast.NodeWalker.collect;

describe('mkabs:', function() {

  it('should create stream with no options', function(done) {
    var stream = new Absolute();
    expect(stream).to.be.an('object');
    done();
  });
  
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
    data.file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output, base: 'http://base.com'};
    
    mkabs(opts);

    output.once('finish', function() {
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

      expect(slash.destination).to.eql('http://base.com/README.md');
      expect(anchor.destination).to.eql('#api');
      expect(absolute.destination).to.eql('http://example.com');
      expect(query.destination).to.eql('?foo=val');

      // eof main document
      expect(result[2].type).to.eql(Node.EOF);

      done();
    })
  });

  it('should make relative image URLs absolute when `images` option is set', function(done) {
    var source = 'test/fixtures/image.md'
      , target = 'target/abs.json.log'
      , data = parser.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data.file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output, base: 'http://base.com', images: true};
    
    mkabs(opts);

    output.once('finish', function() {
      var result = utils.result(target);

      // open document
      expect(result[0].type).to.eql(Node.DOCUMENT);
      // mock document paragraph
      expect(result[1].type).to.eql(Node.PARAGRAPH);

      var images = collect(result, Node.IMAGE)
        , slash = images[0]
        , absolute = images[1];

      expect(slash.destination).to.eql('http://base.com/example.png');
      expect(absolute.destination).to.eql('http://example.com/external.png');

      // eof main document
      expect(result[2].type).to.eql(Node.EOF);

      done();
    })
  });

  it('should not make relative image URLs absolute when `images` option is not set', function(done) {
    var source = 'test/fixtures/image.md'
      , target = 'target/abs.json.log'
      , data = parser.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data.file = source;

    var input = mkast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {input: input, output: output, base: 'http://base.com'};
    
    mkabs(opts);

    output.once('finish', function() {
      var result = utils.result(target);

      // open document
      expect(result[0].type).to.eql(Node.DOCUMENT);
      // mock document paragraph
      expect(result[1].type).to.eql(Node.PARAGRAPH);

      var images = collect(result, Node.IMAGE)
        , slash = images[0];

      expect(slash.destination).to.eql('/example.png');

      // eof main document
      expect(result[2].type).to.eql(Node.EOF);

      done();
    })
  });

});

# Absolute Links

[![Build Status](https://travis-ci.org/mkdoc/mkabs.svg?v=3)](https://travis-ci.org/mkdoc/mkabs)
[![npm version](http://img.shields.io/npm/v/mkabs.svg?v=3)](https://npmjs.org/package/mkabs)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkabs/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkabs?branch=master)

> Make relative links absolute

Takes a base URL and prepends it to relative links to make them absolute. Relative links are deemed to be those beginning with a `/`, if the `greedy` option is specified than anchor links (#) and query string links (?) are also made absolute.

The typical use case is for README documents whose forward slash links work as expected when published to [github][] but are broken when published to [npm][].

## Install

```
npm i mkabs --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Help](#help)
- [API](#api)
  - [abs](#abs)
  - [Absolute](#absolute)
- [License](#license)

---

## Usage

Create the stream and write a [commonmark][] document:

```javascript
var abs = require('mkabs')
  , ast = require('mkast');
ast.src('[readme](/README.md)')
  .pipe(abs({base: 'https://github.com/mkdoc/mkabs'}))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
```

## Example

Make links absolute using data in `package.json`:

```shell
mkcat README.md | mkabs | mkout
```

Make links absolute using an specific URL:

```shell
mkcat README.md | mkabs -b http://example.com | mkout
```

## Help

```
Usage: mkabs [options]

  Make relative links absolute.

Options
  -b, --base=[URL]        Base URL for absolute links
  -r, --relative=[PATH]   Relative path when repository url
  -g, --greedy            Convert links starting with # and ?
  -h, --help              Display help and exit
  --version               Print the version and exit

mkabs@1.2.3
```

## API

### abs

```javascript
abs([opts][, cb])
```

Prepends a base URL to relative link destinations.

A relative link is deemed to be a link beginning a slash (/) unless the
`greedy` option is given which will also include anchor links beginning
with a hash (#) and query string links beginning with a question mark (?).

When no base is given an attempt to load `package.json` from the
current working directory is made and a URL is extracted from `homepage` or
`repository.url`; if there is still no base path then the operation is a
passthrough stream (noop).

If `rel` is specified it is appended when the source for `base` is the
`repository.url` field.

Returns an output stream.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `base` String path to prepend to relative links.
* `rel` String=/blob/master relative path to append to repository url.
* `greedy` Boolean also convert links beginning with # and ?.
* `input` Readable input stream.
* `output` Writable output stream.

### Absolute

```javascript
Absolute([opts])
```

Makes relative link destinations absolute.

* `opts` Object stream options.

#### Options

* `base` String prepend path for relative links.
* `greedy` Boolean=false convert # and ? link destinations.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on April 18, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkparse]: https://github.com/mkdoc/mkparse
[commonmark]: http://commonmark.org
[npm]: https://www.npmjs.com
[github]: https://github.com
[jshint]: http://jshint.com
[jscs]: http://jscs.info


# Absolute Links

<? @include readme/badges.md ?>

> Make relative links absolute

Takes a base URL and prepends it to relative links to make them absolute. Relative links are deemed to be those beginning with a `/`, if the `greedy` option is specified than anchor links (#) and query string links (?) are also made absolute.

The typical use case is for README documents whose forward slash links work as expected when published to [github][] but are broken when published to [npm][].

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

## Usage

Create the stream and write a [commonmark][] document:

<? @source {javascript=s/\.\.\/index/mkabs/gm} usage.js ?>

<? @include {=readme} help.md ?>

<? @exec mkapi index.js absolute.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>

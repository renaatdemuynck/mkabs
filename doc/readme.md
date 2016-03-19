# Absolute Links

<? @include readme/badges.md ?>

> Make relative links absolute

Takes a base URL and prepends it to relative links to make them absolute. Relative links are deemed to be those beginning with a `/`, if the `greedy` option is specified than anchor links (#) and query string links (?) are also made absolute.

<? @include {=readme} install.md ?>

## Usage

Create the stream and write a [commonmark][] document:

<? @source {javascript=s/\.\.\/index/mkabs/gm} usage.js ?>

<? @exec mkapi index.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>

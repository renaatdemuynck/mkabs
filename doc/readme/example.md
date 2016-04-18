## Example

Make links absolute using data in `package.json`:

```shell
mkcat README.md | mkabs | mkout
```

Make links absolute using a specific URL:

```shell
mkcat README.md | mkabs -b http://example.com | mkout
```

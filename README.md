A babel plugin to generate React PropTypes definitions from Flow type declarations.

## Example

With this input:

```js
// TODO: put example here
```

The output will be:

```js
// TODO: put example here
```


## Install

First install the plugin:

```sh
npm install --save-dev babel-plugin-flow-react-proptypes
```

Then add it to your babelrc:

```json
{
  "presets": ["..."],
  "plugins": ["flow-react-proptypes"]
}
```

To save some bytes in production, you can also only enable it in development mode.

```json
{
  "presets": ["..."],
  "env": {
    "development": {
      "plugins": ["flow-react-proptypes"]
    }
    }
}
```

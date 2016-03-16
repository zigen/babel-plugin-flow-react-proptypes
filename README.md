A babel plugin to generate React PropTypes definitions from Flow type declarations.

## Example

With this input:

```js
var React = require('react');

type IFooProps = {
  id?: string,
  count: number,
  anObject: object,
  friends: Array<string>,
  foo: Bar,
  randomJunk: any,
  sound: 'QUACK' | 'BARK' | 5,
  numOrString: number | string,
  user: {
    id: string,
    createdAt: Date,
  }
}

export default class Foo<IFooProps> extends React.Component { }
```

The output will be:

```js
var React = require('react');

var Foo = function (_React$Component) {
  _inherits(Foo, _React$Component);

  function Foo<IFooProps>() {
    _classCallCheck(this, Foo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo).apply(this, arguments));
  }

  return Foo;
}(React.Component);

Foo.propTypes = {
  id: React.PropTypes.string,
  count: React.PropTypes.number.isRequired,
  anObject: React.PropTypes.any.isRequired,
  friends: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  foo: React.PropTypes.any.isRequired,
  randomJunk: React.PropTypes.any.isRequired,
  sound: React.PropTypes.oneOf(['QUACK', 'BARK', 5]).isRequired,
  numOrString: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
  user: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    createdAt: React.PropTypes.any.isRequired
  }).isRequired
};

exports.default = Foo;
```

## Usage

This plugin searches for a type declaration (`type FooProps = {...}`) that has a name containing 'Props'.

It then searches for a class declaration, and it attaches a `propTypes` property to the class.

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

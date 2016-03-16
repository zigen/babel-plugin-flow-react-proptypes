'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

type IFooProps = {
  id?: string;
  count: number;
  anObject: object;
  friends: Array<string>;
  foo: Bar;
  randomJunk: any;
  sound: 'QUACK' | 'BARK' | 5;
  numOrString: number | string;
  user: {
    id: string;
    createdAt: Date;
  };
};

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


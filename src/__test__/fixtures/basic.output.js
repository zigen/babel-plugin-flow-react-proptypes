'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var Foo = function (_React$Component) {
  _inherits(Foo, _React$Component);

  function Foo() {
    _classCallCheck(this, Foo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo).apply(this, arguments));
  }

  return Foo;
}(React.Component);

Foo.propTypes = {
  an_optional_string: React.PropTypes.string,
  a_number: React.PropTypes.number.isRequired,
  a_generic_object: React.PropTypes.any.isRequired,
  array_of_strings: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  instance_of_Bar: React.PropTypes.any.isRequired,
  anything: React.PropTypes.any.isRequired,
  one_of: React.PropTypes.oneOf(['QUACK', 'BARK', 5]).isRequired,
  onw_of_type: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
  nested_object_level_1: React.PropTypes.shape({
    string_property_1: React.PropTypes.string.isRequired,
    nested_object_level_2: React.PropTypes.shape({
      nested_object_level_3: React.PropTypes.shape({
        string_property_3: React.PropTypes.string.isRequired
      }).isRequired,
      string_property_2: React.PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
exports.default = Foo;


'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Foo;
var React = require('react');

function Foo(_ref) {
  var _ref$x = _ref.x;
  var x = _ref$x === undefined ? 1 : _ref$x;
  var _ref$y = _ref.y;
  var y = _ref$y === undefined ? 'foo' : _ref$y;
}
Foo.propTypes = {
  x: require('react').PropTypes.number,
  y: require('react').PropTypes.string
};


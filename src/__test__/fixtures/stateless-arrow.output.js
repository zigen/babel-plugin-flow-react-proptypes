'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var React = require('react');

var Foo = function Foo(props) {
  React.createElement(
    'div',
    null,
    props.x
  );
};

Foo.propTypes = {
  x: require('react').PropTypes.number
};
exports.default = Foo;


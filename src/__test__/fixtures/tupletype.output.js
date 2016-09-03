'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Foo;
var React = require('react');

function Foo(props) {
  React.createElement('div', null);
}
Foo.propTypes = {
  an_optional_string: require('react').PropTypes.string,
  tupletype: require('react').PropTypes.arrayOf(require('react').PropTypes.any).isRequired
};


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
  a_number: require('react').PropTypes.number.isRequired,
  a_boolean: require('react').PropTypes.bool.isRequired,
  a_generic_object: require('react').PropTypes.object.isRequired,
  array_of_strings: require('react').PropTypes.arrayOf(require('react').PropTypes.string).isRequired,
  instance_of_Bar: require('react').PropTypes.any.isRequired,
  anything: require('react').PropTypes.any.isRequired,
  one_of: require('react').PropTypes.oneOf(['QUACK', 'BARK', 5]).isRequired,
  onw_of_type: require('react').PropTypes.oneOfType([require('react').PropTypes.number, require('react').PropTypes.string]).isRequired,
  nested_object_level_1: require('react').PropTypes.shape({
    string_property_1: require('react').PropTypes.string.isRequired,
    nested_object_level_2: require('react').PropTypes.shape({
      nested_object_level_3: require('react').PropTypes.shape({
        string_property_3: require('react').PropTypes.string.isRequired
      }).isRequired,
      string_property_2: require('react').PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  should_error_if_provided: function should_error_if_provided(props, propName, componentName) {
    if (props[propName] != null) return new Error('Invalid prop `' + propName + '` of value `' + value + '` passed to `' + componentName + '`. Expected undefined or null.');
  }
};


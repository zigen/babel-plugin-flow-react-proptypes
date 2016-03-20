var t = require('babel-types');

var $debug = () => {};
// var $debug = console.error.bind(console);
exports.$debug = $debug;

const PLUGIN_NAME = 'babel-plugin-flow-react-proptypes';
exports.PLUGIN_NAME = PLUGIN_NAME;

exports.makeLiteral = function makeLiteral(value) {
  if (typeof value === 'string') return t.stringLiteral(value);
  else if (typeof value === 'number') return t.numericLiteral(value)
  else if (typeof value === 'boolean') return t.booleanLiteral(value)
  else {
    $debug('Encountered invalid literal', value);
    throw new TypeError(`Invalid type supplied, this is a bug in ${PLUGIN_NAME}, typeof is ${typeof value} with value ${value}`);
  }
}

exports.getExportNameForType = (name) => 'babelPluginFlowReactPropTypes_proptype_' + name;

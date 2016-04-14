import * as t from 'babel-types';

export const $debug = () => {};
// export const $debug = console.error.bind(console);

export const PLUGIN_NAME = 'babel-plugin-flow-react-proptypes';

export function makeLiteral(value) {
  if (typeof value === 'string') return t.stringLiteral(value);
  else if (typeof value === 'number') return t.numericLiteral(value);
  else if (typeof value === 'boolean') return t.booleanLiteral(value);
  else {
    $debug('Encountered invalid literal', value);
    throw new TypeError(`Invalid type supplied, this is a bug in ${PLUGIN_NAME}, typeof is ${typeof value} with value ${value}`);
  }
}

export function getExportNameForType(name) {
  return `babelPluginFlowReactPropTypes_proptype_${name}`;
}

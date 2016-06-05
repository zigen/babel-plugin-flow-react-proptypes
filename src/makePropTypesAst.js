import {$debug, makeLiteral, PLUGIN_NAME} from './util';
import * as t from 'babel-types';
import template from 'babel-template';

export default function makePropTypesAst(propTypeData) {
  const rootProperties = propTypeData.properties.map(({key, value}) => {
    return t.objectProperty(
      t.identifier(key),
      makePropType(value)
    );
  });
  return t.objectExpression(rootProperties);
};

function makePropType(data) {
  const method = data.type;

  let reactNode = t.callExpression(t.identifier('require'), [makeLiteral('react')]);
  let node = t.memberExpression(reactNode, t.identifier('PropTypes'));
  let isRequired = true;

  if (method === 'any' || method === 'string' || method === 'number' || method === 'bool' || method === 'object' ||
      method === 'array' || method === 'func') {
    node = t.memberExpression(node, t.identifier(method));
  }
  else if (method === 'raw') {
    node = t.identifier(data.value);
    isRequired = false;
  }
  else if (method === 'shape') {
    const shapeObjectProperties = data.properties.map(({key, value}) => {
      return t.objectProperty(
        t.identifier(key),
        makePropType(value)
      );
    });
    const shapeObjectLiteral = t.objectExpression(shapeObjectProperties);
    node = t.callExpression(
      t.memberExpression(node, t.identifier('shape')),
      [shapeObjectLiteral]
    );
  }
  else if (method === 'arrayOf') {
    node = t.callExpression(
      t.memberExpression(node, t.identifier('arrayOf')),
      [makePropType(data.of)]
    );
  }
  else if (method === 'oneOf') {
    node = t.callExpression(
      t.memberExpression(node, t.identifier('oneOf')),
      [t.arrayExpression(data.options.map(makeLiteral))]
    );
  }
  else if (method === 'oneOfType') {
    node = t.callExpression(
      t.memberExpression(node, t.identifier('oneOfType')),
      [t.arrayExpression(data.options.map(makePropType))]
    );
  }
  else if (method === 'void') {
    node = dontSetTemplate().expression;
  }
  else {
    $debug('Unknown node ' + JSON.stringify(data, null, 2));
    throw new Error(`${PLUGIN_NAME} processing error: This is an internal error that should never happen. ` +
      `Report it immediately with the source file and babel config. Data: ${data}`);
  }

  if (isRequired && data.isRequired && method !== 'void') {
    node = t.memberExpression(node, t.identifier('isRequired'));
  }

  return node;
}

const dontSetTemplate = template(`
(props, propName, componentName) => {
  if(props[propName] != null) return new Error(\`Invalid prop \\\`\${propName}\\\` of value \\\`\${value}\\\` passed to \\\`\${componentName\}\\\`. Expected undefined or null.\`);
}
`);

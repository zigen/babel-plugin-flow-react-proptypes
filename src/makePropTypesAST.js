var {$debug, makeLiteral, PLUGIN_NAME} = require('./util');

module.exports =
function makePropTypesAST(t, propTypeData) {
  var makePropType = (data) => {
    var method = data.type;

    var node = t.memberExpression(t.identifier('React'), t.identifier('PropTypes'));

    if (method === 'any' || method === 'string' || method === 'number' || method === 'bool' || method === 'object' || method === 'array') {
      node = t.memberExpression(node, t.identifier(method));
    }
    else if (method === 'shape') {
      var shapeObjectProperties = data.properties.map(({key, value}) => {
        return t.objectProperty(
          t.identifier(key),
          makePropType(value)
        )
      });
      var shapeObjectLiteral = t.objectExpression(shapeObjectProperties);
      node = t.callExpression(
        t.memberExpression(node, t.identifier('shape')),
        [shapeObjectLiteral]
      )
    }
    else if (method === 'arrayOf') {
      node = t.callExpression(
        t.memberExpression(node, t.identifier('arrayOf')),
        [makePropType(data.of)]
      )
    }
    else if (method === 'oneOf') {
      node = t.callExpression(
        t.memberExpression(node, t.identifier('oneOf')),
        [t.arrayExpression(data.options.map(makeLiteral))]
      )
    }
    else if (method === 'oneOfType') {
      node = t.callExpression(
        t.memberExpression(node, t.identifier('oneOfType')),
        [t.arrayExpression(data.options.map(makePropType))]
      )
    }
    else {
      console.error(PLUGIN_NAME + ': This is an internal error that should never happen. Report it immediately with the source file and babel config.', data);
      $debug('Unknown node ' + JSON.stringify(data, null, 2));
      throw new Error(PLUGIN_NAME + ' processing error');
    }

    if (data.isRequired) {
      node = t.memberExpression(node, t.identifier('isRequired'));
    }

    return node;
  }

  var rootProperties = propTypeData.properties.map(({key, value}) => {
    return t.objectProperty(
      t.identifier(key),
      makePropType(value)
    );
  });
  return t.objectExpression(rootProperties);
};

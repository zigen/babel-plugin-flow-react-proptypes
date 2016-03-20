var {$debug, PLUGIN_NAME} = require('./util');

module.exports = function convertToPropTypes(node) {
  $debug('convertToPropTypes', node);
  var resultPropType;

  if (node.type === 'ObjectTypeAnnotation' && node.properties.length === 0) {
    // FIXME: investigate why this is never hit
    resultPropType = {type: 'object'};
  }
  else if (node.type === 'ObjectTypeAnnotation') {
    var ret = node.properties.map((subnode) => {
      var key = subnode.key.name;
      var value = subnode.value;

      // recurse
      value = convertToPropTypes(value);

      // handles id?: string
      if (value) {
        value.isRequired = !subnode.optional;
      }

      return {key, value};
    })

    resultPropType = {type: 'shape', properties: ret};
  }
  else if (node.type === 'AnyTypeAnnotation') resultPropType = {type: 'any'};
  else if (node.type === 'NumberTypeAnnotation') resultPropType = {type: 'number'};
  else if (node.type === 'StringTypeAnnotation') resultPropType = {type: 'string'};
  else if (node.type === 'BooleanTypeAnnotation') resultPropType = {type: 'bool'};
  else if (node.type === 'GenericTypeAnnotation') {
    if (node.id.name === 'Array') {
      resultPropType = {type: 'arrayOf', of: convertToPropTypes(node.typeParameters.params[0])};
    }
    // FIXME: I'm not sure what to do here. We don't want to attempt to reference a constructor that's not
    // in scope. One option would be to do PropTypes.shape({constructor: PropTypes.shape({name: 'Bar'})}).
    else {
      resultPropType = {type: 'any'};
    }
  }
  else if (node.type === 'UnionTypeAnnotation') {
    var {types} = node;
    var firstTypeType = types[0].type;

    // e.g. 'hello' | 5
    if (/Literal/.test(firstTypeType)) {
      resultPropType = {type: 'oneOf', options: types.map(({value}) => value)};
    }
    // e.g. string | number
    else {
      resultPropType = {type: 'oneOfType', options: types.map(convertToPropTypes)};
    }
  }

  if (resultPropType) {
    return resultPropType;
  }
  else {
    console.error(PLUGIN_NAME + ': Encountered an unknown node in the type definition', node);
    throw new Error(PLUGIN_NAME + ' processing error');
  }
}

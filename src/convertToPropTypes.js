import {$debug, PLUGIN_NAME} from './util';

export default function convertToPropTypes(node, typesToIdentifiers) {
  $debug('convertToPropTypes', node);
  let resultPropType;

  if (node.type === 'ObjectTypeAnnotation') {
    const ret = node.properties.map((subnode) => {
      const key = subnode.key.name;
      let value = subnode.value;

      // recurse
      value = convertToPropTypes(value, typesToIdentifiers);

      // handles id?: string
      if (value) {
        value.isRequired = !subnode.optional && !value.optional;
      }

      return {key, value};
    });

    resultPropType = {type: 'shape', properties: ret};
  }
  else if (node.type === 'FunctionTypeAnnotation') resultPropType = {type: 'func'};
  else if (node.type === 'AnyTypeAnnotation') resultPropType = {type: 'any'};
  else if (node.type === 'TypeofTypeAnnotation') resultPropType = {type: 'any'};
  else if (node.type === 'NumberTypeAnnotation') resultPropType = {type: 'number'};
  else if (node.type === 'StringTypeAnnotation') resultPropType = {type: 'string'};
  else if (node.type === 'BooleanTypeAnnotation') resultPropType = {type: 'bool'};
  else if (node.type === 'VoidTypeAnnotation') resultPropType = {type: 'void'};
  else if (node.type === 'NullableTypeAnnotation') {
    resultPropType = convertToPropTypes(node.typeAnnotation, typesToIdentifiers);
    resultPropType.optional = true;
  }
  else if (node.type === 'GenericTypeAnnotation' || node.type === 'ArrayTypeAnnotation') {
    if (node.type === 'ArrayTypeAnnotation' || node.id.name === 'Array') {
      let arrayType;
      if (node.type === 'ArrayTypeAnnotation') {
        arrayType = node.elementType;
      }
      else {
        arrayType = node.typeParameters.params[0];
      }
      if (arrayType.type === 'GenericTypeAnnotation' &&
        arrayType.id.type === 'QualifiedTypeIdentifier' &&
        arrayType.id.qualification.name === 'React' &&
        arrayType.id.id.name === 'Element') {
        resultPropType = {type: 'node'};
      }
      else {
        resultPropType = {type: 'arrayOf', of: convertToPropTypes(arrayType, typesToIdentifiers)};
      }
    }
    else if (node.id && node.id.name && typesToIdentifiers[node.id.name]) {
      resultPropType = {type: 'raw', value: typesToIdentifiers[node.id.name]};
    }
    else if (node.id.name === 'Object') {
      resultPropType = {type: 'object'};
    }
    else {
      resultPropType = {type: 'any'};
    }
  }
  else if (node.type in {
    'UnionTypeAnnotation': 0,
    'StringLiteralTypeAnnotation': 0,
    'NumericLiteralTypeAnnotation': 0,
    'BooleanLiteralTypeAnnotation': 0,
    'NullLiteralTypeAnnotation': 0,
  }) {
    if (node.type === 'UnionTypeAnnotation') {
      const {types} = node;
      const firstTypeType = types[0].type;

      // e.g. 'hello' | 5
      if (/Literal/.test(firstTypeType)) {
        resultPropType = {type: 'oneOf', options: types.map(({value}) => value)};
      }
      // e.g. string | number
      else {
        resultPropType = {type: 'oneOfType', options: types.map((node) => convertToPropTypes(node, typesToIdentifiers))};
      }
    }
    else {
      resultPropType = {type: 'oneOf', options: [node.value]};
    }
  }

  if (resultPropType) {
    return resultPropType;
  }
  else {
    throw new Error(`${PLUGIN_NAME}: Encountered an unknown node in the type definition. Node: ${JSON.stringify(node)}`);
  }
}

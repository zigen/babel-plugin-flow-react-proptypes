var $debug = () => {};
//var $debug = console.error.bind(console);
const PLUGIN_NAME = 'babel-plugin-flow-react-proptypes';

var t;

var matchedPropTypes;
export default function ({types}) {
  t = types;

  return {
    visitor: {
      Program(path) {
        matchedPropTypes = null;
      },
      TypeAlias(path) {
        $debug('TypeAlias found');
        if (!/Props$/.test(path.node.id.name)) {
          $debug(`TypeAlias ${path.node.id.name} is not a Props type`);
          return;
        }
        var {right} = path.node;
        if (right.type !== 'ObjectTypeAnnotation') {
          $debug(`Expected ObjectTypeAnnotation but got ${right.type}`);
          return
        }

        var propTypes = convertToPropTypes(right);
        matchedPropTypes = propTypes;
      },
        ClassDeclaration(path) {
          if (!matchedPropTypes) {
            $debug('at ClassDeclaration no prop TypeAlias was found');
            return;
          }
          else {
            $debug('Found ClassDeclaration for the TypeAlias');
          }

          var {superClass} = path.node;

          // check if we're extending React.Compoennt
          var extendsReactCompoennt = superClass.type === 'MemberExpression' 
            && superClass.object.name === 'React'
            && superClass.property.name === 'Component';
          var extendsComponent = superClass.type === 'Identifier' && superClass.name === 'Component';
          if (!extendsReactCompoennt && !extendsComponent) {
            debug('Found a class that isn\'t a react component', + JSON.stringify(superClass));
            return;
          }

          var name = path.node.id.name;

          var propTypeAST = makePropTypesAST(t, matchedPropTypes)
            var attachPropTypesAST = t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(t.identifier(name), t.identifier('propTypes')),
                  propTypeAST
                  )
                );
          path.insertAfter(attachPropTypesAST);
        }
    }
  };
}

function convertToPropTypes(node) {
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

function makePropTypesAST(t, propTypeData) {
  var makePropType = (data) => {
    var method = data.type;

    var node = t.memberExpression(t.identifier('React'), t.identifier('PropTypes'))

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
}

function makeLiteral(value) {
  if (typeof value === 'string') return t.stringLiteral(value);
  else if (typeof value === 'number') return t.numericLiteral(value)
  else if (typeof value === 'boolean') return t.booleanLiteral(value)
  else {
    $debug('Encountered invalid literal', value);
    throw new TypeError(`Invalid type supplied, this is a bug in ${PLUGIN_NAME}, typeof is ${typeof value} with value ${value}`);
  }
}


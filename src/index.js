var {$debug} = require('./util');
//var $debug = console.error.bind(console);
var convertToPropTypes = require('./convertToPropTypes');
var makePropTypesAST = require('./makePropTypesAST');

var matchedPropTypes;
export default function (babel) {
  var t = babel.types;

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

import {$debug, getExportNameForType, PLUGIN_NAME} from './util';
import convertToPropTypes from './convertToPropTypes';
import makePropTypesAst from './makePropTypesAst';

let typeAliasToPropTypes = {};

// See ExportNamedDeclaration and ImportDeclaration
let importedTypes = {};

const getFunctionalComponentTypeProps = path => {
  // Check if this looks like a stateless react component with PropType reference:
  const firstParam = path.node.params[0];
  const typeAnnotation = firstParam
    && firstParam.typeAnnotation
    && firstParam.typeAnnotation.typeAnnotation;

  if (!typeAnnotation) {
    $debug('Found stateless function without type definition');
    return;
  }

  const hasPropsParamReference = typeAnnotation
    && typeAnnotation.id
    && typeAnnotation.id.name;

  let props = null;
  if (hasPropsParamReference) {
    props = typeAliasToPropTypes[typeAnnotation.id.name];
    if (!props) {
      throw new Error(`Did not find type annotation for ${typeAnnotation.id.name}`);
    }
  }
  else if (typeAnnotation.properties) {
    props = convertToPropTypes(typeAnnotation, importedTypes);
  }
  else {
    throw new Error(`Expect prop type for functional component, but found none. This is a bug in ${PLUGIN_NAME}`);
  }

  return props;
};

export default function flowReactPropTypes(babel) {
  const t = babel.types;

  const annotate = (path, props) => {
    let name;
    let targetPath;

    if (path.type === 'ArrowFunctionExpression') {
      name = path.parent.id.name;
      targetPath = path.parentPath.parentPath;
    }
    else {
      name = path.node.id.name;
      targetPath = path.parent.type === 'Program' ? path : path.parentPath;
    }

    if (!props) {
      throw new Error(`Did not find type annotation for ${name}`);
    }

    const propTypesAST = makePropTypesAst(props);
    const attachPropTypesAST = t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.identifier(name), t.identifier('propTypes')),
        propTypesAST
      )
    );
    targetPath.insertAfter(attachPropTypesAST);
  };

  return {
    visitor: {
      Program(path) {
        typeAliasToPropTypes = {};
        importedTypes = {};
      },
      TypeAlias(path) {
        $debug('TypeAlias found');
        const {right} = path.node;
        if (right.type !== 'ObjectTypeAnnotation') {
          $debug(`Expected ObjectTypeAnnotation but got ${right.type}`);
          return;
        }

        const typeAliasName = path.node.id.name;
        if (!typeAliasName) {
          throw new Error('Did not find name for type alias');
        }

        const propTypes = convertToPropTypes(right, importedTypes);
        typeAliasToPropTypes[typeAliasName] = propTypes;
      },
      ClassDeclaration(path) {
        const {superClass} = path.node;

        // check if we're extending React.Compoennt
        const extendsReactComponent = superClass && superClass.type === 'MemberExpression'
        && superClass.object.name === 'React'
        && superClass.property.name === 'Component';
        const extendsComponent = superClass && superClass.type === 'Identifier' && superClass.name === 'Component';
        if (!extendsReactComponent && !extendsComponent) {
          $debug('Found a class that isn\'t a react component', superClass);
          return;
        }

        // And have type as property annotations or Component<void, Props, void>
        path.node.body.body.forEach(bodyNode => {
          if (bodyNode && bodyNode.key.name === 'props' && bodyNode.typeAnnotation) {
            const typeAliasName = bodyNode.typeAnnotation.typeAnnotation.id.name;
            const props = typeAliasToPropTypes[typeAliasName];
            return annotate(path, props);
          }
        });

        // super type parameter
        const secondSuperParam = path.node.superTypeParameters && path.node.superTypeParameters.params[1];
        if (secondSuperParam && secondSuperParam.type === 'GenericTypeAnnotation') {
          const typeAliasName = secondSuperParam.id.name;
          const props = typeAliasToPropTypes[typeAliasName];
          return annotate(path, props);
        }
      },

      FunctionDeclaration(path) {
        const props = getFunctionalComponentTypeProps(path);
        if (props) {
          annotate(path, props);
        }
      },

      ArrowFunctionExpression(path) {
        const props = getFunctionalComponentTypeProps(path);
        if (props) {
          annotate(path, props);
        }
      },

      // See issue:
      ExportNamedDeclaration(path) {
        const {node} = path;

        if (!node.declaration || node.declaration.type !== 'TypeAlias') {
          return;
        }
        if (!node.declaration.right.properties) {
          return;
        }

        const propTypes = convertToPropTypes(node.declaration.right, importedTypes);
        let propTypesAst = makePropTypesAst(propTypes);

        if (propTypesAst.type === 'ObjectExpression') {
          propTypesAst = t.callExpression(
            t.memberExpression(
              t.memberExpression(
                t.callExpression(
                  t.identifier('require'),
                  [t.stringLiteral('react')]
                ),
                t.identifier('PropTypes')
              ),
              t.identifier('shape'),
            ),
            [propTypesAst],
          );
        }

        const exportAst = t.expressionStatement(t.callExpression(
          t.memberExpression(t.identifier('Object'), t.identifier('defineProperty')),
          [
            t.memberExpression(t.identifier('module'), t.identifier('exports')),
            t.stringLiteral(getExportNameForType(node.declaration.id.name)),
            propTypesAst,
          ]
        ));
        path.insertAfter(exportAst);
      },
      ImportDeclaration(path) {
        const {node} = path;
        if (node.importKind === 'type') {
          node.specifiers.forEach((specifier) => {
            const typeName = specifier.type === 'ImportDefaultSpecifier'
              ? specifier.local.name
              : specifier.imported.name;

            importedTypes[typeName] = getExportNameForType(typeName);
            const variableDeclarationAst = t.variableDeclaration(
              'var',
              [
                t.variableDeclarator(
                  // TODO: use local import name?
                  t.identifier(getExportNameForType(typeName)),
                  t.logicalExpression(
                    '||',
                    t.memberExpression(
                      t.callExpression(
                        t.identifier('require'),
                        [t.stringLiteral(node.source.value)]
                      ),
                      t.identifier(getExportNameForType(typeName))
                    ),
                    t.memberExpression(
                      t.memberExpression(
                        t.callExpression(
                          t.identifier('require'),
                          [
                            t.stringLiteral('react'),
                          ]
                        ),
                        t.identifier('PropTypes')
                      ),
                      t.identifier('any')
                    )
                  ),
                )
              ]
            );
            path.insertAfter(variableDeclarationAst);
          });
        }
      }
    }
  };
};

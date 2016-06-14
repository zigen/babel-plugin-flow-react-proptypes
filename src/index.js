import {$debug, getExportNameForType} from './util';
import convertToPropTypes from './convertToPropTypes';
import makePropTypesAst from './makePropTypesAst';

let matchedPropTypes;

// See ExportNamedDeclaration and ImportDeclaration
let importedTypes = {};
export default function flowReactPropTypes(babel) {
  const t = babel.types;

  return {
    visitor: {
      Program(path) {
        matchedPropTypes = null;
        importedTypes = {};
      },
      TypeAlias(path) {
        $debug('TypeAlias found');
        if (!/Props$/.test(path.node.id.name)) {
          $debug(`TypeAlias ${path.node.id.name} is not a Props type`);
          return;
        }
        const {right} = path.node;
        if (right.type !== 'ObjectTypeAnnotation') {
          $debug(`Expected ObjectTypeAnnotation but got ${right.type}`);
          return;
        }

        const propTypes = convertToPropTypes(right, importedTypes);
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

        const {superClass} = path.node;

        // check if we're extending React.Compoennt
        const extendsReactComponent = superClass.type === 'MemberExpression'
        && superClass.object.name === 'React'
        && superClass.property.name === 'Component';
        const extendsComponent = superClass.type === 'Identifier' && superClass.name === 'Component';
        if (!extendsReactComponent && !extendsComponent) {
          debug('Found a class that isn\'t a react component', superClass);
          return;
        }

        const name = path.node.id.name;

        const propTypesAST = makePropTypesAst(matchedPropTypes);
        const attachPropTypesAST = t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.identifier(name), t.identifier('propTypes')),
            propTypesAST
          )
        );
        var targetPath = path.parent.type === 'Program' ? path : path.parentPath;
        targetPath.insertAfter(attachPropTypesAST);
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

var babel = require('babel-core');
var content = `
import type {NamedType} from './foo';
import type DefaultType from './bar';

type FooProps = {
  an_imported_named_type: NamedType,
  an_imported_default_type: DefaultType,
  a_global_type: Date,
  a_undefined_type: FooBarBaz,
};

class C extends React.Component {
    props: FooProps
};
`;

it('import-object', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

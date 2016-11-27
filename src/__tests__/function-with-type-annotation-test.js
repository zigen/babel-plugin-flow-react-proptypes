var babel = require('babel-core');
var content = `
type FooProps = {
  name: string,
}

const C = (props: FooProps) : ReactElement => {
}
`;

it('function-with-type-annotation', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

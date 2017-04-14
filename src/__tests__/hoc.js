var babel = require('babel-core');
var content = `
type FooProps = {
  a_prop: boolean,
};

export default () => {
  class C extends React.Component {
    props: FooProps;
  }
  return C;
};
`;

it('import-object', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  console.log(res);
  expect(res).toMatchSnapshot();
});

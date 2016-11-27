var babel = require('babel-core');
var content = `
type FooProps = {
  bar: {|
    a: string,
    b: number,
  |}
};

class Foo extends React.Component {
  props: FooProps;

  render() { return <div /> }
};
`;

it('exact-syntax', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

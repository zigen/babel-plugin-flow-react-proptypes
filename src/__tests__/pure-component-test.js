var babel = require('babel-core');
var content = `
type FooProps = {
  name: string
};

class Foo extends React.PureComponent {
  props: FooProps;
  render() {
    return <div />;
  }
}
`;

it('pure-component', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

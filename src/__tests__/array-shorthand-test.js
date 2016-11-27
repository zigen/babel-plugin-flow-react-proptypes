var babel = require('babel-core');
var content = `
type CProps = {
  as: string[]
}

export default class C extends React.Component {
  props: CProps;
  render() {
    return <div />;
  }
}
`;

it('array-shorthand', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

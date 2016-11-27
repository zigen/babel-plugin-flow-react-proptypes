var babel = require('babel-core');
var content = `
type Props = {
  name: string,
}

var C = (props: Props) => {
  var el = null;
  if (true) {
    el = <div />;
  }
  return el;
};
`;

it('indirect-jsx', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

var babel = require('babel-core');
var content = `
type Props = {
    someProp: {} & {}
};
class MyComponent extends React.Component {
    props: Props;
}
`;

it('intersection', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

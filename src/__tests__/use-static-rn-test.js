const babel = require('babel-core');
const content = `
var React = require('react');

type Props = { x: string };

class C extends React.Component<Props> {
  render(){ return null }
}
`;

it('use-static-rn', () => {
  const res = babel.transform(content, {
    babelrc: false,
    presets: ['react-native', 'react-native/configs/hmr.js'],
    plugins: ['syntax-flow', [require('../'), { useStatic: true }]],
    compact: false,
  }).code;
  expect(res).toMatchSnapshot();
  expect(res).toMatch(/_class\.propTypes/g);
});

const babel = require('babel-core');
const content = `var React = require('react');

export type BarProps = $ReadOnly<{|
  a_number: number,
  b_bool?: boolean
|}>;

type FooProps = {
  ...BarProps
}

export default class extends React.Component<FooProps> {
}
`;

it('class-single-type-anon-test', () => {
  const res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

var babel = require('babel-core');
var content = `
const React = require('react');

type FooProps = {
  children: React.Element[],
};

function Foo(props: FooProps) {
    <div>{props.children}</div>
}
`;

it('children', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

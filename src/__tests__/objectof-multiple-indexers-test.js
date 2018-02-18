const babel = require('babel-core');
const content = `
var React = require('react');

type FooProps = {
  problem: {[name: string]: number, [nombre: string]: bool},
}

export default class Foo extends React.Component {
  props: FooProps
}
`;

it('objectOf rejects multiple indexers', () => {
  expect(() => babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  })).toThrow(/multiple indexers are not supported/i);
});

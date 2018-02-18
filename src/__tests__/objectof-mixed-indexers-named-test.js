const babel = require('babel-core');
const content = `
var React = require('react');

type FooProps = {
  problem: {[name: string]: number, special: string},
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
  })).toThrow(/mixed indexers and named properties are not supported/i);
});

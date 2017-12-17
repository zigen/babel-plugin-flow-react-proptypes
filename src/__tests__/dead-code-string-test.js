const babel = require('babel-core');
const { minify } = require('uglify-js');
const content = `
var React = require('react');

type Props = { x: string };
const Foo = (props: Props) => <div />;
`;

const opts = {
  babelrc: false,
  presets: ['es2015', 'stage-1', 'react'],
  plugins: ['syntax-flow', [require('../'), { deadCode: '__PROD__' }]],
};

it('dead-code-string', () => {
  const res = babel.transform(content, opts).code;
  expect(res).toMatch(/__PROD__\s*\?/);
  expect(res).toMatchSnapshot();
});

it('dead-code-string uglify', () => {
  const res = babel.transform(content, opts).code
    .replace(/__PROD__/, 'true');
  const { code: min } = minify(res, { toplevel: true });
  expect(min).not.toMatch(/prop-types/);
});

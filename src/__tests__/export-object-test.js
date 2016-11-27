var babel = require('babel-core');
var content = `
export type Foo = {
  a_string: string,
};

console.log('test');
`;

it('export-object', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

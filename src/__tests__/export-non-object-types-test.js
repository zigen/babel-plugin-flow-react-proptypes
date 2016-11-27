var babel = require('babel-core');
var content = `
export type Answer = "Yes" | "No";
`;

it('export-non-object-types', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

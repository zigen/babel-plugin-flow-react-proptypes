var babel = require('babel-core');
var content = `
export appcache from "./validators/appcache.js"
export assets from "./validators/assets.js"
export baseUrl from "./validators/baseUrl.js"
export production from "./validators/production.js"
`;

it('just-exports', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

var babel = require('babel-core');
var content = `
// @flow

import React from 'react';

export type T = {
  f: Function,
  i: number,
  x: 'foo' | 'baz',
};

const C = ({
  f,
}: T) => {
   <div></div>
};

export default C;
`;

it('export-type-and-component', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

var babel = require('babel-core');
var content = `
// @flow

import React from 'react';
import type { T } from '../types';

const C = (props: T) => {
  <div>{props.name}</div>
};
`;

it('stateless-inline-imports', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

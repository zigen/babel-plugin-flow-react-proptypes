var babel = require('babel-core');
var content = `
// @flow
import React from "react";

export const C1 = ({ m } : { m : string }) => {
  return <div />;
};

export const C2 = function({ m } : { m : string }) {
  return <div />;
};
`;

it('stateless-exports', () => {
  var res = babel.transform(content, {
    babelrc: false,
    presets: ['es2015', 'stage-1', 'react'],
    plugins: ['syntax-flow', require('../')],
  }).code;
  expect(res).toMatchSnapshot();
});

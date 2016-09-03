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

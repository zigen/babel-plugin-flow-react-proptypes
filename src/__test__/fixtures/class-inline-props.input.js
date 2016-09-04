// @flow
var React = require('react');
import type { ExternalType } from '../types';

export default class Foo extends React.Component {
  props: {
    a_number: number,
    external: ExternalType,
  }

  render () {
    return <div />
  }
}

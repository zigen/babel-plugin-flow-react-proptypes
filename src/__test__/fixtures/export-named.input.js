// @flow
import React from 'react'
type VendorProps = {
  test: string,
};

export class ExportedVendorCard extends React.Component {
  props: VendorProps;
  render () {
    return (
      <div />
    );
  }
}

class LocalVendorCard extends React.Component {
  props: VendorProps;
  render () {
    return (
      <div />
    );
  }
}



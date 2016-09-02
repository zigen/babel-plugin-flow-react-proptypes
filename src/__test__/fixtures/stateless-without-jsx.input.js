var React = require('react');

type FooT = {
    x?: number
};

const Foo = function(props: FooT) {
  React.createElement(
    'div',
    null,
    props.x
  );
};

export default Foo;

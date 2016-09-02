var React = require('react');

type FooT = {
    x?: number
};

const Foo = (props: FooT) => {
  <div>{props.x}</div>
};

export default Foo;

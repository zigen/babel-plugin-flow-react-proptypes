var React = require('react');

type FooProps = {
    x?: number
};

const Foo = (props: FooProps) => {
  <div>{props.x}</div>
};

export default Foo;

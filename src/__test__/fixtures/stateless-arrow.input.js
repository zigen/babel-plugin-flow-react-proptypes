var React = require('react');

type Choices = 'option1' | 'option2';

type FooT = {
    x?: Choices
};

const Foo = (props: FooT) => {
  <div>{props.x}</div>
};

export default Foo;

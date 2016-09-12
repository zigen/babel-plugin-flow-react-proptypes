var React = require('react');

const arrowFunctionWithBody = () => window.console;

type Choices = 'option1' | 'option2';

type FooT = {
    x?: Choices
};

const Foo = (props: FooT) => (
  React.createElement(
    'div',
    null,
    props.x
  )
);

export default Foo;

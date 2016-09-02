const React = require('react');

type FooProps = {
  children: React.Element[],
};

function Foo(props: FooProps) {
    <div>{props.children}</div>
}

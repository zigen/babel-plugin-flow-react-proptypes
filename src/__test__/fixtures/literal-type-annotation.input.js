type FooProps = {
  a_string: 'str',
  a_number: 7,
  a_boolean: true,
  a_null: null,
  a_void: void,
}

class Foo extends Component {
  props: FooProps
  render() { return <div /> }
}


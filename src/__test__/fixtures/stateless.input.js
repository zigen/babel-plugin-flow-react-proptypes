var React = require('react');

type T = {
  an_optional_string?: string,
  a_number: number,
  a_boolean: boolean,
  a_generic_object: Object,
  array_of_strings: Array<string>,
  instance_of_Bar: Bar,
  anything: any,
  one_of: 'QUACK' | 'BARK' | 5,
  onw_of_type: number | string,
  nested_object_level_1: {
    string_property_1: string,
    nested_object_level_2: {
      nested_object_level_3: {
        string_property_3: string,
      },
      string_property_2: string,
    }
  },
  should_error_if_provided: void
}

export default function Foo(props: T) {

}

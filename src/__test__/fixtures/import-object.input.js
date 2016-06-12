import type {SomeType} from './type';

type FooProps = {
  an_imported_type: SomeType,
  a_global_type: Date,
  a_undefined_type: FooBarBaz,
};

class C extends React.Component {};


import type {NamedType} from './foo';
import type DefaultType from './bar';

type FooProps = {
  an_imported_named_type: NamedType,
  an_imported_default_type: DefaultType,
  a_global_type: Date,
  a_undefined_type: FooBarBaz,
};

class C extends React.Component {};


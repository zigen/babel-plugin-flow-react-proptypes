import type {Type} from './type';

type FooProps = {
  an_imported_type: Type,
  a_global_type: Date,
  a_undefined_type: FooBarBaz,
};

class C extends React.Component {};


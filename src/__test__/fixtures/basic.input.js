var React = require('react');

type IFooProps = {
  id?: string,
  count: number,
  anObject: object,
  friends: Array<string>,
  foo: Bar,
  randomJunk: any,
  sound: 'QUACK' | 'BARK' | 5,
  numOrString: number | string,
  user: {
    id: string,
    createdAt: Date,
  }
}

export default class Foo<IFooProps> extends React.Component {
}


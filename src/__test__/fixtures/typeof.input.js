const ActionTypes = {
  JUMP_TO: 'react-native/NavigationExperimental/tabs-jumpTo',
};

export type JumpToAction = {
  type: typeof ActionTypes.JUMP_TO,
  index: number,
};


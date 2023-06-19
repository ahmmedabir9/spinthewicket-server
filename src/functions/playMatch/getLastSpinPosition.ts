const getLastSpinPosition = (ballAction: string | boolean): number => {
  let result;

  let pointed;
  switch (ballAction) {
    case 'ONE':
      pointed = 154;
      break;
    case 'BOWLED':
      pointed = 244;
      break;
    case 'SIX':
      pointed = 34;
      break;
    case 'WIDE':
      pointed = 4;
      break;
    case 'RUN_OUT':
      pointed = 334;
      break;
    case 'TWO':
      pointed = 94;
      break;
    case 'THREE':
      pointed = 274;
      break;
    case 'LBW':
      pointed = 124;
      break;
    case 'NO_BALL':
      pointed = 64;
      break;
    case 'FOUR':
      pointed = 304;
      break;
    case 'CATCH':
      pointed = 184;
      break;
    case 'DOT':
      pointed = 214;
      break;
    default:
      pointed = 0;
      break;
  }

  result = 0 - (pointed + Math.floor(Math.random() * 22));

  return result;
};

export { getLastSpinPosition };

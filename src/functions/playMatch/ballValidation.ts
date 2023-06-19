import { _IMatch_ } from '../../models/_ModelTypes_';

const ballValidation = (matchData: Partial<_IMatch_>) => {
  if (matchData.liveData) {
    if (
      matchData.liveData.batsman.striker &&
      matchData.liveData.batsman.nonStriker &&
      matchData.liveData.bowler &&
      matchData.liveData.balls !== 6 &&
      !matchData.liveData.spinning
    ) {
      return true;
    } else {
      return false;
    }
  }
};

export { ballValidation };

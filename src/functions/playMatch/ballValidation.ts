import { _IMatch_ } from '../../models/_ModelTypes_';

const ballValidation = (matchData: Partial<_IMatch_>) => {
  if (matchData.liveData) {
    if (
      matchData.liveData.batsman.striker?.id &&
      matchData.liveData.batsman.nonStriker?.id &&
      matchData.liveData.bowler?.id &&
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

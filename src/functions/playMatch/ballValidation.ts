import { _IMatch_ } from '../../models/_ModelTypes_';

const ballValidation = (matchData: Partial<_IMatch_>, battingTeam: string, bowlingTeam: string) => {
  if (matchData.liveData) {
    if (
      matchData.liveData?.[`${battingTeam}`]?.batsman.striker?.id &&
      matchData.liveData?.[`${battingTeam}`]?.batsman.nonStriker?.id &&
      matchData.liveData?.[`${bowlingTeam}`]?.bowler?.id &&
      matchData.liveData?.[`${battingTeam}`]?.balls !== 6 &&
      !matchData.liveData?.[`${battingTeam}`]?.spinning
    ) {
      return true;
    } else {
      return false;
    }
  }
};

export { ballValidation };

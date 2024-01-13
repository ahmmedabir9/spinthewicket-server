import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { initialLiveData } from '../../../utils/constants';
import { updateBowlingOrder, updateOverHistory } from '../utils';

// const endOfInnings = require('./endOfInnings');

const endOfOver = async (matchData: Partial<_IMatch_>, battingTeam: string, bowlingTeam: string, inning: string) => {
  try {
    const dataToUpdate = {
      [`liveData.${bowlingTeam}.bowler`]: {
        id: null,
        ...initialLiveData.bowler,
      },
      [`liveData.${battingTeam}.batsman.striker`]: matchData.liveData[battingTeam].batsman.nonStriker,
      [`liveData.${battingTeam}.batsman.nonStriker`]: matchData.liveData[battingTeam].batsman.striker,
      [`liveData.${battingTeam}.balls`]: 0,
      [`liveData.${battingTeam}.thisOver`]: [],
      [`liveData.${battingTeam}.overs`]: matchData.liveData[battingTeam].overs + 1,
      [`innings.${inning}.overs`]: matchData.liveData[battingTeam].overs + 1,
      [`innings.${inning}.balls`]: 0,
      [`innings.${inning}.bowlingOrder`]: updateBowlingOrder(matchData, bowlingTeam, inning, true),
      [`innings.${inning}.overHistory`]: updateOverHistory(matchData, battingTeam, inning),
    };

    await DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });

    // if (updateMatch.liveData.overs === updateMatch.overs || updateMatch.superOver) {
    //   await endOfInnings(updateMatch);
    // }

    return { success: true };
  } catch (error) {
    return error;
  }
};
export default endOfOver;

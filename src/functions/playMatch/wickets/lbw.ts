import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { initialLiveData } from '../../../utils/constants';
import endOfOver from '../end/endOfOver';
import { getBatsmanStats, getBowlerStats, getFallOfWicket, getPartnarship, getRunRate, getTargetUpdate } from '../utils';

const lbw = async (matchData: Partial<_IMatch_>, ballData: any, battingTeam: string, bowlingTeam: string, inning: string) => {
  try {
    let dataToUpdate = {
      $inc: {
        [`liveData.${battingTeam}.balls`]: 1,
        [`liveData.${battingTeam}.wickets`]: 1,
        [`innings.${inning}.balls`]: 1,
        [`innings.${inning}.wickets`]: 1,
      },
      $push: {
        [`liveData.${battingTeam}.thisOver`]: ballData,
        [`innings.${inning}.battingOrder`]: getBatsmanStats(matchData, 0, 1, battingTeam, bowlingTeam, 'LBW'),
        [`innings.${inning}.partnerships`]: getPartnarship(matchData, 0, 1, battingTeam),
        [`innings.${inning}.fallOfWickets`]: getFallOfWicket(matchData, matchData.liveData[battingTeam].batsman.striker.id, 1, battingTeam),
      },

      [`liveData.${battingTeam}.batsman.striker`]: {
        id: null,
        ...initialLiveData.batsman.striker,
      },

      [`liveData.${battingTeam}.bowler`]: getBowlerStats(matchData, 0, 1, battingTeam, 1),

      [`liveData.${battingTeam}.runRate`]: getRunRate(matchData, 0, 1, battingTeam),
      [`liveData.${battingTeam}.partnership`]: null,
      [`liveData.${battingTeam}.freeHit`]: false,
      [`innings.${inning}.runRate`]: getRunRate(matchData, 0, 1, battingTeam),
    };

    // if (inning === 'second' || inning === 'secondSuper') {
    //   dataToUpdate = {
    //     ...dataToUpdate,
    //     ...getTargetUpdate(matchData, 1, 1, battingTeam),
    //   };
    // }
    console.log('💡 | dataToUpdate:', dataToUpdate);

    const updateMatch: _IMatch_ = await DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });

    if (updateMatch.liveData[battingTeam].balls === 6) {
      await endOfOver(updateMatch, battingTeam, bowlingTeam, inning);
    }

    // if (
    //   updateMatch.liveData.wickets === 10 ||
    //   (updateMatch.superOver && updateMatch.liveData.wickets === 1)
    // ) {
    //   await allOut(updateMatch, inning);
    // }

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};
export default lbw;

import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
// import endOfOver from '../end/endOfOver';
import { getBatsmanStats, getBowlerStats, getPartnarship, getRunRate, getTargetUpdate } from '../utils';

const dotBall = async (matchData: Partial<_IMatch_>, ballData: any, battingTeam: string, bowlingTeam: string, inning: string) => {
  try {
    console.log('💡 | DOTBALL battingTeam:', battingTeam);
    let dataToUpdate = {
      $inc: {
        [`liveData.${battingTeam}.balls`]: 1,
        [`innings.${inning}.balls`]: 1,
      },
      $push: { [`liveData.${battingTeam}.thisOver`]: ballData },

      [`liveData.${battingTeam}.batsman.striker`]: getBatsmanStats(matchData, 0, 1, battingTeam, bowlingTeam),

      [`liveData.${bowlingTeam}.bowler`]: getBowlerStats(matchData, 0, 1, bowlingTeam),

      [`liveData.${battingTeam}.runRate`]: getRunRate(matchData, 0, 1, battingTeam),
      [`liveData.${battingTeam}.partnership`]: getPartnarship(matchData, 0, 1, battingTeam),
      [`liveData.${battingTeam}.freeHit`]: false,
      [`innings.${inning}.runRate`]: getRunRate(matchData, 0, 1, battingTeam),
    };

    if (inning === 'second' || inning === 'secondSuper') {
      dataToUpdate = {
        ...dataToUpdate,
        ...getTargetUpdate(matchData, 1, 1, battingTeam),
      };
    }

    // const updateMatch: _IMatch_ = await DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });

    // if (updateMatch.liveData[battingTeam].balls === 6) {
    //   await endOfOver(updateMatch);
    // }

    return { success: true };
  } catch (error) {
    console.log('💡 | error:', error);
    return error;
  }
};

export default dotBall;

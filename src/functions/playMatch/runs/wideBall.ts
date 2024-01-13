import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { getBowlerStats, getPartnarship, getRunRate, getTargetUpdate } from '../utils';

const wideBall = async (matchData: Partial<_IMatch_>, ballData: any, battingTeam: string, bowlingTeam: string, inning: string) => {
  try {
    let dataToUpdate = {
      $inc: {
        [`liveData.${battingTeam}.runs`]: 1,
        [`liveData.${battingTeam}.extra`]: 1,
        [`innings.${inning}.extra`]: 1,
        [`innings.${inning}.runs`]: 1,
      },
      $push: { [`liveData.${battingTeam}.thisOver`]: ballData },
      [`liveData.${bowlingTeam}.bowler`]: getBowlerStats(matchData, 1, 0, bowlingTeam),
      [`liveData.${battingTeam}.partnership`]: getPartnarship(matchData, 1, 0, battingTeam),
      [`liveData.${battingTeam}.runRate`]: getRunRate(matchData, 1, 0, battingTeam),
      [`innings.${inning}.runRate`]: getRunRate(matchData, 1, 0, battingTeam),
    };

    console.log('💡 | dataToUpdate:', dataToUpdate);

    // if (inning === 'second' || inning === 'secondSuper') {
    //   dataToUpdate = {
    //     ...dataToUpdate,
    //     ...getTargetUpdate(matchData, 1, 0, battingTeam),
    //   };
    // }

    // const updateMatch: _IMatch_ = await DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });

    // if (updateMatch.liveData[battingTeam].need <= 0) {
    //   await runChased(updateMatch, inning);
    // }

    return { success: true };
  } catch (error) {
    return error;
  }
};

export default wideBall;

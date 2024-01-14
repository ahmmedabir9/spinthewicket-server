import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import endOfOver from '../end/endOfOver';
import { getBatsmanStats, getBowlerStats, getPartnarship, getRunRate, getTargetUpdate } from '../utils';

const oneRun = async (matchData: Partial<_IMatch_>, ballData: any, battingTeam: string, bowlingTeam: string, inning: string) => {
  console.log('💡 | battingTeam:', battingTeam);
  try {
    let dataToUpdate = {
      $inc: {
        [`liveData.${battingTeam}.balls`]: 1,
        [`liveData.${battingTeam}.runs`]: 1,
        [`innings.${inning}.balls`]: 1,
        [`innings.${inning}.runs`]: 1,
      },
      $push: { [`liveData.${battingTeam}.thisOver`]: ballData },
      [`liveData.${battingTeam}.batsman.striker`]: matchData?.liveData[battingTeam]?.batsman?.nonStriker,
      [`liveData.${battingTeam}.batsman.nonStriker`]: getBatsmanStats(matchData, 1, 1, battingTeam, bowlingTeam),
      [`liveData.${battingTeam}.bowler`]: getBowlerStats(matchData, 1, 1, battingTeam),
      [`liveData.${battingTeam}.partnership`]: getPartnarship(matchData, 1, 1, battingTeam),
      [`liveData.${battingTeam}.freeHit`]: false,
      [`liveData.${battingTeam}.runRate`]: getRunRate(matchData, 1, 1, battingTeam),
      [`innings.${inning}.runRate`]: getRunRate(matchData, 1, 1, battingTeam),
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

    // if (updateMatch.liveData.need <= 0) {
    //   await runChased(updateMatch, inning);
    // }

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export default oneRun;

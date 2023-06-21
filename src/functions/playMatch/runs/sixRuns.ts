import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import endOfOver from '../end/endOfOver';
import {
  getBatsmanStats,
  getBowlerStats,
  getPartnarship,
  getRunRate,
  getTargetUpdate,
} from '../utils';

const sixRuns = async (matchData: Partial<_IMatch_>, ballData: any) => {
  try {
    let dataToUpdate = {
      $inc: {
        'liveData.balls': 1,
        'liveData.runs': 6,
        [`innings.${matchData.liveData.inning}.balls`]: 6,
        [`innings.${matchData.liveData.inning}.runs`]: 6,
      },
      $push: { 'liveData.thisOver': ballData },
      'liveData.batsman.striker': getBatsmanStats(matchData, 6, 1),
      'liveData.bowler': getBowlerStats(matchData, 6, 1),
      'liveData.partnership': getPartnarship(matchData, 6, 1),
      'liveData.freeHit': false,
      'liveData.runRate': getRunRate(matchData, 6, 1),
      [`innings.${matchData.liveData.inning}.runRate`]: getRunRate(matchData, 6, 1),
    };

    if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
      dataToUpdate = {
        ...dataToUpdate,
        ...getTargetUpdate(matchData, 6, 1),
      };
    }

    const updateMatch: _IMatch_ = await DreamTeamMatch.findByIdAndUpdate(
      matchData._id,
      dataToUpdate,
      { new: true },
    );

    if (updateMatch.liveData.balls === 6) {
      await endOfOver(updateMatch);
    }

    // if (updateMatch.liveData.need <= 0) {
    //   await runChased(updateMatch, inning);
    // }
    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export default sixRuns;

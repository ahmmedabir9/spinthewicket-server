import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { getBowlerStats, getPartnarship, getRunRate, getTargetUpdate } from '../utils';

const noBall = async (matchData: Partial<_IMatch_>, ballData: any) => {
  try {
    let dataToUpdate = {
      $inc: {
        'liveData.runs': 1,
        'liveData.extra': 1,
        [`innings.${matchData.liveData.inning}.extra`]: 1,
        [`innings.${matchData.liveData.inning}.runs`]: 1,
      },
      $push: { 'liveData.thisOver': ballData },
      'liveData.bowler': getBowlerStats(matchData, 1, 0),
      'liveData.partnership': getPartnarship(matchData, 1, 0),
      'liveData.freeHit': true,
      'liveData.runRate': getRunRate(matchData, 1, 0),
      [`innings.${matchData.liveData.inning}.runRate`]: getRunRate(matchData, 1, 0),
    };

    if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
      dataToUpdate = {
        ...dataToUpdate,
        ...getTargetUpdate(matchData, 1, 0),
      };
    }

    const updateMatch: _IMatch_ = await DreamTeamMatch.findByIdAndUpdate(
      matchData._id,
      dataToUpdate,
      { new: true },
    );

    // if (updateMatch.liveData.need <= 0) {
    //   await runChased(updateMatch, inning);
    // }

    return { success: true };
  } catch (error) {
    return error;
  }
};

export default noBall;

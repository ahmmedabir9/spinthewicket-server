import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import endOfOver from '../end/endOfOver';
import { getBatsmanStats, getBowlerStats, getPartnarship, getRunRate } from '../utils';

const dotBall = async (matchData: Partial<_IMatch_>, ballData: any) => {
  try {
    let dataToUpdate = {
      $inc: {
        'liveData.balls': 1,
        [`innings.${matchData.liveData.inning}.balls`]: 1,
      },
      $push: { 'liveData.thisOver': ballData },

      'liveData.batsman.striker': getBatsmanStats(matchData, 0, 1),

      'liveData.bowler': getBowlerStats(matchData, 0, 1),

      'liveData.runRate': getRunRate(matchData, 0, 1),
      'liveData.partnership': getPartnarship(matchData, 0, 1),
      'liveData.freeHit': false,
      [`innings.${matchData.liveData.inning}.runRate`]: getRunRate(matchData, 0, 1),
    };

    if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
      dataToUpdate = {
        ...dataToUpdate,
        'liveData.from': matchData.liveData.from - 1,
        'liveData.reqRR': matchData.liveData.need / ((matchData.liveData.from - 1) / 6),
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

    return { success: true };
  } catch (error) {
    return error;
  }
};

export default dotBall;

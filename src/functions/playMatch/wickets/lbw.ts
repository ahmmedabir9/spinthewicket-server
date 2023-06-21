import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import endOfOver from '../end/endOfOver';
import {
  getBatsmanStats,
  getBowlerStats,
  getFallOfWicket,
  getPartnarship,
  getRunRate,
  getTargetUpdate,
} from '../utils';

const lbw = async (matchData: Partial<_IMatch_>, ballData: any) => {
  try {
    let dataToUpdate = {
      $inc: {
        'liveData.balls': 1,
        'liveData.wickets': 1,
        [`innings.${matchData.liveData.inning}.balls`]: 1,
        [`innings.${matchData.liveData.inning}.wickets`]: 1,
      },
      $push: {
        'liveData.thisOver': ballData,
        [`innings.${matchData.liveData.inning}.battingOrder`]: getBatsmanStats(
          matchData,
          0,
          1,
          'LBW',
        ),
        [`innings.${matchData.liveData.inning}.partnerships`]: getPartnarship(matchData, 0, 1),
        [`innings.${matchData.liveData.inning}.fallOfWickets`]: getFallOfWicket(
          matchData,
          matchData.liveData.batsman.striker.id,
          1,
        ),
      },

      'liveData.batsman.striker': null,

      'liveData.bowler': getBowlerStats(matchData, 0, 1, 1),

      'liveData.runRate': getRunRate(matchData, 0, 1),
      'liveData.partnership': null,
      'liveData.freeHit': false,
      [`innings.${matchData.liveData.inning}.runRate`]: getRunRate(matchData, 0, 1),
    };

    if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
      dataToUpdate = {
        ...dataToUpdate,
        ...getTargetUpdate(matchData, 1, 1),
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

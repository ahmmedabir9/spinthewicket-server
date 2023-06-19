import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';

// const endOfOver = require('../end/endOfOver');
// const endOfOver = require('../end/endOfOver')

const dotBall = async (matchData: Partial<_IMatch_>, ballData: any) => {
  try {
    const batsmanIndex = matchData.innings[matchData.liveData.inning]?.battingOrder?.findIndex(
      (b) => b.batsman?.toString() === matchData.liveData.batsman.striker.id?.toString(),
    );

    let newBattingOrder = [...matchData.innings[matchData.liveData.inning].battingOrder];
    newBattingOrder[batsmanIndex].balls++;

    let dataToUpdate = {
      $inc: {
        'liveData.batsman.striker.balls': 1,
        'liveData.bowler.balls': 1,
        'liveData.balls': 1,
        [`innings.${matchData.liveData.inning}.balls`]: 1,
      },
      [`innings.${matchData.liveData.inning}.battingOrder`]: newBattingOrder,
      'liveData.batsman.striker.strikeRate':
        (matchData.liveData.batsman.striker.runs / (matchData.liveData.batsman.striker.balls + 1)) *
        100,

      'liveData.bowler.economy':
        matchData.liveData.bowler.runs /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + 1)) / 6),

      'liveData.runRate':
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
      $push: { 'liveData.thisOver': ballData },

      'liveData.partnership': {
        runs: matchData.liveData.partnership.runs,
        balls: matchData.liveData.partnership.balls + 1,
        batsman1: matchData.liveData.batsman.striker.id,
        batsman2: matchData.liveData.batsman.nonStriker.id,
      },
      'liveData.freeHit': false,
      [`innings.${matchData.liveData.inning}.runRate`]:
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
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

    // await docRef.update()

    // if (updateMatch.liveData.balls === 6) {
    //   await endOfOver(updateMatch);
    // }

    return { success: true };
  } catch (error) {
    return error;
  }
};

export default dotBall;

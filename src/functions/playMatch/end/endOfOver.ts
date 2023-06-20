import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { updateBowlingOrder, updateOverHistory } from '../utils';

// const endOfInnings = require('./endOfInnings');

const endOfOver = async (matchData: Partial<_IMatch_>) => {
  try {
    let dataToUpdate = {
      'liveData.bowler': null,
      'liveData.batsman.striker': matchData.liveData.batsman.nonStriker,
      'liveData.batsman.nonStriker': matchData.liveData.batsman.striker,
      'liveData.balls': 0,
      'liveData.thisOver': [],
      'liveData.overs': matchData.liveData.overs + 1,
      [`innings.${matchData.liveData.inning}.overs`]: matchData.liveData.overs + 1,
      [`innings.${matchData.liveData.inning}.balls`]: 0,
      [`innings.${matchData.liveData.inning}.bowlingOrder`]: updateBowlingOrder(matchData, true),
      [`innings.${matchData.liveData.inning}.overHistory`]: updateOverHistory(matchData),
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

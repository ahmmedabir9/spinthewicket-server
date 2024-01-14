import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IMatch_ } from '../../../models/_ModelTypes_';
import { initialLiveData } from '../../../utils/constants';
import { getBatsmanStats, getBowlerStats, getPartnarship, updateOverHistory } from '../utils';

const OPOSITE_INNING = {
  first: 'second',
  second: 'first',
  firstSuper: 'secondSuper',
  secondSuper: 'firstSuper',
};

// * FROM :: LAST BALL, LAST WICKET, RUN CHASED
const endOfInnings = async (matchData: Partial<_IMatch_>, battingTeam: string, bowlingTeam: string, inning: string) => {
  try {
    // * PUSH BATTING ORDER
    const batsman = [];
    console.log('💡 | batsman:', batsman);
    if (matchData.liveData[battingTeam].batsman?.striker?.id) {
      batsman.push({ ...getBatsmanStats(matchData, 0, 0, battingTeam, bowlingTeam), status: 'notout' });
    }
    if (matchData.liveData[battingTeam].batsman?.nonStriker?.id) {
      batsman.push({ ...getBatsmanStats(matchData, 0, 0, battingTeam, bowlingTeam, null, true), status: 'notout' });
    }

    let bowler: any;

    console.log('🚀 | endOfInnings | bowler:', bowler);
    // * PUSH BOWLING ORDER
    if (matchData.liveData[battingTeam]?.bowler?.id) {
      bowler = getBowlerStats(matchData, 0, 0, battingTeam);
    }

    console.log('🚀 | endOfInnings | batsman:', batsman);

    let dataToUpdate: any = {
      [`liveData.${battingTeam}.status`]: 'completed',
      $push: {
        ...(bowler ? { [`innings.${inning}.bowlingOrder`]: bowler } : null),
        [`innings.${inning}.battingOrder`]: [...batsman],
        [`innings.${inning}.partnerships`]: getPartnarship(matchData, 0, 0, battingTeam),
      },
      [`innings.${inning}.overHistory`]: updateOverHistory(matchData, battingTeam, inning),
    };

    console.log('💡 | dataToUpdate:', dataToUpdate);

    // * IF FIRST INNING, EXCHANGE BATTING/BOWLING TEAM ON LIVE DATA
    // * IF FIRST INNING, CALCULATE TARGET
    if (matchData.matchMode === 'full' && (inning === 'first' || inning === 'firstSuper')) {
      dataToUpdate = {
        ...dataToUpdate,
        [`liveData.${battingTeam}.target`]: matchData.liveData[battingTeam].runs + 1,
        [`liveData.${battingTeam}.inning`]: inning === 'first' ? 'second' : 'secondSuper',
        [`liveData.${battingTeam}.need`]: matchData.liveData[battingTeam].runs + 1,
        [`liveData.${battingTeam}.from`]: matchData.overs * 6,
        [`liveData.${battingTeam}.reqRR`]: (matchData.liveData[battingTeam].runs + 1) / matchData.overs,
      };
    }

    // * IF SECOND INNINGS, OR THIS INNING LEFT ONLY, CALCULATE RESULT, START SUPER IF TIE, OR END MATCH
    // *

    if (matchData.liveData[bowlingTeam].status === 'completed') {
      // * RESULT

      const otherInning = OPOSITE_INNING[inning];

      if (matchData.innings[otherInning].runs > matchData.innings[inning].runs) {
        dataToUpdate = {
          ...dataToUpdate,
          result: {
            winner: matchData.innings[otherInning].battingTeam,
            wonBy: otherInning === 'firstSuper' ? 'superOver' : 'runs',
            wickets: 10 - matchData.innings[otherInning].wickets,
            runs: matchData.innings[otherInning].runs - matchData.innings[inning].runs,
          },

          status: 'completed',
        };
      } else if (matchData.innings[otherInning].runs < matchData.innings[inning].runs) {
        dataToUpdate = {
          ...dataToUpdate,
          result: {
            winner: matchData.innings[inning].battingTeam,
            wonBy: otherInning === 'firstSuper' ? 'superOver' : 'wickets',
            wickets: 10 - matchData.innings[inning].wickets,
            runs: matchData.innings[inning].runs - matchData.innings[otherInning].runs,
          },

          status: 'completed',
        };
      } else {
        dataToUpdate = {
          ...dataToUpdate,
          [`liveData.${battingTeam}.inning`]: 'firstSuper',
          [`liveData.${battingTeam}.target`]: null,
          [`liveData.${battingTeam}.need`]: null,
          [`liveData.${battingTeam}.from`]: null,
          [`liveData.${battingTeam}.reqRR`]: null,

          [`liveData.${bowlingTeam}.inning`]: 'secondSuper',
          [`liveData.${bowlingTeam}.target`]: null,
          [`liveData.${bowlingTeam}.need`]: null,
          [`liveData.${bowlingTeam}.from`]: null,
          [`liveData.${bowlingTeam}.reqRR`]: null,

          [`innings.firstSuper`]: {
            battingTeam: matchData.innings[inning].battingTeam,
            bowlingTeam: matchData.innings[inning].bowlingTeam,
            battingScorer: matchData.innings[inning].battingScorer,
            bowlingScorer: matchData.innings[inning].bowlingScorer,
            battingOrder: [],
            bowlingOrder: [],
            partnerships: [],
            fallOfWickets: [],
            ballByBall: [],
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0,
            runRate: 0,
            extra: 0,
          },
          [`innings.secondSuper`]: {
            battingTeam: matchData.innings[otherInning].battingTeam,
            bowlingTeam: matchData.innings[otherInning].bowlingTeam,
            battingScorer: matchData.innings[otherInning].battingScorer,
            bowlingScorer: matchData.innings[otherInning].bowlingScorer,
            battingOrder: [],
            bowlingOrder: [],
            partnerships: [],
            fallOfWickets: [],
            ballByBall: [],
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0,
            runRate: 0,
            extra: 0,
          },
        };
      }
    }

    const newMatchData = await DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, {
      new: true,
    });

    if (newMatchData.status === 'completed') {
      // SAVE MATCH DATA HERE
    }

    return { success: true };
  } catch (error) {
    console.log('🚀 | endOfInnings | error:', error);
    return {
      success: false,
      error,
    };
  }
};
export default endOfInnings;

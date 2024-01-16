import BattingStat from '../../../models/BattingStat.model';
import BowlingStat from '../../../models/BowlingStat.model';
import { DreamPlayer } from '../../../models/DreamPlayer.model';
import { DreamTeamMatch } from '../../../models/DreamTeamMatch.model';
import { _IBattingStat_, _IBowlingStat_ } from '../../../models/_ModelTypes_';

const OPOSITE_INNING = {
  first: 'second',
  second: 'first',
  firstSuper: 'secondSuper',
  secondSuper: 'firstSuper',
};

const savePlayerData = async (matchData) => {
  try {
    const matchPerformances = [];

    const teamAInning = matchData.innings.first.battingTeam?.toString() === matchData.teams.teamA?.toString() ? 'first' : 'second';
    const teamBInning = matchData.innings.first.battingTeam?.toString() === matchData.teams.teamB?.toString() ? 'first' : 'second';

    const players = [
      ...matchData.squad.teamA.playingXI.map((pId) => {
        return {
          _id: pId?.toString(),
          team: 'teamA',
          teamId: matchData.teams.teamA,
          inning: teamAInning,
          winningPoints: matchData.result.winner === matchData.teams.teamA ? 5 : -5,
        };
      }),
      ...matchData.squad.teamB.playingXI.map((pId) => {
        return {
          _id: pId?.toString(),
          team: 'teamB',
          teamId: matchData.teams.teamB,
          inning: teamBInning,
          winningPoints: matchData.result.winner === matchData.teams.teamB ? 5 : -5,
        };
      }),
    ];

    for (const player of players) {
      // Get Old Data of player
      const playerData: any = await DreamPlayer.findById(player._id).populate('battingStat bowlingStat');

      let matchBattingPoints = 0,
        matchBowlingPoints = 0;

      // Match Batting Stat
      const playerBatting = matchData.innings[player.inning].battingOrder.find((element) => element.id?.toString() === player._id?.toString());

      const playerCatches = matchData.innings[OPOSITE_INNING[player.inning]].battingOrder.filter(
        (element) => element.out.fielder?.toString() === player._id?.toString() && element.out.wicketType !== 'run out',
      )?.length;

      const playerRunOuts = matchData.innings[OPOSITE_INNING[player.inning]].battingOrder.filter(
        (element) => element.out.fielder?.toString() === player._id?.toString() && element.out.wicketType === 'run out',
      );

      let battingUpdates: Partial<_IBattingStat_> = { matches: playerData.battingStat.matches + 1 };

      if (playerBatting) {
        const matchCenturies = playerBatting.runs >= 100 ? 1 : 0;
        const matchHalfCenturies = playerBatting.runs >= 50 && playerBatting.runs < 100 ? 1 : 0;

        const totalRuns = playerData.battingStat.runs + playerBatting.runs;
        const totalBalls = playerData.battingStat.balls + playerBatting.balls;
        const totalFours = playerData.battingStat.fours + playerBatting.fours;
        const totalSixes = playerData.battingStat.sixes + playerBatting.sixes;
        const totalCenturies = playerData.battingStat.centuries + matchCenturies;
        const totalHalfCenturies = playerData.battingStat.halfCenturies + matchHalfCenturies;
        const totalInnings = playerData.battingStat.innings + 1;
        const totalDotBalls = (playerData.battingStat.dotBalls || 0) + playerBatting.dotBalls;
        const totalDucks =
          (playerData.battingStat.ducks || 0) + (playerBatting.runs === 0 && playerBatting.status === 'out' && playerBatting.balls > 0 ? 1 : 0);

        const totalNotOuts = (playerData.battingStat.notOuts || 0) + (playerBatting.status === 'not out' ? 1 : 0);
        const totalStrikeRate = totalRuns > 0 ? (totalRuns / totalBalls) * 100 : 0;
        const totalAverage =
          (playerData.battingStat.average * playerData.battingStat.innings + playerBatting.runs) /
          (playerData.battingStat.innings + (playerBatting.status === 'out' ? 1 : playerData.battingStat.innings !== 0 ? 0 : 1));

        matchBattingPoints =
          playerBatting.runs + playerBatting.sixes * 2 + playerBatting.fours + matchHalfCenturies * 5 + matchCenturies * 10 + player.winningPoints;

        const totalPoints =
          (playerData.battingStat.points * playerData.battingStat.innings +
            (matchBattingPoints + totalRuns / 100 + totalAverage / 10 + (totalStrikeRate / 10 - 10)) * 10) /
          (playerData.battingStat.innings + 1);

        const battingBest = playerData.battingStat.best;
        if (battingBest.runs < playerBatting.runs || (battingBest.runs === playerBatting.runs && battingBest.balls < playerBatting.balls)) {
          battingBest.runs = playerBatting.runs;
          battingBest.balls = playerBatting.balls;
          battingBest.match = matchData._id;
        }

        battingUpdates = {
          ...battingUpdates,
          runs: totalRuns,
          balls: totalBalls,
          fours: totalFours,
          sixes: totalSixes,
          centuries: totalCenturies,
          halfCenturies: totalHalfCenturies,
          dotBalls: totalDotBalls,
          ducks: totalDucks,
          notOuts: totalNotOuts,
          strikeRate: totalStrikeRate,
          average: totalAverage,
          points: totalPoints,
          innings: totalInnings,
          best: battingBest,
        };
      }

      if (playerCatches.length) {
        battingUpdates = {
          ...battingUpdates,
          catches: playerData.battingStat.catches + playerCatches.length,
        };
      }

      if (playerRunOuts?.length) {
        battingUpdates = {
          ...battingUpdates,
          runOuts: playerData.battingStat.runOuts + playerRunOuts.length,
        };
      }

      // SAVE BATTING STAT
      BattingStat.findByIdAndUpdate(playerData.battingStat._id, battingUpdates, { new: true, runValidators: true });

      // Match Bowling Stat

      const playerBowling = matchData.innings[OPOSITE_INNING[player.inning]].bowlingOrder?.find(
        (bowl) => bowl.id.toString() === player._id.toString(),
      );

      let bowlingUpdates: Partial<_IBowlingStat_> = {
        matches: playerData.bowlingStat.matches + 1,
      };

      if (playerBowling) {
        const matchThreeWickets = playerBowling.wickets >= 3 && playerBowling.wickets < 5 ? 1 : 0;
        const matchFiveWickets = playerBowling.wickets >= 5 ? 1 : 0;

        const totalWickets = playerData.bowlingStat.wickets + playerBowling.wickets;
        const totalBalls = playerData.bowlingStat.balls + (playerBowling.balls || 0) + (playerBowling.overs ? playerBowling.overs * 6 : 0);
        const totalRuns = playerData.bowlingStat.runs + playerBowling.runs;
        const totalDotBalls = playerData.bowlingStat.dotBalls + playerBowling.dotBalls;
        const totalMaidens = playerData.bowlingStat.maidens + playerBowling.maidens;

        const totalThreeWickets = playerData.bowlingStat.threeWickets + matchThreeWickets;
        const totalFiveWickets = playerData.bowlingStat.fiveWickets + matchFiveWickets;
        const totalInnings = playerData.bowlingStat.innings + 1;

        const totalEconomy = totalBalls > 0 && totalRuns > 0 ? totalRuns / (totalBalls / 6) : 0;
        const totalAverage = totalRuns > 0 ? totalRuns / (totalWickets > 0 ? totalWickets : 1) : 0;

        matchBowlingPoints =
          playerBowling.wickets * 25 - playerBowling.economy / 10 + player.winningPoints + matchThreeWickets * 5 + matchFiveWickets * 10;

        const totalPoints =
          (playerData.bowlingStat.points * playerData.bowlingStat.innings + (matchBowlingPoints + totalWickets + (20 - totalEconomy)) * 10) /
          totalInnings;

        const bowlingBest = playerData.bowlingStat.best;
        if (bowlingBest.wickets < playerBowling.wickets || (bowlingBest.wickets === playerBowling.wickets && bowlingBest.runs > playerBowling.runs)) {
          bowlingBest.runs = playerBowling.runs;
          bowlingBest.wickets = playerBowling.wickets;
          bowlingBest.match = matchData._id;
        }

        bowlingUpdates = {
          ...bowlingUpdates,
          wickets: totalWickets,
          balls: totalBalls,
          runs: totalRuns,
          dotBalls: totalDotBalls,
          maidens: totalMaidens,
          threeWickets: totalThreeWickets,
          fiveWickets: totalFiveWickets,
          economy: totalEconomy,
          average: totalAverage,
          points: totalPoints,
          innings: totalInnings,
          best: bowlingBest,
        };
      }

      // SAVE BOWLING STAT
      BowlingStat.findByIdAndUpdate(playerData.bowlingStat._id, bowlingUpdates, {
        new: true,
        runValidators: true,
      });

      // Calculate Match Performance Points
      matchPerformances.push({
        player: player._id,
        points: matchBowlingPoints + matchBattingPoints,
        team: player.teamId,
      });
      console.log('💡 | player:', player);
    }

    console.log('💡 | matchPerformances:', matchPerformances);
    await DreamTeamMatch.findByIdAndUpdate(matchData._id, {
      performances: matchPerformances,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log('💡 | error:', error);
    return {
      success: false,
      error: error,
    };
  }
};

export { savePlayerData };

import { DreamTeam } from '../../../models/DreamTeam.model';
import { _IDreamTeam_, _IMatch_ } from '../../../models/_ModelTypes_';

const OTHER_INNING = {
  first: 'second',
  second: 'first',
};

const getMatchWon = (matchData: Partial<_IMatch_>, teamData) => {
  return teamData.matches.won + (matchData.result.winner === teamData._id?.toString() ? 1 : 0);
};

const getMatchLost = (matchData: Partial<_IMatch_>, teamData) => {
  return teamData.matches.lost + (matchData.result.winner !== teamData._id?.toString() ? 1 : 0);
};

const getForBalls = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.for.balls + matchData.innings[inning].balls;
};

const getForOvers = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.for.overs + matchData.innings[inning].overs;
};

const getForRuns = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.for.runs + matchData.innings[inning].runs;
};

const getAgainstBalls = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.against.balls + matchData.innings[inning].balls;
};

const getAgainstOvers = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.against.overs + matchData.innings[inning].overs;
};

const getAgainstRuns = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return teamData.netRunRate.against.runs + matchData.innings[inning].runs;
};

const getNetRunRate = (matchData: Partial<_IMatch_>, teamData, inning) => {
  return (
    getForRuns(matchData, teamData, inning) / (getForOvers(matchData, teamData, inning) + getForBalls(matchData, teamData, inning)) -
    getAgainstRuns(matchData, teamData, OTHER_INNING[inning]) /
      (getAgainstOvers(matchData, teamData, OTHER_INNING[inning]) + getAgainstBalls(matchData, teamData, OTHER_INNING[inning]))
  );
};

const saveTeamData = async (matchData: any) => {
  console.log('💡 | matchData:', matchData);
  try {
    const teamAData: Partial<_IDreamTeam_> = await DreamTeam.findById(matchData.teams.teamA);

    const teamBData: Partial<_IDreamTeam_> = await DreamTeam.findById(matchData.teams.teamB);

    const teamAUpdate: Partial<_IDreamTeam_> = {
      matches: {
        played: teamAData.matches.played + 1,
        won: getMatchWon(matchData, teamAData),
        lost: getMatchLost(matchData, teamAData),
        tied: teamAData.matches.tied,
      },
      netRunRate: {
        against: {
          balls: getAgainstBalls(matchData, teamAData, matchData.liveData.teamB.inning),
          overs: getAgainstOvers(matchData, teamAData, matchData.liveData.teamB.inning),
          runs: getAgainstRuns(matchData, teamAData, matchData.liveData.teamB.inning),
        },
        for: {
          balls: getForBalls(matchData, teamAData, matchData.liveData.teamA.inning),
          overs: getForOvers(matchData, teamAData, matchData.liveData.teamA.inning),
          runs: getForRuns(matchData, teamAData, matchData.liveData.teamA.inning),
        },
        runRate: getNetRunRate(matchData, teamAData, matchData.liveData.teamA.inning),
      },
      rankPoints: getMatchWon(matchData, teamAData)
        ? getMatchWon(matchData, teamAData) * 2 +
          (getMatchWon(matchData, teamAData) / (teamAData.matches.played || 0) + 1) * 1000 +
          getNetRunRate(matchData, teamAData, matchData.liveData.teamA.inning) * 10
        : 0,
    };
    console.log('💡 | teamAUpdate:', teamAUpdate);

    const teamBUpdate: Partial<_IDreamTeam_> = {
      matches: {
        played: teamBData.matches.played + 1,
        won: getMatchWon(matchData, teamBData),
        lost: getMatchLost(matchData, teamBData),
        tied: teamBData.matches.tied,
      },
      netRunRate: {
        against: {
          balls: getAgainstBalls(matchData, teamBData, matchData.liveData.teamA.inning),
          overs: getAgainstOvers(matchData, teamBData, matchData.liveData.teamA.inning),
          runs: getAgainstRuns(matchData, teamBData, matchData.liveData.teamA.inning),
        },
        for: {
          balls: getForBalls(matchData, teamBData, matchData.liveData.teamB.inning),
          overs: getForOvers(matchData, teamBData, matchData.liveData.teamB.inning),
          runs: getForRuns(matchData, teamBData, matchData.liveData.teamB.inning),
        },
        runRate: getNetRunRate(matchData, teamBData, matchData.liveData.teamB.inning),
      },
      rankPoints: getMatchWon(matchData, teamBData)
        ? getMatchWon(matchData, teamBData) * 2 +
          (getMatchWon(matchData, teamBData) / teamBData.matches.played + 1) * 1000 +
          getNetRunRate(matchData, teamBData, matchData.liveData.teamB.inning) * 10
        : 0,
    };

    const updatedTeamA = await DreamTeam.findByIdAndUpdate(matchData.teams.teamA, teamAUpdate, { new: true });
    console.log('💡 | updatedTeamA:', updatedTeamA);

    const updatedTeamB = await DreamTeam.findByIdAndUpdate(matchData.teams.teamB, teamBUpdate, { new: true });
    console.log('💡 | updatedTeamB:', updatedTeamB);

    return {
      success: true,
    };
  } catch (error) {
    console.log('💡 | error:', error);
  }
};

export { saveTeamData };

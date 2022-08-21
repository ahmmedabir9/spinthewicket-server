const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");
const saveMatch = require("../../saveMatch/saveMatch");

const endOfMatch = (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);

    var result;
    if (newData.innings.first.runs > newData.innings.second.runs) {
      result = {
        winner: newData.innings.first.battingTeam.name,
        wonBy: "Runs",
        runs: newData.innings.first.runs - newData.innings.second.runs,
      };
    } else if (newData.innings.first.runs < newData.innings.second.runs) {
      result = {
        winner: newData.innings.second.battingTeam.name,
        wonBy: "Wickets",
        wickets: 10 - newData.innings.second.wickets,
      };
    } else if (newData.superOver) {
      if (newData.innings.super_1.runs > newData.innings.super_2.runs) {
        result = {
          winner: newData.innings.super_1.battingTeam.name,
          wonBy: "Super Over",
        };
      } else if (newData.innings.super_1.runs < newData.innings.super_2.runs) {
        result = {
          winner: newData.innings.super_2.battingTeam.name,
          wonBy: "Super Over",
        };
      }
    } else if (newData.innings.first.runs === newData.innings.second.runs) {
      result = {
        status: "Tied",
      };
    }
    docRef
      .update({
        result: result,
        status: "completed",
        endedAt: new Date(),
      })
      .then(() => {
        docRef.get().then((doc) => {
          const completedMatchData = collectIdsAndDocs(doc);
          saveMatch(completedMatchData, docRef);
        });
      });
  });
};
module.exports = endOfMatch;

const saveTeamData = require("./functions/saveTeamData");
const savePlayerData = require("./functions/savePlayerData");

const saveMatch = (matchData, docRef) => {
  if (
    matchData.type !== "Super-Over" &&
    matchData.type !== "Friendly" &&
    matchData.type !== "Quick"
  ) {
    saveTeamData(matchData, docRef);
  }
  savePlayerData(matchData, docRef);
};
module.exports = saveMatch;

// import savePlayerData from './functions/savePlayerData';
import { _IMatch_ } from '../../models/_ModelTypes_';
import { saveTeamData } from './functions/saveTeamData';

const saveMatch = (matchData: Partial<_IMatch_>) => {
  if (matchData.matchType !== 'Super-Over' && matchData.matchType !== 'Friendly') {
    saveTeamData(matchData);
    // savePlayerData(matchData);
  }
};

export { saveMatch };

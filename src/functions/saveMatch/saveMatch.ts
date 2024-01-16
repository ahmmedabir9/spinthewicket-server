import { _IMatch_ } from '../../models/_ModelTypes_';
import { savePlayerData } from './functions/savePlayerData';
import { saveTeamData } from './functions/saveTeamData';

const saveMatch = async (matchData: Partial<_IMatch_>) => {
  if (matchData.matchType !== 'Super-Over' && matchData.matchType !== 'Friendly') {
    saveTeamData(matchData);
    await savePlayerData(matchData);
  }
};

export { saveMatch };

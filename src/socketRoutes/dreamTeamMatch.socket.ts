import { SpinTheWicket } from '..';
import { getMatchData, updateMatchData } from '../controllers/dreamTeamMatch.controller';
import { SocketResponder, SocketRoutes } from '../services/socketService';

export class DreamTeamMatchSocketRoutes extends SocketRoutes {
  constructor(app: SpinTheWicket) {
    super(app, 'dreamTeamMatch');
    this.addMethod('getMatchData');
    this.addMethod('updateMatchData');
  }
  async getMatchData(responder: SocketResponder, data = {}) {
    responder.respond(await getMatchData(data['args']));
  }

  async updateMatchData(responder: SocketResponder, data = {}) {
    responder.respond(await updateMatchData(data['args'], data['data']));
  }
}

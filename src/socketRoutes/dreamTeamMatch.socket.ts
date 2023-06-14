import { SpinTheWicket } from '..';
import { getMatchData } from '../controllers/dreamTeamMatch.controller';
import { SocketResponder, SocketRoutes } from '../services/socketService';

export class DreamTeamMatchSocketRoutes extends SocketRoutes {
  constructor(app: SpinTheWicket) {
    super(app, 'dreamTeamMatch');
    this.addMethod('getMatchData');
  }
  async getMatchData(responder: SocketResponder, data = {}) {
    responder.respond(await getMatchData(data['args']));
  }
}

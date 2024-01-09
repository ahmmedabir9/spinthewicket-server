import { SpinTheWicket } from '..';
import { getMatchData, playMatch, updateMatchData } from '../controllers/dreamTeamMatch.controller';
import { SocketResponder, SocketRoutes } from '../services/socketService';

export class DreamTeamMatchSocketRoutes extends SocketRoutes {
  constructor(app: SpinTheWicket) {
    super(app, 'dreamTeamMatch');
    this.addMethod('getMatchData');
    this.addMethod('updateMatchData');
    this.addMethod('playMatch');
  }
  async getMatchData(responder: SocketResponder, data = {}) {
    responder.respond(await getMatchData(data['args'], this.app, responder));
  }

  async updateMatchData(responder: SocketResponder, data = {}) {
    responder.respond(await updateMatchData(data['args'], data['data'], this.app));
  }

  async playMatch(responder: SocketResponder, data = {}) {
    responder.respond(await playMatch(data['data']));
  }
}

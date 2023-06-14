import { SpinTheWicket } from '../index.js';
import { DreamTeamMatchSocketRoutes } from './dreamTeamMatch.socket';

export class SocketRoutes {
  constructor(app: SpinTheWicket) {
    app.socketConnections.addSocketRoutes(new DreamTeamMatchSocketRoutes(app));
  }
}

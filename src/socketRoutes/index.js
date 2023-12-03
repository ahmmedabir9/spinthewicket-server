"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRoutes = void 0;
const dreamTeamMatch_socket_1 = require("./dreamTeamMatch.socket");
class SocketRoutes {
    constructor(app) {
        app.socketConnections.addSocketRoutes(new dreamTeamMatch_socket_1.DreamTeamMatchSocketRoutes(app));
    }
}
exports.SocketRoutes = SocketRoutes;

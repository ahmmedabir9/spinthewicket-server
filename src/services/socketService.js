"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketConnections = exports.SocketRoutes = exports.RESTResponder = exports.WebSocketResponder = exports.SocketResponder = void 0;
const events_1 = require("events");
const SocketWildcard = require('socketio-wildcard');
class SocketResponder {
    constructor(environmentVars, routeName, callName, request, requestData) {
        this.environmentVars = environmentVars;
        this.routeName = routeName;
        this.callName = callName;
        this.request = request;
        this.requestData = requestData;
        this.requestData = this.request.data;
    }
    get session() {
        return null;
    }
    progress(responseData) { }
    respond(responseData) { }
}
exports.SocketResponder = SocketResponder;
class WebSocketResponder extends SocketResponder {
    constructor(socket, environmentVars, routeName, callName, request, requestData) {
        super(environmentVars, routeName, callName, request, requestData);
        this.socket = socket;
    }
    get session() {
        return this.socket.handshake['session'];
    }
    progress(responseData) {
        this.socket.emit(this.routeName + '->' + this.callName + ':' + this.request['reqId'] + ':progress', responseData);
    }
    respond(responseData) {
        let respondFunc = () => {
            this.socket.emit(this.routeName + '->' + this.callName + ':' + this.request['reqId'] + ':reply', responseData);
        };
        respondFunc();
    }
}
exports.WebSocketResponder = WebSocketResponder;
class RESTResponder extends SocketResponder {
    constructor(reqRes, environmentVars, routeName, callName, request, requestData) {
        super(environmentVars, routeName, callName, request, requestData);
        this.reqRes = reqRes;
    }
    progress(responseData) {
        //cannot be implemented
    }
    respond(responseData) {
        this.reqRes.res.json(responseData);
    }
}
exports.RESTResponder = RESTResponder;
class SocketRoutes {
    constructor(app, routeName) {
        this.app = app;
        this.routeName = routeName;
        this.methods = new Map();
    }
    addMethod(key) {
        this.app.httpServer.express.post(`/${this.routeName}/${key}`, (req, res) => {
            this[key](new RESTResponder({ req, res }, this.app.environmentVars, this.routeName, key, {}, req.body['data']), req.body['data']);
        });
        this.methods.set(key, true);
    }
    onRequest(socket, callName, request) {
        if (this.methods.has(callName)) {
            this[callName](new WebSocketResponder(socket, this.app.environmentVars, this.routeName, callName, request, request['data']), request['data']);
        }
    }
}
exports.SocketRoutes = SocketRoutes;
class SocketConnections extends events_1.EventEmitter {
    constructor(app) {
        super();
        this.app = app;
        this.io = this.app.httpServer.io;
        this.io.use(SocketWildcard());
        this.socketRoutes = new Map();
        this.attachSocketHandlers();
        this.groups = new Map();
    }
    addSocketRoutes(socketRoutes) {
        this.socketRoutes.set(socketRoutes.routeName, socketRoutes);
    }
    addToGroup(groupName, socket) {
        if (!this.groups.has(groupName)) {
            this.groups.set(groupName, new Set());
        }
        if (!this.groups.get(groupName).has(socket)) {
            this.groups.get(groupName).add(socket);
            socket.on('disconnect', () => {
                this.removeFromGroup(groupName, socket);
            });
        }
    }
    removeFromGroup(groupName, socket) {
        if (this.groups.has(groupName)) {
            if (this.groups.get(groupName).has(socket)) {
                this.groups.get(groupName).delete(socket);
            }
            if (this.groups.get(groupName).size === 0) {
                this.groups.delete(groupName); //to clean the memory;
            }
        }
    }
    broadcastToGroup(groupName, event, payload) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    broadcastInMemory(groupName, event, payload) {
        // ;
        if (this.groups.has(groupName)) {
            // ;
            for (let socket of this.groups.get(groupName)) {
                socket.emit(event, payload);
            }
        }
    }
    attachSocketHandlers() {
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            this.emit('socket', socket);
            socket.on('*', (packet) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // ;
                if (((_a = packet === null || packet === void 0 ? void 0 : packet.data) === null || _a === void 0 ? void 0 : _a.length) >= 2) {
                    if (packet.data[0] && packet.data[0].indexOf('->') > -1) {
                        let funcPath = packet.data[0].split('->');
                        let route = funcPath[0];
                        let method = funcPath[1];
                        let request = packet.data[1];
                        try {
                            request = typeof request === 'string' ? JSON.parse(request) : request;
                        }
                        catch (e) {
                            request = packet.data[1];
                        }
                        if (this.socketRoutes.has(route)) {
                            this.socketRoutes.get(route).onRequest(socket, method, request);
                        }
                        else {
                            if (this.app.environmentVars.envMode !== 'prod') {
                                let responder = new WebSocketResponder(socket, this.app.environmentVars, route, method, request, request['data']);
                                responder.respond({
                                    error: true,
                                    errorMessage: `${route}->${method} not registered`,
                                });
                            }
                        }
                    }
                }
            }));
        }));
    }
}
exports.SocketConnections = SocketConnections;

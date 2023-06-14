import { EventEmitter } from 'events';
import express from 'express';
import socketIO, { Socket } from 'socket.io';

import { EnvironmentVars, SpinTheWicket } from '../index.js';

const SocketWildcard = require('socketio-wildcard');

interface HTTPRequestResponse {
  req: express.Request;
  res: express.Response;
}
export class SocketResponder {
  constructor(
    protected environmentVars: EnvironmentVars,
    public routeName: string,
    public callName: string,
    public request: any,
    public requestData: any,
  ) {
    this.requestData = this.request.data;
  }
  get session() {
    return null;
  }
  progress(responseData: Object) {}
  respond(responseData: Object) {}
}
export type SocketObject = Socket;
export class WebSocketResponder extends SocketResponder {
  public requestData: any;
  constructor(
    public socket: Socket,
    environmentVars: EnvironmentVars,
    routeName: string,
    callName: string,
    request: any,
    requestData: any,
  ) {
    super(environmentVars, routeName, callName, request, requestData);
  }
  get session() {
    return this.socket.handshake['session'];
  }
  progress(responseData: Object) {
    this.socket.emit(
      this.routeName + '->' + this.callName + ':' + this.request['reqId'] + ':progress',
      responseData,
    );
  }
  respond(responseData: Object) {
    let respondFunc = () => {
      this.socket.emit(
        this.routeName + '->' + this.callName + ':' + this.request['reqId'] + ':reply',
        responseData,
      );
    };

    respondFunc();
  }
}
export class RESTResponder extends SocketResponder {
  public requestData: any;
  constructor(
    public reqRes: HTTPRequestResponse,
    environmentVars: EnvironmentVars,
    routeName: string,
    callName: string,
    request: any,
    requestData: any,
  ) {
    super(environmentVars, routeName, callName, request, requestData);
  }

  progress(responseData: Object) {
    //cannot be implemented
  }
  respond(responseData: Object) {
    this.reqRes.res.json(responseData);
  }
}
export class SocketRoutes {
  methods: Map<string, boolean> = new Map();
  constructor(protected app: SpinTheWicket, public routeName: string) {}
  addMethod(key: string) {
    this.app.httpServer.express.post(`/${this.routeName}/${key}`, (req, res) => {
      this[key](
        new RESTResponder(
          { req, res },
          this.app.environmentVars,
          this.routeName,
          key,
          {},
          req.body['data'],
        ),
        req.body['data'],
      );
    });
    this.methods.set(key, true);
  }
  onRequest(socket: Socket, callName: string, request: Object) {
    if (this.methods.has(callName)) {
      this[callName](
        new WebSocketResponder(
          socket,
          this.app.environmentVars,
          this.routeName,
          callName,
          request,
          request['data'],
        ),
        request['data'],
      );
    }
  }
}
export class SocketConnections extends EventEmitter {
  io: socketIO.Server;
  socketRoutes: Map<string, SocketRoutes>;
  groups: Map<string, Set<Socket>>;
  constructor(private app: SpinTheWicket) {
    super();
    this.io = this.app.httpServer.io;
    this.io.use(SocketWildcard());
    this.socketRoutes = new Map<string, SocketRoutes>();
    this.attachSocketHandlers();
    this.groups = new Map();
  }
  addSocketRoutes(socketRoutes: SocketRoutes) {
    this.socketRoutes.set(socketRoutes.routeName, socketRoutes);
  }
  addToGroup(groupName: string, socket: Socket) {
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
  removeFromGroup(groupName: string, socket: Socket) {
    if (this.groups.has(groupName)) {
      if (this.groups.get(groupName).has(socket)) {
        this.groups.get(groupName).delete(socket);
      }
      if (this.groups.get(groupName).size === 0) {
        this.groups.delete(groupName); //to clean the memory;
      }
    }
  }
  async broadcastToGroup(groupName: string, event: string, payload: any) {}
  broadcastInMemory(groupName: string, event: string, payload: any) {
    // ;
    if (this.groups.has(groupName)) {
      // ;
      for (let socket of this.groups.get(groupName)) {
        socket.emit(event, payload);
      }
    }
  }
  attachSocketHandlers() {
    this.io.on('connection', async (socket) => {
      this.emit('socket', socket);
      socket.on('*', async (packet) => {
        // ;
        if (packet?.data?.length >= 2) {
          if (packet.data[0] && packet.data[0].indexOf('->') > -1) {
            let funcPath = packet.data[0].split('->');
            let route = funcPath[0];
            let method = funcPath[1];
            let request = packet.data[1];
            try {
              request = typeof request === 'string' ? JSON.parse(request) : request;
            } catch (e) {
              request = packet.data[1];
            }
            if (this.socketRoutes.has(route)) {
              this.socketRoutes.get(route).onRequest(socket, method, request);
            } else {
              if (this.app.environmentVars.envMode !== 'prod') {
                let responder = new WebSocketResponder(
                  socket,
                  this.app.environmentVars,
                  route,
                  method,
                  request,
                  request['data'],
                );
                responder.respond({
                  error: true,
                  errorMessage: `${route}->${method} not registered`,
                });
              }
            }
          }
        }
      });
    });
  }
}

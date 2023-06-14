import { EventEmitter } from 'events';
import { connect } from 'mongoose';

import { HTTPServer } from './services/http';
import { SocketConnections, SocketObject } from './services/socketService';
import { SocketRoutes } from './socketRoutes';

// let admin = require('firebase-admin');

// let serviceAccount = require('../spin-the-wicket-dev-firebase-adminsdk-aw42k-011dfe9971.json');
const { mongoURI } = require('./config/database');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://spin-the-wicket.firebaseio.com',
// });

export class EnvironmentVars {
  port: number = process.argv[2] === 'prod' ? 5000 : 5000;
  envMode: string = process.argv[2] === 'prod' ? 'prod' : process.argv[2] === 'uat' ? 'uat' : 'dev';
  jwtSecret: string = 'spin-the-wicket-jwt-secret-aksdj3hsajkndsdnad';
  dbName = 'spin-the-wicket';
  sessionName: string = 'session-spin-the-wicket-backend';
  dbConnectionString = `mongodb+srv://abir:tamimiqbal28@cluster0.ecxlb.mongodb.net/spinthewicket_dev?retryWrites=true&w=majority`;
  SERVER_BASE_URL = 'http://localhost:5000';

  constructor() {
    if (process.env['port']) {
      this.port = parseInt(process.env['port']);
    }
    if (process.env['envMode']) {
      this.envMode = process.env['envMode'];
    } else {
      this.envMode = 'dev';
    }
    if (process.env['dbName']) {
      this.dbName = process.env['dbName'];
    }
    if (process.env['dbConnectionString']) {
      this.dbConnectionString = process.env['dbConnectionString'];
    }
    if (process.env['SERVER_BASE_URL']) {
      this.SERVER_BASE_URL = process.env['SERVER_BASE_URL'];
    }
  }
}

export class SpinTheWicket extends EventEmitter {
  httpServer: HTTPServer;
  rootPath: string;
  socketConnections: SocketConnections;
  environmentVars: EnvironmentVars;
  ruleEngineFilePath: string;
  socketRoutes: SocketRoutes;
  constructor() {
    super();
    this.environmentVars = new EnvironmentVars();
    try {
      connect(
        mongoURI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        },
        () => {
          {
            console.log('Database Connected');
            this.httpServer = new HTTPServer(this);
            this.socketConnections = new SocketConnections(this);
            this.socketRoutes = new SocketRoutes(this);
            this.socketConnections.on('socket', (socket: SocketObject) => {
              if (socket?.handshake['session']?.user) {
                this.socketConnections.addToGroup(
                  `user-self-${socket?.handshake['session']?.user._id}`,
                  socket,
                );
                this.socketConnections.addToGroup(`user-self`, socket);
              }
            });

            this.httpServer.setupStaticAndErrorHandlers();
          }
        },
      );
    } catch (err) {
      console.log('Database Connection Error', err);
    }
  }
}
const app = new SpinTheWicket();

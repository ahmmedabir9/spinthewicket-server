"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinTheWicket = exports.EnvironmentVars = void 0;
const events_1 = require("events");
const mongoose_1 = require("mongoose");
const http_1 = require("./services/http");
const socketService_1 = require("./services/socketService");
const socketRoutes_1 = require("./socketRoutes");
const mongoURI = "mongodb+srv://abir:tamimiqbal28@cluster0.ecxlb.mongodb.net/spinthewicket_dev?retryWrites=true&w=majority";
class EnvironmentVars {
    constructor() {
        this.port = process.argv[2] === "prod" ? 5005 : 5005;
        this.envMode = process.argv[2] === "prod"
            ? "prod"
            : process.argv[2] === "uat"
                ? "uat"
                : "dev";
        this.jwtSecret = "spin-the-wicket-jwt-secret-aksdj3hsajkndsdnad";
        this.dbName = "spin-the-wicket";
        this.sessionName = "session-spin-the-wicket-backend";
        this.dbConnectionString = `mongodb+srv://abir:tamimiqbal28@cluster0.ecxlb.mongodb.net/spinthewicket_dev?retryWrites=true&w=majority`;
        this.SERVER_BASE_URL = "http://localhost:5000";
        if (process.env["port"]) {
            this.port = parseInt(process.env["port"]);
        }
        if (process.env["envMode"]) {
            this.envMode = process.env["envMode"];
        }
        else {
            this.envMode = "dev";
        }
        if (process.env["dbName"]) {
            this.dbName = process.env["dbName"];
        }
        if (process.env["dbConnectionString"]) {
            this.dbConnectionString = process.env["dbConnectionString"];
        }
        if (process.env["SERVER_BASE_URL"]) {
            this.SERVER_BASE_URL = process.env["SERVER_BASE_URL"];
        }
    }
}
exports.EnvironmentVars = EnvironmentVars;
class SpinTheWicket extends events_1.EventEmitter {
    constructor() {
        super();
        this.environmentVars = new EnvironmentVars();
        try {
            (0, mongoose_1.connect)(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            }, () => {
                {
                    console.log("Database Connected");
                    this.httpServer = new http_1.HTTPServer(this);
                    this.socketConnections = new socketService_1.SocketConnections(this);
                    this.socketRoutes = new socketRoutes_1.SocketRoutes(this);
                    this.socketConnections.on("socket", (socket) => {
                        var _a, _b;
                        if ((_a = socket === null || socket === void 0 ? void 0 : socket.handshake["session"]) === null || _a === void 0 ? void 0 : _a.user) {
                            this.socketConnections.addToGroup(`user-self-${(_b = socket === null || socket === void 0 ? void 0 : socket.handshake["session"]) === null || _b === void 0 ? void 0 : _b.user._id}`, socket);
                            this.socketConnections.addToGroup(`user-self`, socket);
                        }
                    });
                    this.httpServer.setupStaticAndErrorHandlers();
                }
            });
        }
        catch (err) {
            console.log("Database Connection Error", err);
        }
    }
}
exports.SpinTheWicket = SpinTheWicket;
const app = new SpinTheWicket();

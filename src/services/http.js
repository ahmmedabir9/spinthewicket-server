"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const socketIO = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
class HTTPServer {
    constructor(app) {
        this.app = app;
        this.express = express();
        if (this.app.environmentVars.envMode !== "prod") {
            // CORS and preflight filtering
            this.express.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT");
                next();
            });
        }
        // this.express.set('views', path.join(this.app.rootPath, './views'));
        // this.express.set('view engine', 'ejs');
        this.express.use(bodyParser.json({
            verify: (req, res, buf) => {
                req.rawBody = buf;
            },
        }));
        this.express.use(bodyParser.urlencoded({ extended: false }));
        const userRoute = require("../routes/user.routes");
        const themeRoute = require("../routes/theme.routes");
        const playerRoute = require("../routes/player.routes");
        const dreamTeamRoute = require("../routes/dreamTeam.routes");
        const quickMatchRoute = require("../routes/quickMatch.routes");
        this.server = http.createServer(this.express);
        this.io = new socketIO.Server(this.server);
        this.express.use("/quick-match", quickMatchRoute);
        this.express.use("/dream-team", dreamTeamRoute);
        this.express.use("/player", playerRoute);
        this.express.use("/theme", themeRoute);
        this.express.use("/user", userRoute);
        this.express.get("/", (req, res) => {
            res.send("<div><h1>The Server is Running</h1></div>");
        });
        this.server.listen(this.app.environmentVars.port, () => {
            console.log("SERVER RUNNING");
        });
    }
    setupStaticAndErrorHandlers() {
        // this.express.use(express.static(path.join(this.app.rootPath, './public')));
        // this.express.use(express.static(path.join(this.app.rootPath, './downloads')));
        // catch 404 and forward to error handler
        this.express.use((req, res, next) => {
            let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
            res.status(404).end();
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (this.express.get("env") === "development") {
            this.express.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.send("The page handler is not registered.");
            });
        }
    }
}
exports.HTTPServer = HTTPServer;

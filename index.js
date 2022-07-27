const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
// const { firestore } = require("firebase");
// var admin = require("firebase-admin");
const router = express.Router();
const { connect } = require("mongoose");
const { mongoURI } = require("./src/config/database");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var admin = require("firebase-admin");

// var serviceAccount = require("./spin-the-wicket-firebase-adminsdk-xobgj-21a901be7b.json");

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
      console.log("Database Connected");
    }
  );
} catch (err) {
  console.log("Database Connection Error", err);
}

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://spin-the-wicket.firebaseio.com",
// });

// const managerRoute = require("./api/routes/managerRoute");
// const firestoreDB = admin.firestore();

// const getData = (req, res) => {
//   firestoreDB
//     .collection("leagues")
//     .get()
//     .then((snapshot) => {
//       const data = snapshot.docs.map((doc) => {
//         return {
//           id: doc.id,
//           ...doc.data(),
//         };
//       });
//       res.status(200).json(data);
//     });
// };

// const playMatch = require("./API/playMatch/playMatch");
// const fileRoute = require("./src/routes/file.routes");
// const leagueRoute = require("./src/routes/league.routes");
const userRoute = require("./src/routes/user.routes");
const themeRoute = require("./src/routes/theme.routes");
// const leagueInvitationRoute = require("./src/routes/leagueInvitation.routes");
// const { addPlayer } = require("./src/utils/addPlayer");

// app.use("/playMatch", playMatch);
// app.use("/league-invitation", leagueInvitationRoute);
app.use("/theme", themeRoute);
app.use("/user", userRoute);
// app.use("/league", leagueRoute);
// app.use("/file", fileRoute);
// app.get("/getData", getData);
// app.post("/addPlayer", addPlayer);

app.get("/", (req, res) => {
  res.send("<div><h1>The Server is Running</h1></div>");
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is Running on " + port);
});

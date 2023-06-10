const express = require("express");
const bodyParser = require("body-parser");
let cors = require("cors");
// const { firestore } = require("firebase");
let admin = require("firebase-admin");
const router = express.Router();
const { connect } = require("mongoose");
const { mongoURI } = require("./src/config/database");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var admin = require("firebase-admin");

let serviceAccount = require("./spin-the-wicket-dev-firebase-adminsdk-aw42k-011dfe9971.json");

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
    },
  );
} catch (err) {
  console.log("Database Connection Error", err);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spin-the-wicket.firebaseio.com",
});

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

const userRoute = require("./src/routes/user.routes");
const themeRoute = require("./src/routes/theme.routes");
const playerRoute = require("./src/routes/player.routes");
const dreamTeamRoute = require("./src/routes/dreamTeam.routes");
const quickMatchRoute = require("./src/routes/quickMatch.routes");

app.use("/quick-match", quickMatchRoute);
app.use("/dream-team", dreamTeamRoute);
app.use("/player", playerRoute);
app.use("/theme", themeRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("<div><h1>The Server is Running</h1></div>");
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is Running on " + port);
});

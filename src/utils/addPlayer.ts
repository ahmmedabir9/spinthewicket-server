import { Request, Response } from "express";

const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const addPlayer = async (req: Request, res: Response) => {
  const { battingStyle, bowlingStyle, name, nationality, photoURL, role, teams } = req.body;

  const key = name.replace(/\s+/g, "-").replace(/\//g, "-").replace(/&/g, "n").toLowerCase();

  await firestore.collection("players").doc(key).set({
    battingStyle,
    bowlingStyle,
    nationality,
    photoURL,
    name,
    role,
    teams,
  });

  return res.json({ created: true });
};

module.exports = { addPlayer };

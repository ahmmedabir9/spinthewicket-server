const express = require('express');
const router = express.Router();
const admin = require('spin-the-wicket');
const dotBall = require('./functions/runs/dotBall');
const fourRuns = require('./functions/runs/fourRuns');
const noBall = require('./functions/runs/noBall');
const oneRun = require('./functions/runs/oneRun');
const twoRuns = require('./functions/runs/twoRuns');
const sixRuns = require('./functions/runs/sixRuns');
const threeRuns = require('./functions/runs/threeRuns');
const wideBall = require('./functions/runs/wideBall');
const bowled = require('./functions/wickets/bowled');
const catchOut = require('./functions/wickets/catchOut');
const lbw = require('./functions/wickets/lbw');
const runOut = require('./functions/wickets/runOut');
const ballValidation = require('../../utils/ballValidation');
const collectIdsAndDocs = require('../../utils/collectIdsAndDocs');

const database = admin.firestore();

router.post('/', async (req, res, next) => {
  const { status, league, match, lastSpinPosition } = req.body;
  var docRef;
  if (league) {
    docRef = database.collection('leagues').doc(league).collection('matches').doc(match);
  } else {
    docRef = database.collection('quickMatches').doc(match);
  }

  const doc = await docRef.get();
  const matchData = collectIdsAndDocs(doc);

  var inning;
  if (matchData.now.inning === 1) {
    inning = 'first';
  } else if (matchData.now.inning === 2) {
    inning = 'second';
  } else if (matchData.now.inning === 3) {
    inning = 'firstSuper';
  } else if (matchData.now.inning === 4) {
    inning = 'secondSuper';
  }

  if (ballValidation(matchData)) {
    setTimeout(() => {
      const handler = async () => {
        if (status === '0') await dotBall(matchData, docRef, inning);
        if (status === '1') await oneRun(matchData, docRef, inning);
        if (status === '2') await twoRuns(matchData, docRef, inning);
        if (status === '3') await threeRuns(matchData, docRef, inning);
        if (status === '4') await fourRuns(matchData, docRef, inning);
        if (status === '6') await sixRuns(matchData, docRef, inning);
        if (status === 'WIDE') await wideBall(matchData, docRef, inning);
        if (status === 'NO BALL') await noBall(matchData, docRef, inning);
        if (status === 'BOWLED') await bowled(matchData, docRef, inning);
        if (status === 'LBW') await lbw(matchData, docRef, inning);
        if (status === 'CATCH') await catchOut(matchData, docRef, inning);
        if (status === 'RUN OUT') await runOut(matchData, docRef, inning);

        docRef.update({
          'now.lastSpinPosition': lastSpinPosition,
          'now.spinning': false,
        });
      };

      handler();
    }, 4000);
    res.status(201).json({
      updated: true,
    });
  } else {
    res.status(400).json({
      updated: false,
    });
  }
});

module.exports = router;

const firebase = require('firebase-admin');
const collectIdsAndDocs = require('../../../utils/collectIdsAndDocs');
const endOfMatch = require('./endOfMatch');

const allOut = async (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);
    if (newData.liveData.wickets === 10 || (newData.superOver && newData.liveData.wickets >= 2)) {
      var bowler = {
        name: newData.liveData.bowler.name,
        balls: newData.liveData.bowler.balls,
        runs: newData.liveData.bowler.runs,
        id: newData.liveData.bowler.id,
        photoURL: newData.liveData.bowler.photoURL,
        maidens: newData.liveData.bowler.maidens,
        role: newData.liveData.bowler.role,
        economy: newData.liveData.bowler.economy,
        overs: newData.liveData.bowler.overs,
        wickets: newData.liveData.bowler.wickets,
      };

      if (newData.liveData.balls === 6) {
        bowler = {
          name: newData.liveData.bowler.name,
          balls: 0,
          runs: newData.liveData.bowler.runs,
          id: newData.liveData.bowler.id,
          photoURL: newData.liveData.bowler.photoURL,
          maidens: newData.liveData.bowler.maidens,
          role: newData.liveData.bowler.role,
          economy: newData.liveData.bowler.economy,
          overs: newData.liveData.bowler.overs + 1,
          wickets: newData.liveData.bowler.wickets,
        };
      }

      var notOut;

      if (newData.liveData.batsman.nonStriker) {
        notOut = {
          balls: newData.liveData.batsman.nonStriker.balls,
          fours: newData.liveData.batsman.nonStriker.fours,
          id: newData.liveData.batsman.nonStriker.id,
          inAt: newData.liveData.batsman.nonStriker.inAt,
          name: newData.liveData.batsman.nonStriker.name,
          photoURL: newData.liveData.batsman.nonStriker.photoURL,
          runs: newData.liveData.batsman.nonStriker.runs,
          sixes: newData.liveData.batsman.nonStriker.sixes,
          strikeRate:
            (newData.liveData.batsman.nonStriker.runs / newData.liveData.batsman.nonStriker.balls) *
            100,
          status: 'not out',
        };
      } else if (newData.liveData.batsman.striker) {
        notOut = {
          balls: newData.liveData.batsman.striker.balls,
          fours: newData.liveData.batsman.striker.fours,
          id: newData.liveData.batsman.striker.id,
          inAt: newData.liveData.batsman.striker.inAt,
          name: newData.liveData.batsman.striker.name,
          photoURL: newData.liveData.batsman.striker.photoURL,
          runs: newData.liveData.batsman.striker.runs,
          sixes: newData.liveData.batsman.striker.sixes,
          strikeRate:
            (newData.liveData.batsman.striker.runs / newData.liveData.batsman.striker.balls) * 100,
          status: 'not out',
        };
      }

      docRef
        .update({
          'liveData.bowler': null,
          'liveData.batsman.striker': null,
          'liveData.batsman.nonStriker': null,
          'liveData.balls': 0,
          'liveData.overs': 0,
          'liveData.battingTeam': newData.liveData.bowlingTeam,
          'liveData.bowlingTeam': newData.liveData.battingTeam,
          'liveData.battingScorer': newData.liveData.bowlingScorer,
          'liveData.bowlingScorer': newData.liveData.battingScorer,
          'liveData.runs': 0,
          'liveData.partnership': {
            runs: 0,
            balls: 0,
            batsman1: '',
            batsman2: '',
          },
          'liveData.target': newData.liveData.runs + 1,
          'liveData.inning': firebase.firestore.FieldValue.increment(1),
          'liveData.wickets': 0,
          'liveData.thisOver': [],
          'liveData.need': newData.liveData.runs + 1,
          'liveData.from': newData.overs * 6,
          'liveData.reqRR': (newData.liveData.runs + 1) / newData.overs,
          [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(notOut),
          [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(bowler),
        })
        .then(() => {
          if (inning === 'second') {
            if (newData.innings.first.runs === newData.innings.second.runs) {
              const innings = {
                firstSuper: {
                  battingTeam: newData.innings.second.battingTeam,
                  bowlingTeam: newData.innings.first.battingTeam,
                  battingScorer: newData.innings.second.battingScorer,
                  bowlingScorer: newData.innings.second.bowlingScorer,
                  battingOrder: [],
                  bowlingOrder: [],
                  partnerships: [],
                  fallOfWickets: [],
                  ballByBall: [],
                  overs: 0,
                  balls: 0,
                  runs: 0,
                  wickets: 0,
                  runRate: 0,
                  extra: 0,
                },
                secondSuper: {
                  battingTeam: newData.innings.first.battingTeam,
                  bowlingTeam: newData.innings.second.battingTeam,
                  battingScorer: newData.innings.first.battingScorer,
                  bowlingScorer: newData.innings.first.bowlingScorer,
                  battingOrder: [],
                  bowlingOrder: [],
                  partnerships: [],
                  fallOfWickets: [],
                  ballByBall: [],
                  overs: 0,
                  balls: 0,
                  runs: 0,
                  wickets: 0,
                  runRate: 0,
                  extra: 0,
                },
              };

              docRef.update({
                'liveData.battingTeam': newData.liveData.battingTeam,
                'liveData.bowlingTeam': newData.liveData.bowlingTeam,
                'liveData.battingScorer': newData.liveData.battingScorer,
                'liveData.bowlingScorer': newData.liveData.bowlingScorer,
                'liveData.target': null,
                'liveData.inning': 3,
                'liveData.need': null,
                'liveData.from': null,
                'liveData.reqRR': null,
                'innings.firstSuper': innings.firstSuper,
                'innings.secondSuper': innings.secondSuper,
                superOver: true,
              });
            } else {
              endOfMatch(newData, docRef, inning);
            }
          } else if (inning === 'secondSuper') {
            if (newData.innings.firstSuper.runs === newData.innings.secondSuper.runs) {
              const innings = {
                firstSuper: {
                  battingTeam: newData.innings.second.battingTeam,
                  bowlingTeam: newData.innings.first.battingTeam,
                  battingScorer: newData.innings.second.battingScorer,
                  bowlingScorer: newData.innings.second.bowlingScorer,
                  battingOrder: [],
                  bowlingOrder: [],
                  partnerships: [],
                  fallOfWickets: [],
                  ballByBall: [],
                  overs: 0,
                  balls: 0,
                  runs: 0,
                  wickets: 0,
                  runRate: 0,
                  extra: 0,
                },
                secondSuper: {
                  battingTeam: newData.innings.first.battingTeam,
                  bowlingTeam: newData.innings.second.battingTeam,
                  battingScorer: newData.innings.first.battingScorer,
                  bowlingScorer: newData.innings.first.bowlingScorer,
                  battingOrder: [],
                  bowlingOrder: [],
                  partnerships: [],
                  fallOfWickets: [],
                  ballByBall: [],
                  overs: 0,
                  balls: 0,
                  runs: 0,
                  wickets: 0,
                  runRate: 0,
                  extra: 0,
                },
              };

              docRef.update({
                'liveData.battingTeam': newData.liveData.battingTeam,
                'liveData.bowlingTeam': newData.liveData.bowlingTeam,
                'liveData.battingScorer': newData.liveData.battingScorer,
                'liveData.bowlingScorer': newData.liveData.bowlingScorer,
                'liveData.target': null,
                'liveData.inning': 3,
                'liveData.need': null,
                'liveData.from': null,
                'liveData.reqRR': null,
                'innings.firstSuper': innings.firstSuper,
                'innings.secondSuper': innings.secondSuper,
                superOver: true,
              });
            } else {
              endOfMatch(newData, docRef, inning);
            }
          }
        });
    }
  });
};
module.exports = allOut;

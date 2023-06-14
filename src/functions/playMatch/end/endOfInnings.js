const firebase = require('firebase-admin');
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const endOfMatch = require('./endOfMatch');

const endOfInnings = async (matchData, docRef, inning) => {
  var batsman = [];
  if (matchData.liveData.batsman.striker) {
    const striker = {
      balls: matchData.liveData.batsman.striker.balls,
      fours: matchData.liveData.batsman.striker.fours,
      id: matchData.liveData.batsman.striker.id,
      inAt: matchData.liveData.batsman.striker.inAt,
      name: matchData.liveData.batsman.striker.name,
      photoURL: matchData.liveData.batsman.striker.photoURL,
      runs: matchData.liveData.batsman.striker.runs,
      sixes: matchData.liveData.batsman.striker.sixes,
      strikeRate:
        (matchData.liveData.batsman.striker.runs / matchData.liveData.batsman.striker.balls) * 100,
      status: 'not out',
    };
    batsman = [...batsman, striker];
  }
  if (matchData.liveData.batsman.nonStriker) {
    const nonStriker = {
      balls: matchData.liveData.batsman.nonStriker.balls,
      fours: matchData.liveData.batsman.nonStriker.fours,
      id: matchData.liveData.batsman.nonStriker.id,
      inAt: matchData.liveData.batsman.nonStriker.inAt,
      name: matchData.liveData.batsman.nonStriker.name,
      photoURL: matchData.liveData.batsman.nonStriker.photoURL,
      runs: matchData.liveData.batsman.nonStriker.runs,
      sixes: matchData.liveData.batsman.nonStriker.sixes,
      strikeRate:
        (matchData.liveData.batsman.nonStriker.runs / matchData.liveData.batsman.nonStriker.balls) *
        100,
      status: 'not out',
    };
    batsman = [...batsman, nonStriker];
  }

  if (batsman.length === 1) {
    docRef
      .update({
        'liveData.bowler': null,
        'liveData.extra': 0,
        'liveData.runRate': 0,
        'liveData.batsman.striker': null,
        'liveData.batsman.nonStriker': null,
        'liveData.balls': 0,
        'liveData.overs': 0,
        'liveData.freeHit': null,
        'liveData.battingTeam': matchData.liveData.bowlingTeam,
        'liveData.bowlingTeam': matchData.liveData.battingTeam,
        'liveData.battingScorer': matchData.liveData.bowlingScorer,
        'liveData.bowlingScorer': matchData.liveData.battingScorer,
        'liveData.runs': 0,
        'liveData.target': matchData.liveData.runs + 1,
        'liveData.inning': firebase.firestore.FieldValue.increment(1),
        'liveData.wickets': 0,
        'liveData.need': matchData.liveData.runs + 1,
        'liveData.partnership': {
          runs: 0,
          balls: 0,
          batsman1: '',
          batsman2: '',
        },
        'liveData.from': matchData.overs * 6,
        'liveData.reqRR': (matchData.liveData.runs + 1) / matchData.overs,
        [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(batsman[0]),
        [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
          runs: matchData.liveData.partnership.runs,
          balls: matchData.liveData.partnership.balls,
          batsman1: matchData.liveData.partnership.batsman1,
          batsman2: matchData.liveData.partnership.batsman2,
        }),
      })
      .then(() => {
        if (inning === 'second') {
          if (matchData.innings.first.runs === matchData.innings.second.runs) {
            const innings = {
              firstSuper: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
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
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
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
              'liveData.battingTeam': matchData.liveData.battingTeam,
              'liveData.bowlingTeam': matchData.liveData.bowlingTeam,
              'liveData.battingScorer': matchData.liveData.battingScorer,
              'liveData.bowlingScorer': matchData.liveData.bowlingScorer,
              'liveData.target': null,
              'liveData.need': null,
              'liveData.from': null,
              'liveData.reqRR': null,
              'innings.firstSuper': innings.firstSuper,
              'innings.secondSuper': innings.secondSuper,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        } else if (inning === 'secondSuper') {
          if (matchData.innings.firstSuper.runs === matchData.innings.secondSuper.runs) {
            const innings = {
              firstSuper: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
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
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
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
              'liveData.battingTeam': matchData.liveData.battingTeam,
              'liveData.bowlingTeam': matchData.liveData.bowlingTeam,
              'liveData.battingScorer': matchData.liveData.battingScorer,
              'liveData.bowlingScorer': matchData.liveData.bowlingScorer,
              'liveData.target': null,
              'liveData.need': null,
              'liveData.from': null,
              'liveData.reqRR': null,
              'innings.firstSuper': innings.firstSuper,
              'innings.secondSuper': innings.secondSuper,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        }
      });
  } else {
    docRef
      .update({
        'liveData.bowler': null,
        'liveData.extra': 0,
        'liveData.runRate': 0,
        'liveData.batsman.striker': null,
        'liveData.batsman.nonStriker': null,
        'liveData.balls': 0,
        'liveData.overs': 0,
        'liveData.freeHit': null,
        'liveData.battingTeam': matchData.liveData.bowlingTeam,
        'liveData.bowlingTeam': matchData.liveData.battingTeam,
        'liveData.battingScorer': matchData.liveData.bowlingScorer,
        'liveData.bowlingScorer': matchData.liveData.battingScorer,
        'liveData.runs': 0,
        'liveData.partnership': {
          runs: 0,
          balls: 0,
          batsman1: '',
          batsman2: '',
        },
        'liveData.target': matchData.liveData.runs + 1,
        'liveData.inning': firebase.firestore.FieldValue.increment(1),
        'liveData.wickets': 0,
        'liveData.need': matchData.liveData.runs + 1,
        'liveData.from': matchData.overs * 6,
        'liveData.reqRR': (matchData.liveData.runs + 1) / matchData.overs,
        [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
          batsman[0],
          batsman[1],
        ),
        [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
          runs: matchData.liveData.partnership.runs,
          balls: matchData.liveData.partnership.balls,
          batsman1: matchData.liveData.partnership.batsman1,
          batsman2: matchData.liveData.partnership.batsman2,
        }),
      })
      .then(() => {
        if (inning === 'second') {
          if (matchData.innings.first.runs === matchData.innings.second.runs) {
            const innings = {
              firstSuper: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
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
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
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
              'liveData.battingTeam': matchData.liveData.battingTeam,
              'liveData.bowlingTeam': matchData.liveData.bowlingTeam,
              'liveData.battingScorer': matchData.liveData.battingScorer,
              'liveData.bowlingScorer': matchData.liveData.bowlingScorer,
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
            endOfMatch(matchData, docRef, inning);
          }
        } else if (inning === 'secondSuper') {
          if (matchData.innings.firstSuper.runs === matchData.innings.secondSuper.runs) {
            const innings = {
              firstSuper: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
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
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
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
              'liveData.battingTeam': matchData.liveData.battingTeam,
              'liveData.bowlingTeam': matchData.liveData.bowlingTeam,
              'liveData.battingScorer': matchData.liveData.battingScorer,
              'liveData.bowlingScorer': matchData.liveData.bowlingScorer,
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
            endOfMatch(matchData, docRef, inning);
          }
        }
      });
  }
};
module.exports = endOfInnings;

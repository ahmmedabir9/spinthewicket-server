const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");
const firestore = firebase.firestore();

const savePlayerData = (matchData, docRef) => {
  var teamAWinningPoint = -5,
    teamBWinningPoint = -5;

  if (matchData.innings.first.runs > matchData.innings.second.runs) {
    teamAWinningPoint = 5;
  } else if (matchData.innings.first.runs < matchData.innings.second.runs) {
    teamBWinningPoint = 5;
  } else if (matchData.superOver) {
    if (matchData.innings.super_2.runs > matchData.innings.super_1.runs) {
      teamAWinningPoint = 5;
    } else if (matchData.innings.super_2.runs < matchData.innings.super_1.runs) {
      teamBWinningPoint = 5;
    }
  }

  var teamAPlayers;
  var teamBPlayers;

  if (matchData.innings.first.battingTeam.id === matchData.squad.teamA.teamID) {
    teamAPlayers = matchData.squad.teamA.playingXI;
    teamBPlayers = matchData.squad.teamB.playingXI;
  } else {
    teamAPlayers = matchData.squad.teamB.playingXI;
    teamBPlayers = matchData.squad.teamA.playingXI;
  }

  teamAPlayers.map((player) => {
    var bowlingPoint = 0,
      battingPoint = 0,
      r = 0,
      w = 0,
      s = 0,
      f = 0,
      h = 0,
      c = 0;
    var halfCenturies = 0,
      centuries = 0;
    var threeWickets = 0,
      fiveWickets = 0;

    const playerBatting = matchData.innings.first.battingOrder.find(
      (element) => element.id === player.id,
    );

    if (playerBatting) {
      if (playerBatting.runs >= 50 && playerBatting.runs < 100) {
        halfCenturies = 1;
      } else if (playerBatting.runs >= 100) centuries = 1;

      battingPoint =
        playerBatting.runs +
        playerBatting.sixes * 2 +
        playerBatting.fours +
        halfCenturies * 5 +
        centuries * 10 +
        teamAWinningPoint;
    }

    const playerBowling = matchData.innings.second.bowlingOrder.find(
      (element) => element.id === player.id,
    );

    if (playerBowling) {
      if (playerBowling.wickets >= 3 && playerBowling.wickets < 5) {
        threeWickets = 1;
      } else if (playerBowling.wickets >= 5) fiveWickets = 1;

      bowlingPoint =
        playerBowling.wickets * 25 -
        playerBowling.economy / 10 +
        teamAWinningPoint +
        threeWickets * 5 +
        fiveWickets * 10;
    }

    const performance = battingPoint + bowlingPoint;

    const savePerformance = () => {
      docRef.update({
        performances: firebase.firestore.FieldValue.arrayUnion({
          name: player.name,
          id: player.id,
          photoURL: player.photoURL,
          team: matchData.innings.first.battingTeam.name,
          point: performance,
        }),
      });
    };

    if (matchData.type !== "Friendly" && matchData.type !== "Quick") {
      firestore
        .collection("leagues")
        .doc(matchData.league)
        .collection("players")
        .doc(player.id)
        .get()
        .then((doc) => {
          const playerOldData = collectIdsAndDocs(doc);

          if (playerBatting) {
            const runs = playerOldData.stats.batting.runs + playerBatting.runs;
            const balls = playerOldData.stats.batting.balls + playerBatting.balls;
            const fours = playerOldData.stats.batting.fours + playerBatting.fours;
            const sixes = playerOldData.stats.batting.sixes + playerBatting.sixes;

            r = playerBatting.runs;
            f = playerBatting.fours;
            s = playerBatting.sixes;

            const average =
              (playerOldData.stats.batting.average * playerOldData.stats.batting.innings +
                playerBatting.runs) /
              (playerOldData.stats.batting.innings +
                (playerBatting.status === "out"
                  ? 1
                  : playerOldData.stats.batting.innings !== 0
                  ? 0
                  : 1));
            const strikeRate = runs > 0 ? (runs / balls) * 100 : 0;

            var battingBest = playerOldData.stats.batting.best;
            if (playerBatting.runs > playerOldData.stats.batting.best) {
              battingBest = playerBatting.runs;
            }

            h = halfCenturies;
            c = centuries;

            const points =
              (playerOldData.stats.batting.points * playerOldData.stats.batting.innings +
                (battingPoint + runs / 100 + average / 10 + (strikeRate / 10 - 10)) * 10) /
              (playerOldData.stats.batting.innings + 1);

            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.batting.matches": firebase.firestore.FieldValue.increment(1),
                "stats.batting.innings": firebase.firestore.FieldValue.increment(1),
                "stats.batting.runs": runs,
                "stats.batting.balls": balls,
                "stats.batting.fours": fours,
                "stats.batting.sixes": sixes,
                "stats.batting.average": average,
                "stats.batting.strikeRate": strikeRate,
                "stats.batting.points": points,
                "stats.batting.best": battingBest,
                "stats.batting.halfCenturies":
                  firebase.firestore.FieldValue.increment(halfCenturies),
                "stats.batting.centuries": firebase.firestore.FieldValue.increment(centuries),
              });
          } else {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.batting.matches": firebase.firestore.FieldValue.increment(1),
              });
          }

          if (playerBowling) {
            const runs = playerOldData.stats.bowling.runs + playerBowling.runs;
            const balls =
              playerOldData.stats.bowling.balls + playerBowling.balls + playerBowling.overs * 6;

            const wickets = playerOldData.stats.bowling.wickets + playerBowling.wickets;

            const average = runs / wickets;
            const economy = runs / (balls / 6);

            w = playerBowling.wickets;

            var bowlingBest = playerOldData.stats.bowling.best;
            if (
              playerBowling.wickets > playerOldData.stats.bowling.best.wickets ||
              (playerBowling.wickets === playerOldData.stats.bowling.best.wickets &&
                playerBowling.runs < playerOldData.stats.bowling.best.runs)
            ) {
              bowlingBest = {
                runs: playerBowling.runs,
                wickets: playerBowling.wickets,
              };
            }

            const points =
              (playerOldData.stats.bowling.points * playerOldData.stats.bowling.innings +
                (bowlingPoint + wickets + (20 - economy)) * 10) /
              (playerOldData.stats.bowling.innings + 1);

            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.bowling.matches": firebase.firestore.FieldValue.increment(1),
                "stats.bowling.innings": firebase.firestore.FieldValue.increment(1),
                "stats.bowling.runs": runs,
                "stats.bowling.wickets": wickets,
                "stats.bowling.balls": balls,
                "stats.bowling.average": average,
                "stats.bowling.economy": economy,
                "stats.bowling.points": points,
                "stats.bowling.best": bowlingBest,
                "stats.bowling.threeWickets": firebase.firestore.FieldValue.increment(threeWickets),
                "stats.bowling.fiveWickets": firebase.firestore.FieldValue.increment(fiveWickets),
              });
          } else {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.bowling.matches": firebase.firestore.FieldValue.increment(1),
              });
          }

          if (playerBatting || playerBowling) {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("tournaments")
              .doc(matchData.tournament.key)
              .get()
              .then((doc) => {
                const tournament = collectIdsAndDocs(doc);
                const oldPlayer = tournament.players.find((element) => element.id === player.id);

                if (oldPlayer) {
                  firestore
                    .collection("leagues")
                    .doc(matchData.league)
                    .collection("tournaments")
                    .doc(matchData.tournament.key)
                    .update({
                      players: firebase.firestore.FieldValue.arrayUnion({
                        name: player.name,
                        id: player.id,
                        photoURL: player.photoURL,
                        team: matchData.innings.first.battingTeam.name,
                        runs: oldPlayer.runs + r,
                        wickets: oldPlayer.wickets + w,
                        sixes: oldPlayer.sixes + s,
                        fours: oldPlayer.fours + f,
                        halfCenturies: oldPlayer.halfCenturies + h,
                        centuries: oldPlayer.centuries + c,
                        performance: oldPlayer.performance + performance,
                      }),
                    })
                    .then(() => {
                      firestore
                        .collection("leagues")
                        .doc(matchData.league)
                        .collection("tournaments")
                        .doc(matchData.tournament.key)
                        .update({
                          players: firebase.firestore.FieldValue.arrayRemove(oldPlayer),
                        });
                      savePerformance();
                    });
                } else {
                  firestore
                    .collection("leagues")
                    .doc(matchData.league)
                    .collection("tournaments")
                    .doc(matchData.tournament.key)
                    .update({
                      players: firebase.firestore.FieldValue.arrayUnion({
                        name: player.name,
                        id: player.id,
                        photoURL: player.photoURL,
                        team: matchData.innings.first.battingTeam.name,
                        runs: r,
                        wickets: w,
                        sixes: s,
                        fours: f,
                        halfCenturies: h,
                        centuries: c,
                        performance: performance,
                      }),
                    })
                    .then(() => {
                      savePerformance();
                    });
                }
              });
          } else {
            savePerformance();
          }
        });
    } else {
      savePerformance();
    }
  });

  // TEam B Players

  teamBPlayers.map((player) => {
    var bowlingPoint = 0,
      battingPoint = 0,
      r = 0,
      w = 0,
      s = 0,
      f = 0,
      h = 0,
      c = 0;

    var halfCenturies = 0,
      centuries = 0;
    var threeWickets = 0,
      fiveWickets = 0;

    const playerBatting = matchData.innings.second.battingOrder.find(
      (element) => element.id === player.id,
    );

    if (playerBatting) {
      if (playerBatting.runs >= 50 && playerBatting.runs < 100) {
        halfCenturies = 1;
      } else if (playerBatting.runs >= 100) centuries = 1;

      battingPoint =
        playerBatting.runs +
        playerBatting.sixes * 2 +
        playerBatting.fours +
        halfCenturies * 5 +
        centuries * 10 +
        teamBWinningPoint;
    }

    const playerBowling = matchData.innings.first.bowlingOrder.find(
      (element) => element.id === player.id,
    );

    if (playerBowling) {
      if (playerBowling.wickets >= 3 && playerBowling.wickets < 5) {
        threeWickets = 1;
      } else if (playerBowling.wickets >= 5) fiveWickets = 1;

      bowlingPoint =
        playerBowling.wickets * 25 -
        playerBowling.economy / 10 +
        teamBWinningPoint +
        threeWickets * 5 +
        fiveWickets * 10;
    }

    const performance = battingPoint + bowlingPoint;

    const savePerformance = () => {
      firestore;
      docRef.update({
        performances: firebase.firestore.FieldValue.arrayUnion({
          name: player.name,
          id: player.id,
          photoURL: player.photoURL,
          team: matchData.innings.second.battingTeam.name,
          point: performance,
        }),
      });
    };

    if (matchData.type !== "Friendly" && matchData.type !== "Quick") {
      firestore
        .collection("leagues")
        .doc(matchData.league)
        .collection("players")
        .doc(player.id)
        .get()
        .then((doc) => {
          const playerOldData = collectIdsAndDocs(doc);

          if (playerBatting) {
            const runs = playerOldData.stats.batting.runs + playerBatting.runs;
            const balls = playerOldData.stats.batting.balls + playerBatting.balls;
            const fours = playerOldData.stats.batting.fours + playerBatting.fours;
            const sixes = playerOldData.stats.batting.sixes + playerBatting.sixes;

            r = playerBatting.runs;
            f = playerBatting.fours;
            s = playerBatting.sixes;

            const average =
              (playerOldData.stats.batting.average * playerOldData.stats.batting.innings +
                playerBatting.runs) /
              (playerOldData.stats.batting.innings +
                (playerBatting.status === "out"
                  ? 1
                  : playerOldData.stats.batting.innings !== 0
                  ? 0
                  : 1));
            const strikeRate = runs > 0 ? (runs / balls) * 100 : 0;

            var battingBest = playerOldData.stats.batting.best;
            if (playerBatting.runs > playerOldData.stats.batting.best) {
              battingBest = playerBatting.runs;
            }

            h = halfCenturies;
            c = centuries;

            const points =
              (playerOldData.stats.batting.points * playerOldData.stats.batting.innings +
                (battingPoint + runs / 100 + average / 10 + (strikeRate / 10 - 10)) * 10) /
              (playerOldData.stats.batting.innings + 1);

            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.batting.matches": firebase.firestore.FieldValue.increment(1),
                "stats.batting.innings": firebase.firestore.FieldValue.increment(1),
                "stats.batting.runs": runs,
                "stats.batting.balls": balls,
                "stats.batting.fours": fours,
                "stats.batting.sixes": sixes,
                "stats.batting.average": average,
                "stats.batting.strikeRate": strikeRate,
                "stats.batting.points": points,
                "stats.batting.best": battingBest,
                "stats.batting.halfCenturies":
                  firebase.firestore.FieldValue.increment(halfCenturies),
                "stats.batting.centuries": firebase.firestore.FieldValue.increment(centuries),
              });
          } else {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.batting.matches": firebase.firestore.FieldValue.increment(1),
              });
          }

          if (playerBowling) {
            const runs = playerOldData.stats.bowling.runs + playerBowling.runs;
            const balls =
              playerOldData.stats.bowling.balls + playerBowling.balls + playerBowling.overs * 6;
            const wickets = playerOldData.stats.bowling.wickets + playerBowling.wickets;

            const average = runs / wickets;
            const economy = runs / (balls / 6);

            w = playerBowling.wickets;

            var bowlingBest = playerOldData.stats.bowling.best;
            if (
              playerBowling.wickets > playerOldData.stats.bowling.best.wickets ||
              (playerBowling.wickets === playerOldData.stats.bowling.best.wickets &&
                playerBowling.runs < playerOldData.stats.bowling.best.runs)
            ) {
              bowlingBest = {
                runs: playerBowling.runs,
                wickets: playerBowling.wickets,
              };
            }

            const points =
              (playerOldData.stats.bowling.points * playerOldData.stats.bowling.innings +
                (bowlingPoint + wickets + (20 - economy)) * 10) /
              (playerOldData.stats.bowling.innings + 1);

            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.bowling.matches": firebase.firestore.FieldValue.increment(1),
                "stats.bowling.innings": firebase.firestore.FieldValue.increment(1),
                "stats.bowling.runs": runs,
                "stats.bowling.wickets": wickets,
                "stats.bowling.balls": balls,
                "stats.bowling.average": average,
                "stats.bowling.economy": economy,
                "stats.bowling.points": points,
                "stats.bowling.best": bowlingBest,
                "stats.bowling.threeWickets": firebase.firestore.FieldValue.increment(threeWickets),
                "stats.bowling.fiveWickets": firebase.firestore.FieldValue.increment(fiveWickets),
              });
          } else {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("players")
              .doc(player.id)
              .update({
                "stats.bowling.matches": firebase.firestore.FieldValue.increment(1),
              });
          }

          if (playerBatting || playerBowling) {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("tournaments")
              .doc(matchData.tournament.key)
              .get()
              .then((doc) => {
                const tournament = collectIdsAndDocs(doc);
                const oldPlayer = tournament.players.find((element) => element.id === player.id);

                if (oldPlayer) {
                  firestore
                    .collection("leagues")
                    .doc(matchData.league)
                    .collection("tournaments")
                    .doc(matchData.tournament.key)
                    .update({
                      players: firebase.firestore.FieldValue.arrayUnion({
                        name: player.name,
                        id: player.id,
                        photoURL: player.photoURL,
                        team: matchData.innings.second.battingTeam.name,
                        runs: oldPlayer.runs + r,
                        wickets: oldPlayer.wickets + w,
                        sixes: oldPlayer.sixes + s,
                        fours: oldPlayer.fours + f,
                        halfCenturies: oldPlayer.halfCenturies + h,
                        centuries: oldPlayer.centuries + c,
                        performance: oldPlayer.performance + performance,
                      }),
                    })
                    .then(() => {
                      firestore
                        .collection("leagues")
                        .doc(matchData.league)
                        .collection("tournaments")
                        .doc(matchData.tournament.key)
                        .update({
                          players: firebase.firestore.FieldValue.arrayRemove(oldPlayer),
                        });
                      savePerformance();
                    });
                } else {
                  firestore
                    .collection("leagues")
                    .doc(matchData.league)
                    .collection("tournaments")
                    .doc(matchData.tournament.key)
                    .update({
                      players: firebase.firestore.FieldValue.arrayUnion({
                        name: player.name,
                        id: player.id,
                        photoURL: player.photoURL,
                        team: matchData.innings.second.battingTeam.name,
                        runs: r,
                        wickets: w,
                        sixes: s,
                        fours: f,
                        halfCenturies: h,
                        centuries: c,
                        performance: performance,
                      }),
                    })
                    .then(() => {
                      savePerformance();
                    });
                }
              });
          } else {
            savePerformance();
          }
        });
    } else {
      savePerformance();
    }
  });
};
module.exports = savePlayerData;

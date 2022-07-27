const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");
const firestore = firebase.firestore();

const saveTeamData = (matchData, docRef) => {
  var ovA, ovB, ballA, ballB, teamA, teamB;

  if (matchData.innings.first.wickets === 10) {
    ovA = matchData.overs;
    ballA = 0;
  } else {
    ovA = matchData.innings.first.overs;
    ballA = matchData.innings.first.balls;
  }

  if (matchData.innings.second.wickets === 10) {
    ovB = matchData.overs;
    ballB = 0;
  } else {
    ovB = matchData.innings.second.overs;
    ballB = matchData.innings.second.balls;
  }

  if (matchData.innings.first.runs > matchData.innings.second.runs) {
    teamA = {
      won: 1,
      points: 2,
      lost: 0,
      tied: 0,
    };
    teamB = {
      won: 0,
      points: 0,
      lost: 1,
      tied: 0,
    };
  } else if (matchData.innings.first.runs < matchData.innings.second.runs) {
    teamA = {
      won: 0,
      points: 0,
      lost: 1,
      tied: 0,
    };
    teamB = {
      won: 1,
      points: 2,
      lost: 0,
      tied: 0,
    };
  } else if (matchData.superOver) {
    if (matchData.innings.super_2.runs > matchData.innings.super_1.runs) {
      teamA = {
        won: 1,
        points: 2,
        lost: 0,
        tied: 0,
      };
      teamB = {
        won: 0,
        points: 0,
        lost: 1,
        tied: 0,
      };
    } else if (
      matchData.innings.super_2.runs < matchData.innings.super_1.runs
    ) {
      teamA = {
        won: 0,
        points: 0,
        lost: 1,
        tied: 0,
      };
      teamB = {
        won: 1,
        points: 2,
        lost: 0,
        tied: 0,
      };
    }
  } else if (matchData.innings.first.runs === matchData.innings.second.runs) {
    teamA = {
      won: 0,
      points: 1,
      tied: 1,
      lost: 0,
    };
    teamB = {
      won: 0,
      points: 1,
      tied: 1,
      lost: 0,
    };
  }

  if (matchData.type === "Group") {
    firestore
      .collection("leagues")
      .doc(matchData.league)
      .collection("tournaments")
      .doc(matchData.tournament.key)
      .get()
      .then((doc) => {
        const tournament = collectIdsAndDocs(doc);
        const oldPointA = tournament.pointTable.find(
          (element) => element.id === matchData.innings.first.battingTeam.id
        );
        const oldPointB = tournament.pointTable.find(
          (element) => element.id === matchData.innings.second.battingTeam.id
        );

        const netRunRateA = {
          against: {
            runs:
              matchData.innings.second.runs + oldPointA.netRunRate.against.runs,
            overs: ovB + oldPointA.netRunRate.against.overs,
            balls: ballB + oldPointA.netRunRate.against.balls,
          },
          for: {
            runs: matchData.innings.first.runs + oldPointA.netRunRate.for.runs,
            overs: ovA + oldPointA.netRunRate.for.overs,
            balls: ballA + oldPointA.netRunRate.for.balls,
          },
        };
        const nrrA =
          netRunRateA.for.runs /
            (netRunRateA.for.overs + netRunRateA.for.balls / 6) -
          netRunRateA.against.runs /
            (netRunRateA.against.overs + netRunRateA.against.balls / 6);

        const netRunRateB = {
          against: {
            runs:
              matchData.innings.first.runs + oldPointB.netRunRate.against.runs,
            overs: ovA + oldPointB.netRunRate.against.overs,
            balls: ballA + oldPointB.netRunRate.against.balls,
          },
          for: {
            runs: matchData.innings.second.runs + oldPointB.netRunRate.for.runs,
            overs: ovB + oldPointB.netRunRate.for.overs,
            balls: ballB + oldPointB.netRunRate.for.balls,
          },
        };
        const nrrB =
          netRunRateB.for.runs /
            (netRunRateB.for.overs + netRunRateB.for.balls / 6) -
          netRunRateB.against.runs /
            (netRunRateB.against.overs + netRunRateB.against.balls / 6);

        const pointA = {
          id: matchData.innings.first.battingTeam.id,
          name: matchData.innings.first.battingTeam.name,
          played: oldPointA.played + 1,
          won: oldPointA.won + teamA.won,
          lost: oldPointA.lost + teamA.lost,
          tied: oldPointA.tied + teamA.tied,
          points: oldPointA.points + teamA.points,
          netRunRate: {
            against: netRunRateA.against,
            for: netRunRateA.for,
            nRR: nrrA,
          },
        };

        const pointB = {
          id: matchData.innings.second.battingTeam.id,
          name: matchData.innings.second.battingTeam.name,
          played: oldPointB.played + 1,
          won: oldPointB.won + teamB.won,
          lost: oldPointB.lost + teamB.lost,
          tied: oldPointB.tied + teamB.tied,
          points: oldPointB.points + teamB.points,
          netRunRate: {
            against: netRunRateB.against,
            for: netRunRateB.for,
            nRR: nrrB,
          },
        };

        firestore
          .collection("leagues")
          .doc(matchData.league)
          .collection("tournaments")
          .doc(matchData.tournament.key)
          .update({
            pointTable: firebase.firestore.FieldValue.arrayUnion(
              pointA,
              pointB
            ),
          })
          .then(() => {
            firestore
              .collection("leagues")
              .doc(matchData.league)
              .collection("tournaments")
              .doc(matchData.tournament.key)
              .update({
                pointTable: firebase.firestore.FieldValue.arrayRemove(
                  oldPointA,
                  oldPointB
                ),
              });
          });
      });
  }

  firestore
    .collection("leagues")
    .doc(matchData.league)
    .collection("teams")
    .doc(matchData.innings.first.battingTeam.id)
    .get()
    .then((doc) => {
      const oldTeamA = collectIdsAndDocs(doc);
      const netRunRateA = {
        against: {
          runs:
            matchData.innings.second.runs + oldTeamA.netRunRate.against.runs,
          overs: ovB + oldTeamA.netRunRate.against.overs,
          balls: ballB + oldTeamA.netRunRate.against.balls,
        },
        for: {
          runs: matchData.innings.first.runs + oldTeamA.netRunRate.for.runs,
          overs: ovA + oldTeamA.netRunRate.for.overs,
          balls: ballA + oldTeamA.netRunRate.for.balls,
        },
      };
      const nrrA =
        netRunRateA.for.runs /
          (netRunRateA.for.overs + netRunRateA.for.balls / 6) -
        netRunRateA.against.runs /
          (netRunRateA.against.overs + netRunRateA.against.balls / 6);
      const teamAMatches = {
        played: oldTeamA.matches.played + 1,
        won: oldTeamA.matches.won + teamA.won,
        lost: oldTeamA.matches.lost + teamA.lost,
        tied: oldTeamA.matches.tied + teamA.tied,
        points: oldTeamA.matches.points + teamA.points,
      };

      firestore
        .collection("leagues")
        .doc(matchData.league)
        .collection("teams")
        .doc(matchData.innings.first.battingTeam.id)
        .update({
          matches: teamAMatches,
          netRunRate: {
            against: netRunRateA.against,
            for: netRunRateA.for,
            nRR: nrrA,
          },
          points:
            teamAMatches.points +
            (teamAMatches.won / teamAMatches.played) * 1000 +
            nrrA * 10,
        });
    });

  firestore
    .collection("leagues")
    .doc(matchData.league)
    .collection("teams")
    .doc(matchData.innings.second.battingTeam.id)
    .get()
    .then((doc) => {
      const oldTeamB = collectIdsAndDocs(doc);
      const netRunRateB = {
        against: {
          runs: matchData.innings.first.runs + oldTeamB.netRunRate.against.runs,
          overs: ovA + oldTeamB.netRunRate.against.overs,
          balls: ballA + oldTeamB.netRunRate.against.balls,
        },
        for: {
          runs: matchData.innings.second.runs + oldTeamB.netRunRate.for.runs,
          overs: ovB + oldTeamB.netRunRate.for.overs,
          balls: ballB + oldTeamB.netRunRate.for.balls,
        },
      };

      const nrrB =
        netRunRateB.for.runs /
          (netRunRateB.for.overs + netRunRateB.for.balls / 6) -
        netRunRateB.against.runs /
          (netRunRateB.against.overs + netRunRateB.against.balls / 6);

      const teamBMatches = {
        played: oldTeamB.matches.played + 1,
        won: oldTeamB.matches.won + teamB.won,
        lost: oldTeamB.matches.lost + teamB.lost,
        tied: oldTeamB.matches.tied + teamB.tied,
        points: oldTeamB.matches.points + teamB.points,
      };

      firestore
        .collection("leagues")
        .doc(matchData.league)
        .collection("teams")
        .doc(matchData.innings.second.battingTeam.id)
        .update({
          matches: teamBMatches,
          netRunRate: {
            against: netRunRateB.against,
            for: netRunRateB.for,
            nRR: nrrB,
          },
          points:
            teamBMatches.points +
            (teamBMatches.won / teamBMatches.played) * 1000 +
            nrrB * 10,
        });
    });
};
module.exports = saveTeamData;

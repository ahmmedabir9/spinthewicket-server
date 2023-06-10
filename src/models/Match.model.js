const { Schema, model, SchemaTypes } = require("mongoose");

const MatchSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: String,
    innings: {
      first: {
        ballByBall: [
          {
            ballNo: Number,
            overNo: Number,
            run: Number,
            status: String,
            totalRuns: Number,
            wickets: Number,
            batsman: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            bowler: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
          },
        ],
        balls: Number,
        battingOrder: [
          {
            balls: Number,
            fours: Number,
            runs: Number,
            sixes: Number,
            inAt: Number,
            dotBalls: Number,
            batsman: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            out: {
              bowler: {
                ref: "league_player",
                type: SchemaTypes.ObjectId,
              },
              fielder: {
                ref: "league_player",
                type: SchemaTypes.ObjectId,
              },
              wicketType: String,
              status: String,
              strikeRate: Number,
            },
          },
        ],
        battingTeam: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        bowlingOrder: [
          {
            balls: Number,
            economy: Number,
            maidens: Number,
            dotBalls: Number,
            overs: Number,
            dotBalls: Number,
            runs: Number,
            wickets: Number,
            bowler: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
          },
        ],
        bowlingTeam: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        extra: Number,
        fallOfWickets: [
          {
            balls: Number,
            overs: Number,
            player: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            runs: Number,
          },
        ],
        overs: Number,
        partnerships: [
          {
            balls: Number,
            bastman1: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            batsman2: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            runs: Number,
          },
        ],
        runRate: Number,
        runs: Number,
        wickets: Number,
        //innings end
      },
      second: {
        ballByBall: [
          {
            ballNo: Number,
            overNo: Number,
            run: Number,
            status: String,
            totalRuns: Number,
            wickets: Number,
            batsman: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            bowler: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
          },
        ],
        balls: Number,
        battingOrder: [
          {
            balls: Number,
            fours: Number,
            runs: Number,
            sixes: Number,
            inAt: Number,
            dotBalls: Number,
            batsman: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            out: {
              bowler: {
                ref: "league_player",
                type: SchemaTypes.ObjectId,
              },
              fielder: {
                ref: "league_player",
                type: SchemaTypes.ObjectId,
              },
              wicketType: String,
              status: String,
              strikeRate: Number,
            },
          },
        ],
        battingTeam: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        bowlingOrder: [
          {
            balls: Number,
            economy: Number,
            maidens: Number,
            dotBalls: Number,
            overs: Number,
            dotBalls: Number,
            runs: Number,
            wickets: Number,
            bowler: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
          },
        ],
        bowlingTeam: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        extra: Number,
        fallOfWickets: [
          {
            balls: Number,
            overs: Number,
            player: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            runs: Number,
          },
        ],
        overs: Number,
        partnerships: [
          {
            balls: Number,
            bastman1: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            batsman2: {
              ref: "league_player",
              type: SchemaTypes.ObjectId,
            },
            runs: Number,
          },
        ],
        runRate: Number,
        runs: Number,
        wickets: Number,
        //innings end
      },
    },
    overs: Number,
    performances: [
      {
        player: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
        },
        points: {
          type: Number,
          default: 0,
        },
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
      },
    ],
    result: {
      winner: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
      },
      wonBy: String, //runs, wickets, superover
      runs: Number,
      wickets: Number,
    },
    teams: {
      teamA: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
      },
      teamB: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
      },
    },
    squad: {
      teamA: {
        playingXI: [
          {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
          },
        ],
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
      },
      teamB: {
        playingXI: [
          {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
          },
        ],
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
      },
    },
    status: String, //scheduled, live, completed,
    toss: {
      team: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
      },
      selectedTo: String,
    },
    matchType: String, //group, friendly, semifinal, quarterfiner, qualifier, eliminator, quick
    tournament: {
      ref: "league_tournament",
      type: SchemaTypes.ObjectId,
    },
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const Match = model("match", MatchSchema);

module.exports = { Match };

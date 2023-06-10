import { Schema, SchemaTypes, model } from "mongoose";

import { _IInning_, _IMatch_ } from "./_ModelTypes_";

const InningSchema = new Schema<_IInning_>(
  {
    ballByBall: [
      {
        ballNo: {
          type: Number,
          required: true,
        },
        overNo: {
          type: Number,
          required: true,
        },
        run: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        totalRuns: {
          type: Number,
          required: true,
        },
        wickets: {
          type: Number,
          required: true,
        },
        batsman: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        bowler: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    balls: {
      type: Number,
      required: true,
    },
    battingOrder: [
      {
        balls: {
          type: Number,
          required: true,
        },
        fours: {
          type: Number,
          required: true,
        },
        runs: {
          type: Number,
          required: true,
        },
        sixes: {
          type: Number,
          required: true,
        },
        inAt: {
          type: Number,
          required: true,
        },
        dotBalls: {
          type: Number,
          required: true,
        },
        batsman: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        out: {
          bowler: {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
            required: true,
          },
          fielder: {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
          },
          wicketType: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            required: true,
          },
          strikeRate: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    battingTeam: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
      required: true,
    },
    bowlingOrder: [
      {
        balls: {
          type: Number,
          required: true,
        },
        economy: {
          type: Number,
          required: true,
        },
        maidens: {
          type: Number,
          required: true,
        },
        dotBalls: {
          type: Number,
          required: true,
        },
        overs: {
          type: Number,
          required: true,
        },
        runs: {
          type: Number,
          required: true,
        },
        wickets: {
          type: Number,
          required: true,
        },
        bowler: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    bowlingTeam: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
      required: true,
    },
    extra: {
      type: Number,
      required: true,
    },
    fallOfWickets: [
      {
        balls: {
          type: Number,
          required: true,
        },
        overs: {
          type: Number,
          required: true,
        },
        player: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        runs: {
          type: Number,
          required: true,
        },
      },
    ],
    overs: {
      type: Number,
      required: true,
    },
    partnerships: [
      {
        balls: {
          type: Number,
          required: true,
        },
        bastman1: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        batsman2: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        runs: {
          type: Number,
          required: true,
        },
      },
    ],
    runRate: {
      type: Number,
      required: true,
    },
    runs: {
      type: Number,
      required: true,
    },
    wickets: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const LeagueMatchSchema = new Schema<_IMatch_>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: String,
    innings: {
      first: InningSchema,
      second: InningSchema,
      firstSuper: InningSchema,
      secondSuper: InningSchema,
    },
    overs: {
      type: Number,
      required: true,
    },
    performances: [
      {
        player: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
          required: true,
        },
        points: {
          type: Number,
          default: 0,
        },
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    result: {
      winner: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
      },
      wonBy: String,
      runs: Number,
      wickets: Number,
    },
    teams: {
      teamA: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
        required: true,
      },
      teamB: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
        required: true,
      },
    },
    squad: {
      teamA: {
        playingXI: [
          {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
            required: true,
          },
        ],
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
      teamB: {
        playingXI: [
          {
            ref: "league_player",
            type: SchemaTypes.ObjectId,
            required: true,
          },
        ],
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    },
    status: {
      type: String,
      required: true,
    },
    toss: {
      team: {
        ref: "league_team",
        type: SchemaTypes.ObjectId,
        required: true,
      },
      selectedTo: {
        type: String,
        required: true,
      },
    },
    matchType: {
      type: String,
      required: true,
    },
    tournament: {
      ref: "league_tournament",
      type: SchemaTypes.ObjectId,
      required: true,
    },
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const LeagueMatch = model<_IMatch_>("league_match", LeagueMatchSchema);

export { LeagueMatch };

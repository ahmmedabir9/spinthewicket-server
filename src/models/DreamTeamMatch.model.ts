import { Schema, SchemaTypes, model } from 'mongoose';

import { _IInning_, _IMatch_ } from './_ModelTypes_';

const InningSchema = new Schema<_IInning_>(
  {
    overHistory: [
      [
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
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
            required: true,
          },
          bowler: {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
            required: true,
          },
        },
      ],
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
        strikeRate: {
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
        id: {
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
          required: true,
        },
        out: {
          bowler: {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
            required: true,
          },
          fielder: {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
          },
          wicketType: {
            type: String,
            required: true,
          },
        },
        status: {
          type: String,
          required: true,
        },
      },
    ],
    battingTeam: {
      ref: 'dream_team',
      type: SchemaTypes.ObjectId,
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
        id: {
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    bowlingTeam: {
      ref: 'dream_team',
      type: SchemaTypes.ObjectId,
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
          ref: 'dream_player',
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
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
          required: true,
        },
        batsman2: {
          ref: 'dream_player',
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

const DreamTeamMatchSchema = new Schema<_IMatch_>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: String,
    users: [
      {
        ref: 'user',
        type: SchemaTypes.ObjectId,
      },
    ],
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
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
          required: true,
        },
        points: {
          type: Number,
          default: 0,
        },
        team: {
          ref: 'dream_team',
          type: SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    result: {
      winner: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
      },
      wonBy: String,
      runs: Number,
      wickets: Number,
    },
    teams: {
      teamA: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
        required: true,
      },
      teamB: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
        required: true,
      },
    },
    squad: {
      teamA: {
        playingXI: [
          {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
          },
        ],
        team: {
          ref: 'dream_team',
          type: SchemaTypes.ObjectId,
        },
      },
      teamB: {
        playingXI: [
          {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
          },
        ],
        team: {
          ref: 'dream_team',
          type: SchemaTypes.ObjectId,
        },
      },
    },
    status: {
      type: String,
      required: true,
    },
    toss: {
      team: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
      },
      selectedTo: {
        type: String,
      },
    },
    matchType: {
      type: String,
      required: true,
    },
    liveData: {
      inning: String,
      battingTeam: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
      },
      bowlingTeam: {
        ref: 'dream_team',
        type: SchemaTypes.ObjectId,
      },
      battingScorer: {
        ref: 'user',
        type: SchemaTypes.ObjectId,
      },
      bowlingScorer: {
        ref: 'user',
        type: SchemaTypes.ObjectId,
      },
      batsman: {
        striker: {
          id: {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
          },
          balls: Number,
          fours: Number,
          runs: Number,
          sixes: Number,
          strikeRate: Number,
          dotBalls: Number,
        },
        nonStriker: {
          id: {
            ref: 'dream_player',
            type: SchemaTypes.ObjectId,
          },
          balls: Number,
          fours: Number,
          average: Number,
          strikeRate: Number,
          runs: Number,
          sixes: Number,
          dotBalls: Number,
        },
      },
      bowler: {
        id: {
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
        },
        balls: Number,
        economy: Number,
        maidens: Number,
        dotBalls: Number,
        overs: Number,
        runs: Number,
        wickets: Number,
      },
      overs: Number,
      balls: Number,
      runs: Number,
      wickets: Number,
      runRate: Number,
      extra: Number,
      partnership: {
        balls: Number,
        runs: Number,
        batsman1: {
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
        },
        batsman2: {
          ref: 'dream_player',
          type: SchemaTypes.ObjectId,
        },
      },
      freeHit: Boolean,
      thisOver: Array,
      spinning: Boolean,
      lastSpinPosition: Number,
      need: Number,
      target: Number,
      from: Number,
    },
  },
  { timestamps: true },
);

const DreamTeamMatch = model<_IMatch_>('dream_team_match', DreamTeamMatchSchema);

export { DreamTeamMatch };

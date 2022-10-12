const { StatusCodes } = require('http-status-codes')
const { DreamTeam } = require('../models/DreamTeam.model')
const { response } = require('../utils/response')
const {
  CreateQuickMatch,
  GetQuickMatch,
  UpdateQuickMatch,
} = require('../services/firebase')
const { v4: uuidv4 } = require('uuid')
const { ballResult } = require('../functions/playMatch/ballResult')
const { ballValidation } = require('../functions/playMatch/ballValidation')
const prepareBallData = require('../functions/playMatch/prepareBallData')
const { DreamPlayer } = require('../models/DreamPlayer.model')
const { User } = require('../models/User.model')
const {
  twoRuns,
  threeRuns,
  fourRuns,
  sixRuns,
  noBall,
  wideBall,
  oneRun,
  dotBall,
  catchOut,
  lbw,
  runOut,
  bowled,
} = require('../functions/playMatch')

// const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");

const teamPopulate = [
  { path: 'theme' },
  { path: 'manager' },
  {
    path: 'captain',
    populate: {
      path: 'playerInfo',
    },
  },
  {
    path: 'playingXI',
    populate: {
      path: 'playerInfo',
    },
  },
]

const playerPopulate = [
  {
    path: 'playerInfo',
  },
]

const startQuickMatch = async (req, res) => {
  try {
    const { team, overs, user } = req.body

    if (!team || !overs || !user) {
      let msg = 'provide all informations!'
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg)
    }

    //verify and get team
    const dreamTeam = await DreamTeam.findById(team).populate(teamPopulate)

    if (!dreamTeam) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        'Dream Team Not Found',
      )
    }

    if (dreamTeam?.manager?._id?.toString() !== user?.toString()) {
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        null,
        'You dont have permission to play with this team!',
      )
    }

    //find opponent
    const botTeams = await DreamTeam.find({
      rating: { $gte: dreamTeam.rating - 5 },
      rating: { $lte: dreamTeam.rating + 5 },
      isBot: true,
    })

    if (!botTeams || !botTeams?.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        'No Opponent Found',
      )
    }

    const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)]

    //prepare match data

    var battingTeam = null,
      bowlingTeam = null,
      battingScorer = null,
      bowlingScorer = null,
      now = null
    const tossResult = Math.floor(Math.random() * 10000) % 2
    var toss

    if (tossResult === 0) {
      toss = {
        team: dreamTeam?._id?.toString(),
      }
    } else {
      const choosen = Math.floor(Math.random() * 10000) % 2
      toss = {
        team: opponentTeam?._id?.toString(),
        selected: choosen === 0 ? 'bat' : 'bowl',
      }
      battingTeam =
        choosen === 0
          ? opponentTeam?._id?.toString()
          : dreamTeam?._id?.toString()
      bowlingTeam =
        choosen === 1
          ? opponentTeam?._id?.toString()
          : dreamTeam?._id?.toString()
      battingScorer = choosen === 0 ? null : user
      bowlingScorer = choosen === 1 ? null : user
      now = {
        inning: 1,
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        batsman: {},
        bowler: null,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
        partnership: {
          balls: 0,
          runs: 0,
          batsman1: null,
          batsman2: null,
        },
        freeHit: false,
        history: [],
        spinning: false,
        lastSpinPosition: 0,
      }
    }

    const innings = {
      first: {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        battingOrder: [],
        bowlingOrder: [],
        partnerships: [],
        fallOfWickets: [],
        overHistory: [],
        ballByBall: [],
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
      },
      second: {
        battingTeam: bowlingTeam,
        bowlingTeam: battingTeam,
        battingScorer: bowlingScorer,
        bowlingScorer: battingScorer,
        battingOrder: [],
        bowlingOrder: [],
        partnerships: [],
        fallOfWickets: [],
        ballByBall: [],
        overHistory: [],
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
      },
    }

    const createdAt = new Date()

    const matchData = {
      type: 'quick',
      teams: {
        a: dreamTeam?._id?.toString(),
        b: opponentTeam?._id?.toString(),
      },
      scorers: { a: user, b: null },
      overs: parseInt(overs),
      status: toss.team === dreamTeam?._id?.toString() ? 'toss' : 'live',
      createdAt: createdAt.toString(),
      playingXI: {
        [dreamTeam?._id?.toString()]: dreamTeam?.playingXI?.map((player) =>
          player?._id?.toString(),
        ),
        [opponentTeam?._id?.toString()]: opponentTeam?.playingXI?.map(
          (player) => player?._id?.toString(),
        ),
      },
      ready: {
        [user?.toString()]: false,
      },
      users: [user],
      toss: toss,
      now,
      innings,
    }

    //save match data
    const quickMatch = await CreateQuickMatch(matchData)

    return response(res, StatusCodes.ACCEPTED, true, quickMatch, null)
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message,
    )
  }
}

const getMatchData = async (req, res) => {
  try {
    const id = req.params.id

    const matchData = await GetQuickMatch(id)

    // fetch teams
    const teamA = await DreamTeam.findById(matchData?.teams?.a).populate(
      teamPopulate,
    )
    const teamB = await DreamTeam.findById(matchData?.teams?.b).populate(
      teamPopulate,
    )

    // fetch players
    const players = await DreamPlayer.find()
      .where({
        $or: [
          {
            _id: { $in: matchData.playingXI[matchData?.teams?.a] },
          },
          {
            _id: { $in: matchData.playingXI[matchData?.teams?.b] },
          },
        ],
      })
      .populate(playerPopulate)

    // fetch users
    const users = await User.find().where({
      _id: { $in: matchData.users },
    })

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { teams: [teamA, teamB], players, users },
      null,
    )
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message,
    )
  }
}

const playQuickMatch = async (req, res) => {
  try {
    const { match, bat, bowl } = req.body

    if (!match || !bat || !bowl) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        'match, bat, bowl are required field!',
      )
    }

    const matchData = await GetQuickMatch(match)

    if (!matchData) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        'No Match Found!',
      )
    }

    var inning
    if (matchData.now.inning === 1) {
      inning = 'first'
    } else if (matchData.now.inning === 2) {
      inning = 'second'
    } else if (matchData.now.inning === 3) {
      inning = 'super_1'
    } else if (matchData.now.inning === 4) {
      inning = 'super_2'
    }

    const ballAction = 'ONE'
    // const ballAction = ballResult(bat, bowl)

    var pointed
    if (ballAction === 'ONE') pointed = 154
    else if (ballAction === 'BOWLED') pointed = 244
    else if (ballAction === 'SIX') pointed = 34
    else if (ballAction === 'WIDE') pointed = 4
    else if (ballAction === 'RUN_OUT') pointed = 334
    else if (ballAction === 'TWO') pointed = 94
    else if (ballAction === 'THREE') pointed = 274
    else if (ballAction === 'LBW') pointed = 124
    else if (ballAction === 'NO_BALL') pointed = 64
    else if (ballAction === 'FOUR') pointed = 304
    else if (ballAction === 'CATCH') pointed = 184
    else if (ballAction === 'DOT') pointed = 214

    const lastSpinPosition = 0 - (pointed + Math.floor(Math.random() * 22))

    const ballData = prepareBallData(matchData, ballAction)

    console.log('====================================')
    console.log({ ballData })
    console.log('====================================')

    if (ballValidation(matchData)) {
      const handler = async () => {
        let ballResponse
        if (ballAction === 'DOT')
          ballResponse = await dotBall(matchData, ballData, inning)
        else if (ballAction === 'ONE')
          ballResponse = await oneRun(matchData, ballData, inning)
        else if (ballAction === 'TWO')
          ballResponse = await twoRuns(matchData, ballData, inning)
        else if (ballAction === 'THREE')
          ballResponse = await threeRuns(matchData, ballData, inning)
        else if (ballAction === 'FOUR')
          ballResponse = await fourRuns(matchData, ballData, inning)
        else if (ballAction === 'SIX')
          ballResponse = await sixRuns(matchData, ballData, inning)
        else if (ballAction === 'WIDE')
          ballResponse = await wideBall(matchData, ballData, inning)
        else if (ballAction === 'NO_BALL')
          ballResponse = await noBall(matchData, ballData, inning)
        else if (ballAction === 'BOWLED') {
          if (matchData?.now?.freeHit) {
            ballResponse = await dotBall(matchData, ballData, inning)
          } else {
            ballResponse = await bowled(matchData, ballData, inning)
          }
        } else if (ballAction === 'LBW') {
          if (matchData?.now?.freeHit) {
            ballResponse = await dotBall(matchData, ballData, inning)
          } else {
            ballResponse = await lbw(matchData, ballData, inning)
          }
        } else if (ballAction === 'CATCH') {
          if (matchData?.now?.freeHit) {
            ballResponse = await dotBall(matchData, ballData, inning)
          } else {
            ballResponse = await catchOut(matchData, ballData, inning)
          }
        } else if (ballAction === 'RUN_OUT')
          ballResponse = await runOut(matchData, ballData, inning)

        if (!ballResponse?.success) {
          return response(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            ballResponse,
            'Something went wrong!',
          )
        }

        const updateData = {
          'now.lastSpinPosition': lastSpinPosition,
          'now.spinning': false,
        }

        await UpdateQuickMatch(match, updateData)
        return response(res, StatusCodes.ACCEPTED, true, ballResponse, null)
      }

      // setTimeout(() => {
      handler()
      // }, 3000)
    } else {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        'SOMETHING WENT WRONG',
      )
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message,
    )
  }
}

module.exports = { startQuickMatch, getMatchData, playQuickMatch }

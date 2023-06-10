const { StatusCodes } = require("http-status-codes");
const { Country } = require("../models/Country.model");
const { PlayerInfo } = require("../models/PlayerInfo.model");
const { response } = require("../utils/response");

const getAllPlayers = async (req, res) => {
  const { role, levelRange, skip, limit, sortBy } = req.body;

  try {
    let filter = {};

    if (role) filter.role === role;

    const playersCount = await PlayerInfo.countDocuments(filter)
      .where(
        levelRange
          ? {
              $or: [
                {
                  bowlingLevel: { $gte: levelRange.min },
                  bowlingLevel: { $lte: levelRange.max },
                },
                {
                  battingLevel: { $gte: levelRange.min },
                  battingLevel: { $lte: levelRange.max },
                },
              ],
            }
          : null,
      )
      .where(
        searchKey
          ? {
              $or: [
                {
                  name: { $regex: searchKey, $options: "i" },
                },
                {
                  slug: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null,
      );

    const players = await PlayerInfo.find(filter)
      .where(
        levelRange
          ? {
              $or: [
                {
                  bowlingLevel: { $gte: levelRange.min },
                  bowlingLevel: { $lte: levelRange.max },
                },
                {
                  battingLevel: { $gte: levelRange.min },
                  battingLevel: { $lte: levelRange.max },
                },
              ],
            }
          : null,
      )
      .where(
        searchKey
          ? {
              $or: [
                {
                  name: { $regex: searchKey, $options: "i" },
                },
                {
                  slug: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null,
      )
      .skip(skip)
      .limit(limit)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { name: 1 });

    if (!players || players.length === 0) {
      let msg = "no players found!";
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { players, playersCount }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getRandomCaptains = async (req, res) => {
  try {
    const populateFields = [
      {
        path: "nationality",
      },
      {
        path: "teams",
      },
    ];

    let allrounders = await PlayerInfo.find({ role: "All-Rounder" })
      .where({
        bowlingLevel: { $gte: 65 },
      })
      .where({
        bowlingLevel: { $lte: 75 },
      })
      .where({
        battingLevel: { $gte: 65 },
      })
      .where({
        battingLevel: { $lte: 75 },
      })
      .populate(populateFields);

    let batsmen = await PlayerInfo.find({ role: "Batsman" })
      .where({
        battingLevel: { $gte: 75 },
      })
      .where({
        battingLevel: { $lte: 80 },
      })
      .populate(populateFields);

    let keepers = await PlayerInfo.find({ role: "Wicket-Keeper" })
      .where({
        battingLevel: { $gte: 75 },
      })
      .where({
        battingLevel: { $lte: 80 },
      })
      .populate(populateFields);

    let bowlers = await PlayerInfo.find({ role: "Bowler" })
      .where({
        bowlingLevel: { $gte: 75 },
      })
      .where({
        bowlingLevel: { $lte: 80 },
      })
      .populate(populateFields);

    shufflePlayers(allrounders);
    shufflePlayers(batsmen);
    shufflePlayers(bowlers);
    shufflePlayers(keepers);

    const captains = [
      ...batsmen.slice(0, 2),
      ...allrounders.slice(0, 2),
      ...bowlers.slice(0, 1),
      ...keepers.slice(0, 1),
    ];

    return response(res, StatusCodes.OK, true, captains, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const shufflePlayers = (players) => {
  let currentIndex = players.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]];
  }

  return players;
};

module.exports = { getRandomCaptains, shufflePlayers };

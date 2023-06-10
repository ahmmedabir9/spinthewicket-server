const dotBall = require("./runs/dotBall");
const oneRun = require("./runs/oneRun");
const wideBall = require("./runs/wideBall");
const noBall = require("./runs/noBall");
const sixRuns = require("./runs/sixRuns");
const fourRuns = require("./runs/fourRuns");
const threeRuns = require("./runs/threeRuns");
const twoRuns = require("./runs/twoRuns");
const bowled = require("./wickets/bowled");
const runOut = require("./wickets/runOut");
const lbw = require("./wickets/lbw");
const catchOut = require("./wickets/catchOut");

module.exports = {
  catchOut,
  lbw,
  runOut,
  bowled,
  twoRuns,
  threeRuns,
  fourRuns,
  sixRuns,
  noBall,
  wideBall,
  oneRun,
  dotBall,
};

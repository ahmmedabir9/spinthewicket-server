import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { ballResult } from '../functions/playMatch/ballResult';
import { ballValidation } from '../functions/playMatch/ballValidation';
import { getLastSpinPosition } from '../functions/playMatch/getLastSpinPosition';
import { getMatchFunction } from '../functions/playMatch/getMatchFunction';
import { prepareBallData } from '../functions/playMatch/prepareBallData';
import { DreamTeam } from '../models/DreamTeam.model';
import { DreamTeamMatch } from '../models/DreamTeamMatch.model';
import { PlayerInfo } from '../models/PlayerInfo.model';
import { _IMatch_ } from '../models/_ModelTypes_';
import { initialInningData, initialLiveData, initialMatchBatsmanData, initialMatchBowlerData } from '../utils/constants';
import { response } from '../utils/response';
import { socketResponse } from '../utils/socketResponse';

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
];

const playerPopulate = [
  {
    path: 'playerInfo',
  },
];

const matchPopulate = [
  { path: 'teams.teamA', populate: teamPopulate },
  { path: 'teams.teamB', populate: teamPopulate },
  { path: 'squad.teamA.playingXI', populate: playerPopulate },
  { path: 'squad.teamB.playingXI', populate: playerPopulate },
  {
    path: 'users',
  },
];

const addPlayers = async () => {
  const players = [
    {
      name: 'Jos Buttler',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/316600/316642.png',
      battingLevel: 92,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 608,
      'T20 BAT': 609,
      'TEST BAT': 500,
    },
    {
      name: 'Rohit Sharma',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/316500/316584.png',
      battingLevel: 92,
      bowlingLevel: 22,
      role: 'Batsman',
      'ODI BAT': 791,
      'T20 BAT': 633,
      'TEST BAT': 754,
    },
    {
      name: 'Babar Azam',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/320400/320448.png',
      battingLevel: 91,
      bowlingLevel: 26,
      role: 'Batsman',
      'ODI BAT': 891,
      'T20 BAT': 818,
      'TEST BAT': 815,
    },
    {
      name: 'David Warner',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316500/316589.png',
      battingLevel: 90,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 750,
      'T20 BAT': 454,
      'TEST BAT': 691,
    },
    {
      name: 'Ben Stokes',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/319700/319748.png',
      battingLevel: 90,
      bowlingLevel: 82,
      role: 'All-Rounder',
      'ODI BAT': 651,
      'ODI BOWL': 410,
      'TEST BAT': 599,
      'TEST BOWL': 499,
    },
    {
      name: 'Virat Kohli',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/316600/316605.png',
      battingLevel: 90,
      bowlingLevel: 40,
      role: 'Batsman',
      'ODI BAT': 811,
      'T20 BAT': 612,
      'TEST BAT': 742,
    },
    {
      name: 'Lokesh Rahul',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319942.png',
      battingLevel: 90,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 640,
      'T20 BAT': 646,
      'TEST BAT': 566,
    },
    {
      name: 'Glenn Maxwell',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316657.png',
      battingLevel: 89,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'ODI BAT': 664,
      'T20 BAT': 553,
    },
    {
      name: 'Nicholas Pooran',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/320100/320109.png',
      battingLevel: 89,
      bowlingLevel: 50,
      role: 'Wicket-Keeper',
      'ODI BAT': 580,
      'T20 BAT': 632,
    },
    {
      name: 'Joe Root',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316600/316639.png',
      battingLevel: 88,
      bowlingLevel: 20,
      role: 'Batsman',
      'ODI BAT': 740,
      'TEST BAT': 843,
      'TEST BOWL': 224,
    },
    {
      name: 'Hardik Pandya',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319900/319938.png',
      battingLevel: 88,
      bowlingLevel: 82,
      role: 'All-Rounder',
      'ODI BAT': 532,
      'ODI BOWL': 382,
    },
    {
      name: 'Kane Williamson',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316618.png',
      battingLevel: 88,
      bowlingLevel: 32,
      role: 'Batsman',
      'T20 BAT': 483,
      'TEST BAT': 844,
    },
    {
      name: 'Fakhar Zaman',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/320400/320449.png',
      battingLevel: 88,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 730,
      'T20 BAT': 490,
    },
    {
      name: 'Mohammad Rizwan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320400/320458.png',
      battingLevel: 88,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 413,
      'T20 BAT': 794,
      'TEST BAT': 655,
    },
    {
      name: 'David Miller',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci/db/PICTURES/CMS/316600/316655.png',
      battingLevel: 88,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 630,
      'T20 BAT': 498,
    },
    {
      name: 'Marcus Stoinis',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/321500/321596.png',
      battingLevel: 87,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'ODI BAT': 524,
      'ODI BOWL': 377,
      'T20 BAT': 436,
    },
    {
      name: 'Shakib Al Hasan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316581.png',
      battingLevel: 87,
      bowlingLevel: 88,
      role: 'All-Rounder',
      'ODI BAT': 638,
      'ODI BOWL': 657,
      'T20 BAT': 397,
      'T20 BOWL': 585,
      'TEST BAT': 555,
      'TEST BOWL': 562,
    },
    {
      name: 'Litton Das',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319700/319727.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 602,
      'T20 BAT': 461,
      'TEST BAT': 644,
    },
    {
      name: 'Moeen Ali',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316500/316557.png',
      battingLevel: 87,
      bowlingLevel: 87,
      role: 'All-Rounder',
      'ODI BAT': 404,
      'ODI BOWL': 449,
      'T20 BAT': 407,
      'T20 BOWL': 506,
    },
    {
      name: 'Jonny Bairstow',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/319700/319794.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 775,
      'T20 BAT': 502,
      'TEST BAT': 541,
    },
    {
      name: 'Rishabh Pant',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/323000/323036.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 469,
      'T20 BAT': 429,
      'TEST BAT': 738,
    },
    {
      name: 'Shikhar Dhawan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316524.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 701,
      'T20 BAT': 396,
    },
    {
      name: 'Shreyas Iyer',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/323000/323035.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 491,
      'T20 BAT': 600,
      'TEST BAT': 574,
    },
    {
      name: 'Suryakumar Yadav',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/331100/331163.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 420,
      'T20 BAT': 530,
    },
    {
      name: 'Martin Guptill',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316591.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 696,
      'T20 BAT': 658,
    },
    {
      name: 'Quinton de Kock',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316668.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 789,
      'T20 BAT': 641,
    },
    {
      name: 'Faf du Plessis',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316559.png',
      battingLevel: 87,
      bowlingLevel: 0,
      role: 'Batsman',
      'TEST BAT': 532,
    },
    {
      name: 'Rovman Powell',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322100/322172.png',
      battingLevel: 87,
      bowlingLevel: 40,
      role: 'Batsman',
      'ODI BAT': 407,
      'T20 BAT': 452,
    },
    {
      name: 'Chris Gayle',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316400/316494.png',
      battingLevel: 87,
      bowlingLevel: 63,
      role: 'Batsman',
    },
    {
      name: 'Aaron Finch',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316533.png',
      battingLevel: 86,
      bowlingLevel: 10,
      role: 'Batsman',
      'ODI BAT': 745,
      'T20 BAT': 692,
    },
    {
      name: 'Jason Roy',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/319700/319791.png',
      battingLevel: 86,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 687,
      'T20 BAT': 602,
    },
    {
      name: 'Dawid Malan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/323000/323003.png',
      battingLevel: 86,
      bowlingLevel: 0,
      role: 'Batsman',
      'T20 BAT': 728,
      'TEST BAT': 424,
    },
    {
      name: 'Jimmy Neesham',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319700/319781.png',
      battingLevel: 86,
      bowlingLevel: 80,
      role: 'All-Rounder',
      'ODI BAT': 488,
      'ODI BOWL': 451,
    },
    {
      name: 'Dasun Shanaka',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/328000/328058.png',
      battingLevel: 86,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'ODI BAT': 464,
      'T20 BAT': 468,
      'TEST BOWL': 202,
    },
    {
      name: 'Evin Lewis',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320000/320093.png',
      battingLevel: 86,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 541,
      'T20 BAT': 524,
    },
    {
      name: 'Mohammad Nabi',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316558.png',
      battingLevel: 85,
      bowlingLevel: 87,
      role: 'All-Rounder',
      'ODI BAT': 490,
      'ODI BOWL': 603,
      'T20 BAT': 524,
      'T20 BOWL': 527,
    },
    {
      name: 'Mitchell Marsh',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316612.png',
      battingLevel: 85,
      bowlingLevel: 82,
      role: 'All-Rounder',
      'ODI BAT': 482,
      'ODI BOWL': 384,
      'T20 BAT': 552,
    },
    {
      name: 'Steve Smith',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316609.png',
      battingLevel: 85,
      bowlingLevel: 50,
      role: 'Batsman',
      'ODI BAT': 686,
      'TEST BAT': 845,
    },
    {
      name: 'Alex Carey',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/321500/321551.png',
      battingLevel: 85,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 651,
      'TEST BAT': 462,
    },
    {
      name: 'Andre Russell',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316615.png',
      battingLevel: 85,
      bowlingLevel: 82,
      role: 'All-Rounder',
    },
    {
      name: 'Shimron Hetmyer',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320100/320116.png',
      battingLevel: 85,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 589,
      'T20 BAT': 385,
    },
    {
      name: 'Rahmanullah Gurbaz',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320500/320504.png',
      battingLevel: 84,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 538,
      'T20 BAT': 519,
    },
    {
      name: 'Ishan Kishan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/331100/331165.png',
      battingLevel: 84,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'T20 BAT': 401,
    },
    {
      name: 'Kariyawasa Asalanka',
      battingLevel: 84,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 546,
      'T20 BAT': 492,
    },
    {
      name: 'Jason Holder',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316673.png',
      battingLevel: 84,
      bowlingLevel: 86,
      role: 'All-Rounder',
      'ODI BAT': 441,
      'ODI BOWL': 460,
      'T20 BOWL': 550,
      'TEST BAT': 496,
      'TEST BOWL': 679,
    },
    {
      name: 'Afif Hossain',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/323100/323159.png',
      battingLevel: 83,
      bowlingLevel: 50,
      role: 'All-Rounder',
      'ODI BAT': 429,
      'T20 BAT': 398,
    },
    {
      name: 'Liam Livingstone',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/323100/323103.png',
      battingLevel: 83,
      bowlingLevel: 12,
      role: 'All-Rounder',
      'T20 BAT': 400,
      'T20 BOWL': 428,
    },
    {
      name: 'Eoin Morgan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316500/316564.png',
      battingLevel: 83,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 650,
      'T20 BAT': 547,
    },
    {
      name: 'Henry Nicholls',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319700/319777.png',
      battingLevel: 83,
      bowlingLevel: 20,
      role: 'Batsman',
      'ODI BAT': 571,
      'TEST BAT': 675,
    },
    {
      name: 'Kieron Pollard',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320100/320107.png',
      battingLevel: 83,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'T20 BAT': 414,
    },
    {
      name: 'Najibullah Zadran',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316698.png',
      battingLevel: 82,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 547,
      'T20 BAT': 522,
    },
    {
      name: 'Tamim Iqbal',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316583.png',
      battingLevel: 82,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 662,
      'TEST BAT': 574,
    },
    {
      name: 'Ravindra Jadeja',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316600.png',
      battingLevel: 82,
      bowlingLevel: 85,
      role: 'All-Rounder',
      'ODI BAT': 421,
      'ODI BOWL': 534,
      'T20 BOWL': 376,
      'TEST BAT': 562,
      'TEST BOWL': 686,
    },
    {
      name: 'MS Dhoni (wk)',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319900/319946.png',
      battingLevel: 82,
      bowlingLevel: 20,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Aiden Markram',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322000/322067.png',
      battingLevel: 82,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 471,
      'T20 BAT': 796,
      'TEST BAT': 557,
    },
    {
      name: 'Janneman Malan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322000/322090.png',
      battingLevel: 82,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 574,
    },
    {
      name: 'Sikandar Raza',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316632.png',
      battingLevel: 82,
      bowlingLevel: 70,
      role: 'Batsman',
      'ODI BAT': 540,
      'ODI BOWL': 406,
      'TEST BAT': 523,
      'TEST BOWL': 315,
    },
    {
      name: 'Sam Curran',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/323100/323113.png',
      battingLevel: 81,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'TEST BAT': 361,
      'TEST BOWL': 327,
    },
    {
      name: 'Dwayne Bravo',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320000/320092.png',
      battingLevel: 81,
      bowlingLevel: 83,
      role: 'All-Rounder',
    },
    {
      name: 'Rashid Khan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320500/320506.png',
      battingLevel: 80,
      bowlingLevel: 90,
      role: 'Bowler',
      'ODI BAT': 426,
      'ODI BOWL': 650,
      'T20 BOWL': 714,
      'TEST BOWL': 543,
    },
    {
      name: 'Pat Cummins',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316692.png',
      battingLevel: 80,
      bowlingLevel: 88,
      role: 'Bowlers',
      'ODI BOWL': 627,
      'T20 BOWL': 454,
      'TEST BOWL': 901,
    },
    {
      name: 'Travis Head',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/321500/321584.png',
      battingLevel: 80,
      bowlingLevel: 50,
      role: 'Batsman',
      'ODI BAT': 581,
      'TEST BAT': 744,
    },
    {
      name: 'Matthew Wade',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316594.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 418,
      'T20 BAT': 407,
      'TEST BAT': 462,
    },
    {
      name: 'Soumya Sarkar',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316685.png',
      battingLevel: 80,
      bowlingLevel: 60,
      role: 'Batsman',
      'ODI BAT': 506,
      'TEST BAT': 356,
    },
    {
      name: 'Mayank Agarwal',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322600/322626.png',
      battingLevel: 80,
      bowlingLevel: 19,
      role: 'Batsman',
      'TEST BAT': 650,
    },
    {
      name: 'Ross Taylor',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316538.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 775,
    },
    {
      name: 'Imam-ul-Haq',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322200/322209.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 795,
      'TEST BAT': 483,
    },
    {
      name: 'Heinrich Klaasen',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322000/322073.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 460,
    },
    {
      name: 'Danushka Gunathilaka',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319800/319857.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 522,
    },
    {
      name: 'Kusal Mendis',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319800/319866.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 511,
      'T20 BAT': 369,
      'TEST BAT': 515,
    },
    {
      name: 'Niroshan Dickwella',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319800/319881.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 488,
      'TEST BAT': 577,
    },
    {
      name: 'Shai Hope',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320100/320122.png',
      battingLevel: 80,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 713,
      'TEST BAT': 393,
    },
    {
      name: 'Sabbir Rahman',
      battingLevel: 79,
      bowlingLevel: 0,
      role: 'Batsman',
    },
    {
      name: 'Sanju Samson (c&wk)',
      battingLevel: 79,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Dhananjaya de Silva',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319800/319859.png',
      battingLevel: 79,
      bowlingLevel: 50,
      role: 'Batsman',
      'ODI BAT': 466,
      'ODI BOWL': 395,
      'TEST BAT': 592,
      'TEST BOWL': 213,
    },
    {
      name: 'Craig Ervine',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316567.png',
      battingLevel: 79,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 483,
      'T20 BAT': 396,
    },
    {
      name: 'Mehedi Hasan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319700/319728.png',
      battingLevel: 78,
      bowlingLevel: 85,
      role: 'All-Rounder',
      'ODI BOWL': 661,
      'TEST BOWL': 552,
    },
    {
      name: 'Mohammad Saifuddin',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322800/322800.png',
      battingLevel: 78,
      bowlingLevel: 81,
      role: 'All-Rounder',
      'ODI BOWL': 454,
      'T20 BOWL': 431,
    },
    {
      name: 'Mahedi Hasan',
      battingLevel: 78,
      bowlingLevel: 74,
      role: 'All-Rounder',
      'T20 BOWL': 622,
    },
    {
      name: 'Imrul Kayes',
      battingLevel: 78,
      bowlingLevel: 35,
      role: 'Batsman',
    },
    {
      name: 'Mushfiqur Rahim',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316578.png',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 691,
      'TEST BAT': 595,
    },
    {
      name: 'Krunal Pandya',
      battingLevel: 78,
      bowlingLevel: 68,
      role: 'All-Rounder',
    },
    {
      name: 'Devdutt Padikkal',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Batsman',
    },
    {
      name: 'Shubman Gill',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Batsman',
      'TEST BAT': 512,
    },
    {
      name: 'Colin de Grandhomme',
      battingLevel: 78,
      bowlingLevel: 75,
      role: 'All-Rounder',
      'ODI BAT': 501,
      'ODI BOWL': 523,
      'TEST BAT': 609,
      'TEST BOWL': 403,
    },
    {
      name: 'Tom Latham',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 646,
      'T20 BAT': 395,
      'TEST BAT': 679,
    },
    {
      name: 'Finn Allen (wk)',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Sarfaraz Ahmed',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'ODI BAT': 497,
    },
    {
      name: 'Rassie van der Dussen',
      battingLevel: 78,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 769,
      'T20 BAT': 669,
      'TEST BAT': 546,
    },
    {
      name: 'Sunil Narine',
      battingLevel: 78,
      bowlingLevel: 81,
      role: 'All-Rounder',
    },
    {
      name: 'Nurul Hasan',
      battingLevel: 77,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Mahmudullah',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316500/316571.png',
      battingLevel: 76,
      bowlingLevel: 70,
      role: 'All-Rounder',
      'ODI BAT': 567,
      'T20 BAT': 516,
      'TEST BAT': 508,
      'TEST BOWL': 193,
    },
    {
      name: 'Mahmudul Hasan Joy',
      battingLevel: 76,
      bowlingLevel: 32,
      role: 'Batsman',
      'TEST BAT': 381,
    },
    {
      name: 'Towhid Hridoy',
      battingLevel: 76,
      bowlingLevel: 16,
      role: 'Batsman',
    },
    {
      name: 'Prithvi Shaw',
      battingLevel: 76,
      bowlingLevel: 0,
      role: 'Batsman',
    },
    {
      name: 'Glenn Phillips',
      battingLevel: 76,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
      'T20 BAT': 510,
    },
    {
      name: 'Angelo Mathews',
      battingLevel: 76,
      bowlingLevel: 50,
      role: 'All-Rounder',
      'ODI BAT': 534,
      'TEST BAT': 605,
    },
    {
      name: 'Mominul Haque',
      battingLevel: 75,
      bowlingLevel: 36,
      role: 'Batsman',
      'TEST BAT': 523,
    },
    {
      name: 'Nazmul Shanto',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/323100/323155.png',
      battingLevel: 75,
      bowlingLevel: 22,
      role: 'Batsman',
      'TEST BAT': 418,
    },
    {
      name: 'Imad Wasim',
      battingLevel: 75,
      bowlingLevel: 85,
      role: 'All-Rounder',
      'ODI BAT': 517,
      'ODI BOWL': 480,
      'T20 BOWL': 471,
    },
    {
      name: 'Kusal Perera',
      battingLevel: 75,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 543,
      'T20 BAT': 413,
      'TEST BAT': 466,
    },
    {
      name: 'Mohammad Naim',
      battingLevel: 74,
      bowlingLevel: 32,
      role: 'Batsman',
      'T20 BAT': 536,
    },
    {
      name: 'Akbar Ali',
      battingLevel: 74,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'James Neesham',
      battingLevel: 74,
      bowlingLevel: 78,
      role: 'All-Rounder',
    },
    {
      name: 'Mosaddek Hossain',
      battingLevel: 73,
      bowlingLevel: 52,
      role: 'Batsman',
    },
    {
      name: 'Anamul Haque',
      battingLevel: 73,
      bowlingLevel: 10,
      role: 'Batsman',
    },
    {
      name: 'Cheteshwar Pujara',
      battingLevel: 73,
      bowlingLevel: 21,
      role: 'Batsman',
      'TEST BAT': 619,
    },
    {
      name: 'Fabian Allen',
      battingLevel: 73,
      bowlingLevel: 71,
      role: 'All-Rounder',
      'T20 BOWL': 455,
    },
    {
      name: 'Pervez Hossain Emon',
      battingLevel: 72,
      bowlingLevel: 0,
      role: 'Batsman',
    },
    {
      name: 'Deepak Hooda',
      battingLevel: 72,
      bowlingLevel: 64,
      role: 'All-Rounder',
    },
    {
      name: 'Irfan Sukkur',
      battingLevel: 71,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Dinesh Karthik (wk)',
      battingLevel: 71,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Marnus Labuschagne',
      battingLevel: 70,
      bowlingLevel: 40,
      role: 'Batsman',
      'ODI BAT': 491,
      'TEST BAT': 892,
    },
    {
      name: 'Kyle Verreynne',
      battingLevel: 70,
      bowlingLevel: 50,
      role: 'Batsman',
      'ODI BAT': 437,
      'TEST BAT': 446,
    },
    {
      name: 'Avishka Fernando',
      battingLevel: 70,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 560,
    },
    {
      name: 'Shamim Hossain',
      battingLevel: 69,
      bowlingLevel: 43,
      role: 'All-Rounder',
    },
    {
      name: 'Imran Uzzaman',
      battingLevel: 68,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Ravichandran Ashwin',
      battingLevel: 68,
      bowlingLevel: 80,
      role: 'All-Rounder',
      'ODI BOWL': 381,
      'TEST BAT': 402,
      'TEST BOWL': 850,
    },
    {
      name: 'Mitchell Santner',
      battingLevel: 68,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BAT': 453,
      'ODI BOWL': 574,
      'T20 BOWL': 600,
      'TEST BOWL': 223,
    },
    {
      name: 'Dinesh Chandimal',
      battingLevel: 68,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 414,
      'TEST BAT': 496,
    },
    {
      name: 'Yasir Ali',
      battingLevel: 67,
      role: 'Batsman',
    },
    {
      name: 'Gulbadin Naib',
      battingLevel: 63,
      bowlingLevel: 78,
      role: 'All-Rounder',
      'ODI BAT': 405,
      'ODI BOWL': 382,
    },
    {
      name: 'Jaker Ali',
      battingLevel: 63,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'Rahmat Shah',
      battingLevel: 60,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 593,
      'TEST BAT': 377,
    },
    {
      name: 'Mohammad Mithun',
      battingLevel: 60,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 420,
    },
    {
      name: 'Chris Woakes',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316600/316603.png',
      battingLevel: 60,
      bowlingLevel: 86,
      role: 'Bowler',
      'ODI BOWL': 700,
      'T20 BOWL': 419,
      'TEST BAT': 427,
      'TEST BOWL': 560,
    },
    {
      name: 'Wanindu Hasaranga',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322900/322946.png',
      battingLevel: 60,
      bowlingLevel: 89,
      role: 'All-Rounder',
      'ODI BOWL': 523,
      'T20 BOWL': 687,
    },
    {
      name: 'Jofra Archer',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322900/322929.png',
      battingLevel: 58,
      bowlingLevel: 88,
      role: 'Bowler',
      'T20 BOWL': 397,
      'TEST BOWL': 347,
    },
    {
      name: 'Hashmatullah Shaidi',
      battingLevel: 56,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 512,
      'TEST BAT': 397,
    },
    {
      name: 'Sean Williams',
      battingLevel: 56,
      bowlingLevel: 50,
      role: 'All-Rounder',
      'ODI BAT': 559,
      'ODI BOWL': 401,
      'T20 BAT': 383,
      'TEST BAT': 603,
      'TEST BOWL': 181,
    },
    {
      name: 'Mashrafe Mortaza',
      battingLevel: 55,
      bowlingLevel: 80,
      role: 'Bowler',
    },
    {
      name: 'Nasum Ahmed',
      battingLevel: 52,
      bowlingLevel: 78,
      role: 'Bowler',
      'T20 BOWL': 637,
    },
    {
      name: 'Stuart Broad',
      battingLevel: 52,
      bowlingLevel: 77,
      role: 'Bowler',
      'TEST BOWL': 725,
    },
    {
      name: 'Lockie Ferguson',
      battingLevel: 52,
      bowlingLevel: 81,
      role: 'Bowler',
      'T20 BOWL': 440,
    },
    {
      name: 'Hasan Ali',
      battingLevel: 51,
      bowlingLevel: 79,
      role: 'Bowler',
      'ODI BOWL': 466,
      'T20 BOWL': 439,
      'TEST BOWL': 697,
    },
    {
      name: 'Mujeeb Ur Rahman',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320500/320501.png',
      battingLevel: 50,
      bowlingLevel: 89,
      role: 'Bowler',
      'ODI BOWL': 681,
      'T20 BOWL': 654,
    },
    {
      name: 'Jasprit Bumrah',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319900/319940.png',
      battingLevel: 50,
      bowlingLevel: 90,
      role: 'Bowler',
      'ODI BOWL': 679,
      'T20 BOWL': 544,
      'TEST BOWL': 830,
    },
    {
      name: 'Haris Sohail',
      battingLevel: 50,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 585,
      'TEST BAT': 377,
      'TEST BOWL': 212,
    },
    {
      name: 'Andile Phehlukwayo',
      battingLevel: 50,
      bowlingLevel: 60,
      role: 'All-Rounder',
      'ODI BAT': 416,
      'ODI BOWL': 470,
      'T20 BOWL': 382,
    },
    {
      name: 'Temba Bavuma',
      battingLevel: 50,
      bowlingLevel: 0,
      role: 'Batsman',
      'ODI BAT': 502,
      'T20 BAT': 453,
      'TEST BAT': 620,
    },
    {
      name: 'Akila Dananjaya',
      battingLevel: 50,
      bowlingLevel: 79,
      role: 'Bowler',
      'ODI BOWL': 574,
    },
    {
      name: 'Mahidul Islam Ankon',
      battingLevel: 45,
      bowlingLevel: 0,
      role: 'Wicket-Keeper',
    },
    {
      name: 'James Anderson',
      battingLevel: 43,
      bowlingLevel: 84,
      role: 'Bowler',
      'TEST BOWL': 765,
    },
    {
      name: 'Harshal Patel',
      battingLevel: 43,
      bowlingLevel: 77,
      role: 'Bowler',
      'T20 BOWL': 381,
    },
    {
      name: 'Mrittunjoy Chowdhury',
      battingLevel: 42,
      bowlingLevel: 75,
      role: 'Bowler',
    },
    {
      name: 'David Willey',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/322900/322904.png',
      battingLevel: 42,
      bowlingLevel: 82,
      role: 'All-Rounder',
      'ODI BOWL': 501,
      'T20 BOWL': 375,
    },
    {
      name: 'Chetan Sakariya',
      battingLevel: 42,
      bowlingLevel: 63,
      role: 'Bowler',
    },
    {
      name: 'Sandeep Lamichhane',
      battingLevel: 42,
      bowlingLevel: 81,
      role: 'Bowler',
      'ODI BOWL': 478,
      'T20 BOWL': 490,
    },
    {
      name: 'Taijul Islam',
      battingLevel: 41,
      bowlingLevel: 74,
      role: 'Bowler',
      'TEST BOWL': 636,
    },
    {
      name: 'Mitchell Starc',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316600/316644.png',
      battingLevel: 40,
      bowlingLevel: 89,
      role: 'Bowler',
      'ODI BOWL': 642,
      'T20 BOWL': 461,
      'TEST BAT': 392,
      'TEST BOWL': 743,
    },
    {
      name: 'Josh Hazlewood',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316622.png',
      battingLevel: 40,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BOWL': 698,
      'T20 BOWL': 737,
      'TEST BOWL': 752,
    },
    {
      name: 'Mohammad Shami',
      battingLevel: 40,
      bowlingLevel: 86,
      role: 'Bowler',
      'ODI BOWL': 549,
      'TEST BOWL': 697,
    },
    {
      name: 'Bhuvneshwar Kumar',
      battingLevel: 40,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BOWL': 585,
      'T20 BOWL': 586,
    },
    {
      name: 'Trent Boult',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316600/316619.png',
      battingLevel: 40,
      bowlingLevel: 89,
      role: 'Bowler',
      'ODI BOWL': 726,
      'T20 BOWL': 596,
      'TEST BOWL': 730,
    },
    {
      name: 'Matt Henry',
      battingLevel: 40,
      bowlingLevel: 84,
      role: 'Bowler',
      'ODI BOWL': 683,
      'TEST BOWL': 468,
    },
    {
      name: 'Shaheen Afridi',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/322200/322250.png',
      battingLevel: 40,
      bowlingLevel: 90,
      role: 'Bowler',
      'ODI BOWL': 671,
      'T20 BOWL': 634,
      'TEST BOWL': 827,
    },
    {
      name: 'Keshav Maharaj',
      battingLevel: 40,
      bowlingLevel: 78,
      role: 'Bowler',
      'ODI BOWL': 531,
      'T20 BOWL': 451,
      'TEST BOWL': 660,
    },
    {
      name: 'Alzarri Joseph',
      battingLevel: 40,
      bowlingLevel: 82,
      role: 'Bowler',
      'ODI BOWL': 593,
      'TEST BOWL': 373,
    },
    {
      name: 'Ishant Sharma',
      battingLevel: 38,
      bowlingLevel: 75,
      role: 'Bowler',
      'TEST BOWL': 616,
    },
    {
      name: 'Taskin Ahmed',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/316700/316703.png',
      battingLevel: 35,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BOWL': 523,
      'T20 BOWL': 407,
      'TEST BOWL': 201,
    },
    {
      name: 'Adil Rashid',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/319700/319741.png',
      battingLevel: 35,
      bowlingLevel: 81,
      role: 'Bowler',
      'ODI BOWL': 497,
      'T20 BOWL': 746,
    },
    {
      name: 'Tim Southee',
      battingLevel: 35,
      bowlingLevel: 75,
      role: 'Bowlers',
      'T20 BOWL': 633,
      'TEST BOWL': 790,
    },
    {
      name: 'Anrich Nortje',
      battingLevel: 35,
      bowlingLevel: 76,
      role: 'Bowler',
      'ODI BOWL': 417,
      'T20 BOWL': 655,
      'TEST BOWL': 526,
    },
    {
      name: 'Adam Zampa',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/321500/321549.png',
      battingLevel: 30,
      bowlingLevel: 86,
      role: 'Bowler',
      'ODI BOWL': 634,
      'T20 BOWL': 719,
    },
    {
      name: 'Mustafizur Rahman',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/319700/319734.png',
      battingLevel: 30,
      bowlingLevel: 89,
      role: 'Bowler',
      'ODI BOWL': 614,
      'T20 BOWL': 578,
      'TEST BOWL': 260,
    },
    {
      name: 'Fazle Mahmud',
      battingLevel: 30,
      bowlingLevel: 60,
      role: 'Bowler',
    },
    {
      name: 'Mark Wood',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316600/316660.png',
      battingLevel: 30,
      bowlingLevel: 83,
      role: 'Bowler',
      'ODI BOWL': 594,
      'T20 BOWL': 466,
      'TEST BOWL': 555,
    },
    {
      name: 'Yuzvendra Chahal',
      battingLevel: 30,
      bowlingLevel: 87,
      role: 'Bowler',
      'ODI BOWL': 610,
      'T20 BOWL': 535,
    },
    {
      name: 'Kuldeep Yadav',
      battingLevel: 30,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BOWL': 538,
      'TEST BOWL': 318,
    },
    {
      name: 'Kagiso Rabada',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/320300/320376.png',
      battingLevel: 30,
      bowlingLevel: 88,
      role: 'Bowler',
      'ODI BOWL': 644,
      'T20 BOWL': 458,
      'TEST BOWL': 818,
    },
    {
      name: 'Tabraiz Shamsi',
      battingLevel: 30,
      bowlingLevel: 84,
      role: 'Bowler',
      'ODI BOWL': 582,
      'T20 BOWL': 784,
    },
    {
      name: 'Dushmantha Chameera',
      battingLevel: 30,
      bowlingLevel: 83,
      role: 'Bowler',
      'ODI BOWL': 540,
      'T20 BOWL': 543,
      'TEST BOWL': 232,
    },
    {
      name: 'Muktar Ali',
      battingLevel: 29,
      bowlingLevel: 68,
      role: 'Bowler',
    },
    {
      name: 'Kartik Tyagi',
      battingLevel: 26,
      bowlingLevel: 76,
      role: 'Bowler',
    },
    {
      name: 'Rishad Hossain',
      battingLevel: 25,
      bowlingLevel: 71,
      role: 'Bowler',
    },
    {
      name: 'Rubel Hossain',
      battingLevel: 25,
      bowlingLevel: 70,
      'ODI BOWL': 388,
    },
    {
      name: 'Chris Jordan',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160/lsci/db/PICTURES/CMS/316600/316623.png',
      battingLevel: 24,
      bowlingLevel: 80,
      role: 'All-Rounder',
      'T20 BOWL': 566,
    },
    {
      name: 'Jubair Hossain',
      battingLevel: 21,
      bowlingLevel: 67,
      role: 'Bowler',
    },
    {
      name: 'Mohammed Siraj',
      battingLevel: 21,
      bowlingLevel: 79,
      role: 'Bowler',
      'TEST BOWL': 431,
    },
    {
      name: 'Ashton Agar',
      photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/321500/321559.png',
      battingLevel: 20,
      bowlingLevel: 74,
      role: 'Bowler',
      'ODI BOWL': 429,
      'T20 BOWL': 632,
    },
    {
      name: 'Nazmul Apu',
      battingLevel: 20,
      bowlingLevel: 65,
      role: 'Bowler',
    },
    {
      name: 'Lungi Ngidi',
      battingLevel: 20,
      bowlingLevel: 85,
      role: 'Bowler',
      'ODI BOWL': 607,
      'T20 BOWL': 414,
      'TEST BOWL': 613,
    },
    {
      name: 'Sheldon Cottrell',
      battingLevel: 20,
      bowlingLevel: 80,
      role: 'Bowler',
      'ODI BOWL': 525,
      'T20 BOWL': 514,
    },
    {
      name: 'Kamrul Islam Rabbi',
      battingLevel: 16,
      bowlingLevel: 63,
      role: 'Bowler',
    },
    {
      name: 'Ebadot Hussain',
      battingLevel: 15,
      bowlingLevel: 79,
      role: 'Bowler',
      'TEST BOWL': 224,
    },
    {
      name: 'Khaled Ahmed',
      battingLevel: 12,
      bowlingLevel: 69,
      role: 'Bowler',
      'TEST BOWL': 132,
    },
    {
      name: 'Deepak Chahar',
      battingLevel: 11,
      bowlingLevel: 73,
      role: 'Bowler',
      'T20 BOWL': 472,
    },
  ];
  const photos = [
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F11.png?alt=media&token=b6a3a573-39d1-44a1-8537-aa6ecf8a7c21',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F14.png?alt=media&token=d6401c46-dbf7-4862-b671-549c0d6c312e',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F16.png?alt=media&token=5fd95cd1-3dff-446b-9b8c-b1f04be7fb02',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F13.png?alt=media&token=c95b1020-ae24-477f-a91e-345c7aa3c78e',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F1.png?alt=media&token=f2b4ee31-805e-4f86-ba3b-97cfb905f00d',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F12.png?alt=media&token=86abe2d9-8de1-4c20-a15c-f3cb0d6d23fc',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F10.png?alt=media&token=46489679-cb23-4715-b298-9de7a00be324',
    'https://firebasestorage.googleapis.com/v0/b/spin-the-wicket-dev.appspot.com/o/players%2F15.png?alt=media&token=7401338b-cce5-4fa4-907b-bd63609c95ca',
  ];

  for (const player of players) {
    const slug = player.name?.replace(/\s+/g, '-').toLowerCase();
    const photo = player.photo ? player.photo : photos[Math.floor(Math.random() * photos.length)];

    const _player = {
      name: player.name,
      nationality: '-',
      photo: photo,
      slug: slug,
      battingStyle: '-',
      bowlingStyle: '-',
      battingLevel: player.battingLevel,
      bowlingLevel: player.bowlingLevel,
    };

    await PlayerInfo.create(_player);

    console.log('CREATED ===>', _player.name);
  }
};

const startQuickMatch = async (req: Request, res: Response) => {
  try {
    const { team, overs, user, matchMode } = req.body;

    //

    if (!team || !overs || !user) {
      const msg = 'provide all informations!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    //verify and get team
    const dreamTeam: any = await DreamTeam.findById(team).populate(teamPopulate);

    if (!dreamTeam) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'Dream Team Not Found');
    }

    if (dreamTeam?.manager?._id?.toString() !== user?.toString()) {
      return response(res, StatusCodes.FORBIDDEN, false, null, 'You dont have permission to play with this team!');
    }

    //find opponent
    const botTeams: any[] = await DreamTeam.find({
      rating: { $gte: dreamTeam.rating - 5, $lte: dreamTeam.rating + 5 },
      isBot: true,
    }).populate(teamPopulate);

    if (botTeams?.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'No Opponent Found');
    }

    const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)];

    //prepare match data

    let battingTeam = null,
      bowlingTeam = null,
      liveData = { ...initialLiveData };
    const tossResult = Math.floor(Math.random() * 10000) % 2;
    // const tossResult = Math.floor(Math.random() * 10000) % 2;

    const choosen = Math.floor(Math.random() * 10000) % 2;
    const toss = {
      team: tossResult === 0 ? dreamTeam?._id?.toString() : opponentTeam?._id?.toString(),
      selectedTo: choosen === 0 ? 'bat' : 'bowl',
    };
    battingTeam = choosen === 0 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
    bowlingTeam = choosen === 1 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
    const teamAStatus =
      toss.team === dreamTeam?._id?.toString()
        ? toss.selectedTo === 'bat'
          ? 'batting'
          : 'bowling'
        : toss.selectedTo === 'bat'
          ? 'bowling'
          : 'batting';
    const teamBStatus =
      toss.team === dreamTeam?._id?.toString()
        ? toss.selectedTo === 'bat'
          ? 'bowling'
          : 'batting'
        : toss.selectedTo === 'bat'
          ? 'batting'
          : 'bowling';

    liveData = {
      teamA: {
        scorer: user,
        status: matchMode === 'h2h' ? 'batting' : teamAStatus,
        ...initialLiveData,
      },
      teamB: {
        scorer: null,
        status: matchMode === 'h2h' ? 'batting' : teamBStatus,
        ...initialLiveData,
      },
    };
    console.log('💡 | liveData:', liveData);

    const innings = {
      first: {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        ...initialInningData,
      },
      second: {
        battingTeam: bowlingTeam,
        bowlingTeam: battingTeam,
        ...initialInningData,
      },
    };

    const createdAt = new Date();

    const matchData = {
      title: `${dreamTeam.title} vs ${opponentTeam?.title}`,
      matchType: 'quick',
      teams: {
        teamA: dreamTeam?._id?.toString(),
        teamB: opponentTeam?._id?.toString(),
      },
      scorers: { a: user, b: null },
      matchMode: matchMode || 'h2h',
      overs: parseInt(overs),
      status: 'live',
      createdAt: createdAt.toString(),
      squad: {
        teamA: {
          playingXI: dreamTeam?.playingXI?.map((player) => player?._id),
          team: dreamTeam?._id,
        },
        teamB: {
          playingXI: opponentTeam?.playingXI?.map((player) => player?._id),
          team: opponentTeam?._id,
        },
      },
      ready: {
        [user?.toString()]: false,
      },
      users: [user],
      toss: toss,
      liveData: liveData,
      innings,
    };

    //save match data
    const quickMatch = new DreamTeamMatch(matchData);
    await quickMatch.save();

    return response(res, StatusCodes.ACCEPTED, true, quickMatch, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getMatchData = async (args: any, app: any, responder: any) => {
  try {
    const { id } = args;

    const matchData: any = await DreamTeamMatch.findById(id).populate([
      {
        path: 'teams.teamA',
        populate: {
          path: 'theme',
        },
      },
      {
        path: 'teams.teamB',
        populate: {
          path: 'theme',
        },
      },
      {
        path: 'squad.teamA.playingXI',
        populate: {
          path: 'playerInfo',
        },
      },
      {
        path: 'squad.teamB.playingXI',
        populate: {
          path: 'playerInfo',
        },
      },
    ]);

    // join the user to this match group in socket
    app.socketConnections.addToGroup(`dream-team-match-${id}`, responder.socket);

    return socketResponse(true, matchData, null);
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:220 | error:', error);
    return socketResponse(false, null, error.message);
  }
};

const updateMatchData = async (args: any, data: any, app: any) => {
  try {
    if (!data) {
      return socketResponse(false, null, 'Nothing to Update!');
    }

    const { id } = args;
    const { selectedTo, striker, nonStriker, bowler, user, team, ...rest } = data;
    let matchData: Partial<_IMatch_> = await DreamTeamMatch.findById(id);
    let updateData: any = {};

    const currentInning =
      matchData?.innings?.first?.battingTeam?.toString() === matchData?.teams[team]?.toString() ? (bowler ? 'second' : 'first') : 'first';

    // Toss Update
    if (selectedTo) {
      updateData = {
        ...updateData,
        'toss.selectedTo': selectedTo,

        'liveData.inning': 'first',
        'liveData.battingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'liveData.bowlingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'liveData.battingScorer': selectedTo === 'bowl' ? null : user,
        'liveData.bowlingScorer': selectedTo === 'bat' ? null : user,

        'innings.first.battingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.first.bowlingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.first.battingScorer': selectedTo === 'bowl' ? null : user,
        'innings.first.bowlingScorer': selectedTo === 'bat' ? null : user,
        'innings.second.bowlingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.second.battingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.second.bowlingScorer': selectedTo === 'bowl' ? null : user,
        'innings.second.battingScorer': selectedTo === 'bat' ? null : user,
      };
    }

    // Select Striker
    if (striker) {
      console.log('💡 | striker:', striker);
      if (matchData?.innings[currentInning]?.battingOrder?.find((b: any) => b.id?.toString() === striker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.batsman.striker`]: {
          id: striker,
          inAt: matchData?.innings[currentInning]?.battingOrder?.length + 1 || 1,
          ...initialMatchBatsmanData,
        },
      };
      console.log('💡 | updateData:', updateData);
    }
    // Select NonStriker
    if (nonStriker) {
      if (matchData?.innings[currentInning]?.battingOrder?.find((b: any) => b.id?.toString() === nonStriker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.batsman.nonStriker`]: {
          id: nonStriker,
          inAt: matchData?.innings[currentInning]?.battingOrder?.length + (!matchData?.innings[currentInning]?.battingOrder?.length ? 2 : 1),
          ...initialMatchBatsmanData,
        },
      };
    }
    // Select Bowler
    if (bowler) {
      const newBolwer = matchData?.innings[currentInning]?.bowlingOrder?.find((b: any) => b.id?.toString() === bowler?.toString()) || {
        ...initialMatchBowlerData,
        id: bowler,
      };

      if (newBolwer?.overs === Number((matchData?.overs / 5).toFixed(0))) {
        return socketResponse(false, null, 'No Over Left to Bowl!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.bowler`]: newBolwer,
      };
    }

    matchData = await DreamTeamMatch.findByIdAndUpdate(id, { ...updateData, ...rest }, { new: true });
    console.log('💡 | matchData:', matchData);

    app.socketConnections.broadcastInMemory(`dream-team-match-${id}`, 'dream-team-match', {
      data: matchData,
      timestamp: new Date(),
    });
    return socketResponse(true, matchData, null);
  } catch (error) {
    return socketResponse(false, null, error.message);
  }
};

const playMatch = async (data: any) => {
  try {
    const { match, bat, bowl, team } = data;

    if (!match || !bat || !bowl) {
      return socketResponse(false, null, 'Provide all Data!');
    }

    let matchData: Partial<_IMatch_> = await DreamTeamMatch.findById(match);

    if (!matchData) {
      return socketResponse(false, null, 'Match Not Found!');
    }

    // BROADCAST SPINNING RESPONSE

    const battingTeam = matchData?.teams?.teamA?.toString() === team ? 'teamA' : 'teamB';
    const bowlingTeam = matchData?.teams?.teamA?.toString() === team ? 'teamB' : 'teamA';

    if (ballValidation(matchData, battingTeam)) {
      const ballAction = 'WIDE';
      // const ballAction = ballResult(bat, bowl);
      console.log('💡 | file: dreamTeamMatch.controller.ts:301 | ballAction:', ballAction);

      if (!ballAction) return socketResponse(false, null, 'Failed to generate ball result!');

      const lastSpinPosition = getLastSpinPosition(ballAction);

      const ballData = prepareBallData(matchData, ballAction, battingTeam, bowlingTeam);
      const ballResponse = await getMatchFunction(ballAction, matchData, ballData, battingTeam);
      console.log('💡 | file: dreamTeamMatch.controller.ts:343 | ballResponse:', ballResponse);

      if (!ballResponse?.success) {
        return socketResponse(false, null, ballResponse?.message);
      }

      const updateData = {
        'liveData.lastSpinPosition': lastSpinPosition,
        'liveData.spinning': false,
      };

      matchData = await DreamTeamMatch.findByIdAndUpdate(matchData._id, updateData, {
        new: true,
      }).select('innings liveData title');

      //BROADCAST THE UPDATED DATA

      return socketResponse(true, matchData, '');
    } else {
      return socketResponse(false, null, 'Invalid Play!');
    }
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:354 | error:', error);
    return socketResponse(false, null, 'Server Error!');
  }
};

export { startQuickMatch, getMatchData, playMatch, updateMatchData };

'use strict';

require('babel-register');

const TheUltimateQuestionofLifeTheUniverseAndEverything = 42;

const bus = require('./bus');
bus.publish(`app`, {message: 'app start'});

const config = require('./conf');
const logger = require('./log');
const db = require('./db');
const server = require('./server');
const client = require('./client');
const pool = require('./pool');
// const io = require('./io');

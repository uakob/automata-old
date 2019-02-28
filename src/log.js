'use strict';

require('babel-register');

const bus = require('./bus');

// const fs = require('fs');

bus.subscribe('pool', (msg, data) => {
  logger.info(msg, data);
});

bus.subscribe('machina', (msg, data) => {
  logger.debug(msg, data);
});

bus.subscribe('machina.event', (msg, data) => {
  logger.info(msg, data);
});

bus.subscribe('machina.error', (msg, data) => {
  logger.error(msg, data);
});

bus.subscribe('machina.change', (msg, data) => {
  logger.info(msg, data);
});

bus.subscribe('client', (msg, data) => {
  logger.debug(msg, data);
});

bus.subscribe('client.success', (msg, data) => {
  logger.info(msg, data);
});

bus.subscribe('client.error', (msg, data) => {
  logger.error(msg, data);
});

bus.subscribe('db.redis.connection.success', (msg, data) => {
  logger.debug(msg, data);
});

bus.subscribe('db.redis.connection.error', (msg, data) => {
  logger.error(msg, data);
});

bus.subscribe(`db.mongodb.connection.success`, (msg, data) => {
  logger.debug(msg, data);
});

bus.subscribe(`db.mongodb.connection.error`, (msg, data) => {
  logger.error(msg, data);
});

bus.subscribe(`db.mongodb.collection.success`, (msg, data) => {
  logger.debug(msg, data);
});

bus.subscribe(`db.mongodb.collection.error`, (msg, data) => {
  logger.error(msg, data);
});

// bus.subscribe('machina.signal', (msg, data) => {
//   logger.debug(msg, data);
// });

// bus.publish('machina')

const config = require('./conf');
const path = require('path');
const winston = require('winston');
// require('winston-logstash');

// TODO вынести тоже в модуль и в конфиг тоже
const format = (message) => {
  return '[' + message.timestamp() + '] ' + message.level.toUpperCase() + ' message:' + JSON.stringify(message.meta);
};

var logger = new (winston.Logger) ({
    transports: [
      new (winston.transports.Console) ({
        colorize: true,
        level: (config.app.env == 'dev') ? 'debug' : 'info',
        timestamp: true,
        handleExceptions: true,
        json: true
      }),
      new (winston.transports.File) ({
         filename: path.join(__dirname, '/log/info.log'),
         name: 'info',
         level: 'info',
         json: false,
         timestamp: () => {return new Date().toISOString();},
         formatter: format
      }),
      new (winston.transports.File) ({
         filename: path.join(__dirname, '/log/error.log'),
         name: 'error',
         level: 'error',
         json: false,
         timestamp: () => {return new Date().toISOString();},
         formatter: format
      })
    ]
  });

logger.info('winston started to log');

module.exports = logger;

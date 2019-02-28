'use strict';

// TODO think about what exactly config must contain rather than $ENVIRONMENT
// i suggest that it is variables that can be change on the go

const config = {};
const env = process.env.ENV || process.env.ENVIRONMENT || 'default';
// const alt = ((process.argv[2])) ? true : false;

const broker = {
  host: process.env.BROKER_HOST,
  port: process.env.BROKER_PORT,
  path: '/',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'user-agent': 'credit/1.0.0',
  },
};
const echo = {
  host: process.env.ECHO_HOST,
  port: process.env.ECHO_PORT,
  path: '/',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'user-agent': 'credit/1.0.0',
  },
};

config.app = {};
config.app.ports = {
  socket: process.env.APP_PORT_SOCKET,
  http: process.env.APP_PORT_HTTP,
}

config.app.env = env;

// step: 86400,
config.app.test = {
  step: 3,
  person: 'fb8d3fb4-e8a7-4bc9-9105-84efca8216a3',
};

config.db = {};
config.db.redis = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
};
config.db.mongodb = {
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT,
  db: process.env.MONGODB_DB,
};

config.db.mongodb.dsn = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;

if (['production','prod', 'default', 'smoke'].includes(env)) {
  config.gate = broker;
} else if (['development', 'dev'].includes(env)) {
  config.gate = echo;
}

config.gate.url = config.gate.host + ':' + config.gate.port + config.gate.path;

config.log = {
  host: process.env.LOGSTASH_HOST,
  port: process.env.LOGSTASH_PORT,
  index: process.env.LOGSTASH_PREFIX,
};

config.msg = {
  api: {
    recipient: 'apiService',
    type: 'deferred',
    params: {},
    headers: {},
  },
  fraud: {
    recipient: 'fraudStop',
    type: 'deferred',
    params: {},
    headers: {},
  },
  connect: {
    recipient: 'smsGate',
    type: 'deferred',
    params: {},
    headers: {},
  },
  gate: {
    recipient: 'financeGate',
    type: 'deferred',
    params: {},
    headers: {},
  },
  calculator: {
    recipient: 'apiService',
    type: 'deferred',
    params: {},
    headers: {},
  },
  scoring: {
    recipient: 'scoring',
    type: 'deferred',
    params: {},
    headers: {},
  },
  all: {
    sender: 'creditFsm',
  },
};

module.exports = config;

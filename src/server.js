'use strict';

require('babel-register');

const EE = require('events');
const config = require('./conf');

const ports = config.app.ports;
const bus = require('./bus');
const pool = require('./pool')

var restify = require('restify');
var plugins = require('restify-plugins');
var bodyParser = require('body-parser');

var server = restify.createServer({name: 'credit', version: '1.0.1'});

server.prototype = new EE();

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.bodyParser());

server.listen(ports.http, () => {
  server.emit('event', {config: config.app, args: process.argv});
  bus.publish('server', {status: 'started'});
});

server.post('/', (req, res) => {
  res.json({message: `Good morning and welcome to the Black Mesa Transit System`});
});

server.post('/halt', (req, res) => {
  // res.json({message: "Memento, homo, quia pulvis es et in pulverem reverteris"});
  res.json({message: `De terra facta sunt, et in terram pariter revertuntur`});
  process.exit();
});

server.post('/credits', (req, res) => {
  server.emit('request', req);

  // let credit;

  let step = req.body.credit.step;
  let term = req.body.credit.term;
  let person = req.body.person.id;

  pool
    .create(step, term, person)
    .then(uuid => {
      // console.log(`uuid: ${uuid}`);
      res.json({
        code: 0,
        message: `credit created`,
        credit: {uuid: uuid}
      });
    })
    .catch(error => {
      console.log(`err: ${error}`);
      res.json({
        code: 1,
        message: `error`,
        error: `${error}`
      });
    });
});

server.get('/credits', (req, res) => {
  pool.list()
    .then(credits => {
      res.json({
        code: 0,
        message: `credits info`,
        credits: credits,
      });
    })
    .catch(error => {
      res.json({
        code: 1,
        message: `error`,
        error: `${error}`,
      });
    })
});

server.get('/log/:id', (req, res) => {
    let uuid = req.params.id;
    pool.history(uuid)
      .then(history => {
        res.json({
          code: 0,
          message: `credit history`,
          uuid: uuid,
          history: history,
        });
      })
      .catch(error => {
        res.json({
          code: 1,
          message: `error`,
          error: `${error}`,
        });
      })
  });

server.get('/person/:pid', (req, res) => {

    let pid = req.params.pid;

    pool.findByPerson(pid)
      .then(credits => {
        res.json({
          code: 0,
          message: `person credits`,
          pid: pid,
          credits: credits,
        });
      })
      .catch(error => {
        res.json({
          code: 1,
          message: `error`,
          error: `${error}`,
        });
      })
  });

server.get('/credits/:id', (req, res) => {
  let uuid = req.params.id;
  // console.log(`from server: uuid: ${uuid}`);
  pool.find(uuid)
    .then(credit => {
      res.json({
        code: 0,
        message: `info`,
        credit: credit,
      });
    })
    .catch(error => {
      res.json({
        code: 1,
        message: `error`,
        error: `${error}`,
      });
    })
  });

server.put('/credits/:id', (req, res) => {

  let event = req.body.action;
  let uuid = req.params.id;
  // console.log(req.body.id);

  pool.update(uuid, event)
    .then(credit => {
      res.json({
        code: 0,
        message: `updated`,
        // credit: credit,
      });
    })
    .catch(error => {
      res.json({
        code: 1,
        message: `error`,
        error: `${error}`,
      });
    })
});

server.del('/credits/:id', (req, res) => {

  let uuid = req.params.id;

  pool.delete(uuid)
    .then(credit => {
      res.json({
        code: 0,
        message: `deleted`,
        // credit: credit
      });
    })
    .catch(error => {
      res.json({
        code: 1,
        message: `error`,
        error: `${error}`
      });
    })

});

module.exports = server;

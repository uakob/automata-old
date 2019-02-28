'use strict'

var config = require('./conf');
const port = config.gate.port;

var restify = require('restify');
var api = restify.createServer({name: 'echo', version: '0.0.1'});

var bodyParser = require('body-parser');

api.use(bodyParser.json());

api.post("/", (req, res) => {
	res.json(req.body);
	console.log({headers: req.headers, body: req.body});
});

api.listen(port, () => {
  console.log(`echo server listening on *: ${port}`);
	console.log(`config: ${JSON.stringify(config.gate)}`);
});

'use strict';

require('babel-register');

const bus = require('./bus');

var io = require('socket.io')(api); // WAT
// io.on('connection', (socket) => {
//   logger.info('new socket connection on ' + ports.socket);
//   socket.on('read', ((name, fn) => {
//     let credits = pool.map((el) => {
//       let credit = {
//         uuid: el.id,
//         person: el.person,
//       };
//       return credit;
//     });
//     fn(credits);
//   }));
// });
// io.listen(ports.socket, () => {
//   logger.info("webscokets started on: " + ports.socket);
// });

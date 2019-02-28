'use strict';


// var a = 1;
// // while(a <=10) {
// //   console.log('blocking');
// // }
//
// var y =[];
// for (let x = 1; x <=1000000; x++) {
//   y.push(x);
// }
//
// for (let z of y) {
//   console.log('blocking for... in y, z: ' + z);
// }



// var s = 1000;
// var m = s * 60;
// var h = m * 60;
// var d = h * 24;
// var w = d * 7;
//
// var t = {
//   s : 1000,
//   get m() {
//     return this.s * 60;
//   },
//   get h() {
//     return this.m * 60;
//   },
//   get d() {
//     return this.h * 24;
//   },
//   get w() {
//     return this.d * 7;
//   }
// };

// var server = require('http').server();
var config = require('./conf');
var log = require('./log');

// var http = require('http');
var restify = require('restify');
// var plugins = require('restify-plugins');
var server = restify.createServer({name: "test", version: "1.0.1"});

const port = config.app.ports.http;
const env = config.app.env;
const conf = config.app;

var bus = require('./bus');
// console.log("global.bus: " +  Object.keys(global.bus));
const exp = require('./exp');

// var lolex = require('lolex');

// var context = {
//   setInterval: global.setInterval,
//   clearInterval: global.clearInterval,
//   setTimeout: global.setTimeout,
//   clearTimeout: global.clearTimeout,
//   setImmediate: global.setImmediate,
//   clearImmediate: global.clearImmediate
// };
// var clock = lolex.install(context, Date.now(), ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate', 'setInterval', 'clearInterval']);

server.listen(port, () => {


  // var clock = lolex.install();

  log.info('started', {config: config});

  bus.subscribe('test', log.debug);

  var some1 = new exp(1);
  var some2 = new exp(2);
  var some3 = new exp(3);

  some1.m();
  some1.m2();


  // var loop = setInterval(() => {
  //   clock.tick(1 * speed * unit);
  // }, 1 * t.s);

  // clock.next();

  // clock.next();

  // console.log('called');
  // var someShort = setTimeout(() => {
  //   console.log('someShort');
  // }, 5 * t.s);
  //
  // var someLong = setTimeout(() => {
  //   console.log('someLong');
  // }, 5 * t.d);
  //
  // setTimeout(() => {
  //   console.log('someGlobal');
  // }, 1 * t.d);
  //
  // clock.tick(5 * t.d);
  //
  // // clock.next();
  //
  // clock.uninstall();
});



// this.tick(5);


// // async function fn() {
// //   var x = await new Promise();
// // };

// let promise = new Promise((res, rej) => {
//   if (1 > 0) {
//     res(1, 2);
//   } else {
//     rej(3, 4);
//   }

// });

// promise
//   .then((a, b) => {
//     console.log(a + b);
//   })
//   .catch((c, d) => {
//     console.log(c + d);
//   });

// let promise2 = new Promise((res, rej) => {
//   if (1 > 0) {
//     res(2);
//   } else {
//     rej(3);
//   }

// });

// promise2
//   .then((res) => {
//     console.log(res ** 2);
//   })
//   .catch((rej) => {
//     console.log(rej ** 1);
//   });

// async function fn() {
//   var a1 = () => {
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log('here');
//         res(2);
//       }, 3000);
//     })
//   };
//   var a2 = () => {
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log('here2');
//         res(3);
//       }, 2000);
//     });
//   }
//   console.log('here');
//   console.log(1 + await a1() + await a2());
//   return 1 + await a1() + await a2();
// }

// setTimeout
// console.log(fn());

// console.log(3 > 3);
//
// ЭТО РАБОТАЕТ ПОЧТИ КАК НАДО
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// function Action (value, threshold, operator, times) {
//   return new Promise((resolve, reject) => {
//     let timeout = setTimeout(() => {
//       clearInterval(interval);
//       resolve(value);
//     }, 1000 * times);
//     let interval = setInterval(() => {
//       console.log('value: ' + value);
//       if (operator == 'inc') {
//         if (value > threshold) {
//           clearTimeout(timeout);
//           clearInterval(interval);
//           reject(value);
//         } else {
//           ++value;
//         }
//       } else {
//         if (value < threshold) {
//           clearTimeout(timeout);
//           clearInterval(interval);
//           reject(value);
//         } else {
//           --value;
//         }
//       }
//     }, 1000 * 1);
//
//   })
//   // .then(v => console.log('v:' + v))
//   ;
// }
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// async function Activity(...actions) {
//   // for (action of actions) {
//   //   await
//   // }
//   var a = await Action(1, 5, 'inc', 3);
//   console.log('a: ' + a);
//   var b = await Action(2, -2, 'dec', 3);
//   console.log('b: ' + b);
//   var c = await Action(3, 2, 'inc', 2);
//   console.log('c: ' + c);
//   return a + b + c;
// }
//
// var result = Activity()
//   .then(result => console.log('then: ' + result))
//   .catch(result => console.log('catch: ' + result));
//
// function Transition() {
//
// }
// let pms = new Promise((res, rej) => {
//   setTimeout(() => {
//     res(3);
//   }, 2000);
//   })
//   .then(res => {
//     console.log(res);
//     return res;
//   })
//   .catch(rej => {
//     return rej;
//   })
// ;

// setTimeout(() => {
//   console.log(pms);
// },4000);
//
//
// Sure the code does work, but I'm pretty sure it doesn't do what you expect it to do. It just fires off multiple asynchronous calls, but the printFiles function does immediately return after that.
//
// NOTE
// If you want to read the files in sequence, you cannot use forEach indeed. Just use a modern for … of loop instead, in which await will work as expected:
//
// async function printFiles () {
//   const files = await getFilePaths();
//
//   for (let file of files) {
//     const contents = await fs.readFile(file, 'utf8');
//     console.log(contents);
//   }
// }
// If you want to read the files in parallel, you cannot use forEach indeed. Each of the the async callback function calls does return a promise, but you're throwing them away instead of awaiting them. Just use map instead, and you can await the array of promises that you'll get with Promise.all:
//
// async function printFiles () {
//   const files = await getFilePaths();
//
//   await Promise.all(files.map(async (file) => {
//     const contents = await fs.readFile(file, 'utf8')
//     console.log(contents)
//   }));
// }

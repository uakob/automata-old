'use strict';

const config = require('../app/conf');

const assert = require('chai').assert;
const sinon = require('sinon');

var Mock = require('../app/app');
// const Mock = require('../app/app.js');

const step = config.app.test.step;
const person = config.app.test.person;

var clock;

describe('init and timeout', () => {
  before('stop time', () => {
    clock = sinon.useFakeTimers();
  });

  it('must be terminated after ' + step, done => {
    // console.log("app:"  + app);
    //
    // var testCredit = new Mock(undefined, undefined, step, person);
    // console.log("testCredit.update:" + testCredit.update);
    // console.log(testCredit.update);
    // console.log("Object.keys(testCredit):"  + Object.keys(testCredit));
    // clock.tick(3 * 1000);
    // console.log("testCredit.state.name: " + testCredit.state.name);
    // console.log("testCredit:"  + testCredit);
    // clock.tick(step * 1000 + 1000);
    // assert(testCredit.state.name == 'terminate');
    done();
  });

  after('start time', () => {
    clock.restore();
  });

});

//
// describe('test sinon timers', () => {
//   before('stop time', () => {
//     clock = sinon.useFakeTimers();
//   });
//
//   it('must be terminated after ' + step, (done) => {
//     var some = false;
//     // console.log("app:"  + app);
//     // var testCredit = new Mock(undefined, undefined, step, person);
//     // console.log("testCredit:"  + testCredit);
//     // console.log("Object.keys(testCredit):"  + Object.keys(testCredit));
//     setTimeout(() => {
//       some = true;
//     }, 5 * 1000);
//     clock.tick(4 * 1000);
//     console.log("some: " + some);
//     try {
//       assert.equal(some, true);
//       done();
//     } catch (e) {
//       done(e);
//     }
//   });
//
//   after('start time', () => {
//     clock.restore();
//   });
//
// });

// describe('init and timeout w/o timers', () => {
//   // before('stop time', () => {
//   //   clock = sinon.useFakeTimers();
//   // });
//
//   it('must be terminated after ' + step, () => {
//     // console.log("app:"  + app);
//     var testCredit = new Mock(undefined, undefined, step, person);
//     // console.log("testCredit:"  + testCredit);
//     // console.log("Object.keys(testCredit):"  + Object.keys(testCredit));
//     // clock.tick(step + 1000);
//     setTimeout(() => {
//       console.log("testCredit.state.name: " + testCredit.state.name);
//       assert(testCredit.state.name == 'terminate', 'credit terminated');
//     }, 20000);
//   });
//
//   // after('start time', () => {
//   //   clock.restore();
//   // });
//
// });

// TODO function check
'use strict';

require('babel-register');

const util = require('util');

// const bus = require('./bus');
const config = require('./conf');

const EventEmitter = require('events');
// import {observable} from "mobx";

const uuid = require('uuid/v4');

// function Timer(tick) {
//   this.tick = tick;
// }
//
// Timer.prototype.start = function(callback) {
//   this.timer = setInterval(() => {
//     callback();
//   }, 1000 * this.tick);
// };
//
// Timer.prototype.stop = function() {
//   clearInterval(this.timer);
// };

Mock.prototype.toJSON = function() {
  return {
    uuid: this.uuid,
    person: this.person,
    step: this.step,
    term: this.term,
    state: this.state.name,
    freud: this.freud,
    freuded: this.freuded,
    score: this.score,
    scored: this.scored,
    calc: this.calc,
    calculated: this.calculated,
    debt: this.debt,
    percent: this.percent,
    fine: this.fine,
    penalty: this.penalty,
    paid: this.paid,
  };
}

Mock.prototype.dispatch = function(event) {
  if (this.events.has(event)) {
    if (event in this.transitions.get(this.state.name)) {
      try {
        this.emit('event', {type: event, target: this.toJSON()});
        this.fireTransition(event);
      } catch (error) {
        throw error;
      }
    } else {
      throw ReferenceError(`${event} is not registered for transition binded to state`);
    }
  } else {
    throw ReferenceError(`${event} is not registered`);
  }
};

Mock.prototype.fireTransition = function(event) {

  var source = this.state;
  var transition = this.transitions.get(source.name)[event];
  var target = this.states.get(transition.target);

  var type = transition.type;
  var effect = transition.effect;
  var guard = transition.guard;

    try {
      if (source == target && type != 'self') {
        if (guard !== undefined && !guard()) throw new Error(`transition cannot be triggered: guard condition returned false`);
        if (effect !== undefined) effect();
        if ('activity' in this.state) this.state.activity();
      } else {
        if ('exit' in source) source.exit();
        if (guard !== undefined && !guard()) throw new Error(`transition cannot be triggered: guard condition returned false`);
        if (effect !== undefined) effect();
        this.state = target;
        this.emit('change', {type: event, target: this.toJSON()});

        // io.emit('update', {uuid: this.uuid, state: this.state.name});
        if ('enter' in this.state) this.state.enter();
        if ('activity' in this.state) this.state.activity();
      }
  } catch (e) {
    throw e;
  }
};

Mock.prototype.accrueDebt = function() {
  return new Promise((res, rej) => {
    this.debt = true;
    this.emit('signal', {type: 'debt', target: this.toJSON()});
    res();
  });
};

Mock.prototype.accruePercent = function() {
  return new Promise((res, rej) => {
    this.percent = true;
    this.emit('signal', {type: 'percent',target: this.toJSON()});
    res();
  });
}

Mock.prototype.accrueFine = function() {
  return new Promise((res, rej) => {
    this.fine = true;
    this.emit('signal', {type: 'fine', target: this.toJSON()});
    res();
  });
}

Mock.prototype.accruePenalty = function() {
  return new Promise((res, rej) => {
    this.penalty = true;
    this.emit('signal', {type: 'penalty', target: this.toJSON()});
    res();
  });
}

Mock.prototype.update = function() {

}

function Mock(_uuid, _state, step, term, person, params) {

  if (params == undefined) {
    this.restored = false;
    this.fparams = {};
    this.fparams.freud = false;
    this.fparams.freuded = false;
    this.fparams.score = false;
    this.fparams.scored = false;
    this.fparams.calc = false;
    this.fparams.calculated = false;
    this.fparams.debt = false;
    this.fparams.percent = false;
    this.fparams.fine = false;
    this.fparams.penalty = false;
    this.fparams.paid = false;
  } else {
    this.restored = true;
    this.fparams = params;
  }
  this.asgn = () => {
    this.uuid = _uuid || uuid();
    this.state = this.states.get(_state) || this.states.get('init');
    this.person = person;
    this.step = step;
    this.term = term;

    this.freud = this.fparams.freud;
    this.freuded = this.fparams.freuded;
    this.score = this.fparams.score;
    this.scored = this.fparams.scored;
    this.calc = this.fparams.calc;
    this.calculated = this.fparams.calculated;
    this.debt = this.fparams.debt;
    this.percent = this.fparams.percent;
    this.fine = this.fparams.fine;
    this.penalty = this.fparams.penalty;
    this.paid = this.fparams.paid;
    // this.state.enter();
  }

  this.init = () => {
    if (!this.restored) {
      this.state.enter();
    } else {
      this.state.restore();
    }
  }

  this.events = new Set(
    [
      'confirm',
      'expire',
      'fraudSuccess',
      'fraudFailure',
      'scoreSuccess',
      'scoreFailure',
      'calculated',
      'approve',
      'refuse',
      'delay',
      'payin',
      'payout',
      'close',
      'percent',
      'fine',
      'penalty',
      'accrueDebt',
      'accruePercent',
      'accrueFine',
      'accruePenalty',
      'accrue'
    ]
  );

  this.transitions = new Map([
    [
      'init',
      {
      'confirm': {'target': 'pending'},
      'expire':  {'target': 'terminate'}
      }
    ],
    [
      'pending',
      {
        'fraudSuccess': {
          'target': 'pending',
          'guard': () => {return !this.freud},
          'effect': () => {
            this.freud = true;
            this.emit('signal', {type: 'score', target: this.toJSON()});
            this.scored = true;
            this.emit('save', {type: 'fraudSuccess', target: this.toJSON()});
          }
        },
        'fraudFailure': {
          'target': 'pending',
          'guard': () => {return !this.freud},
          'effect': () => {
            this.emit('save', {type: 'fraudFailure', target: this.toJSON()});
            this.dispatch('refuse');
          }
        },
        'scoreSuccess': {
          'target': 'pending',
          'guard': () => {return this.freud && !this.score},
          'effect': () => {
            this.score = true;
            this.emit('signal', {type: 'calc', target: this.toJSON()});
            this.calculated = true;
            this.emit('save', {type: 'scoreSuccess', target: this.toJSON()});
          }
        },
        'scoreFailure': {
          'target': 'pending',
          'guard': () => {return this.freud && !this.score},
          'effect': () => {
            this.emit('save', {type: 'scoreFailure', target: this.toJSON()});
            this.dispatch('refuse');
          }
        },
        'calculated': {
          'target': 'pending',
          'guard': () => {return this.score && !this.calc},
          'effect': () => {
            this.calc = true;
            this.emit('signal', {type: 'approve', target: this.toJSON()});
            this.calculated = true;
            this.emit('save', {type: 'calculated', target: this.toJSON()});
          }
        },
        'approve': {
          'target': 'ready',
          guard: () => {
            return this.freud && this.score && this.calc;
          }
        },
        'refuse': {
          'target': 'terminate',
          effect: () => {
            this.emit('signal', {type: 'refuse', target: this.toJSON()});
          }
        }
      },
    ],
    [
      'ready',
      {
        'payout': {
          'target': 'run',
          effect: () => {
            this.paid = true;
          }
        },
        'refuse': {
          'target': 'terminate',
          effect: () => {
            this.emit('signal', {type: 'refuse', target: this.toJSON()});
          }
        }
      }
    ],
    [
      'run',
      {
        'accrue': {
          'type': 'internal',
          'target': 'run',
          'guard': () => {return (this.debt && this.percent)}
        },
        'delay': {
          'target': 'overdue',
          'guard': () => {return (this.debt && this.percent)}
        },
        'close': {
          'target': 'terminate',
          // 'guard': () => {return !(this.debt && this.percent)}
        },
      }
    ],
    [
      'overdue',
      {
        'accrue': {
          'type': 'internal',
          'target': 'overdue',
          'guard': () => {
            return (
              (this.debt && this.percent) && (this.fine && this.penalty)
            )
          }
        },
        'close': {
          'target': 'terminate',
          // 'guard': () => {
          //   return !(
          //     (this.debt && this.percent) && (this.fine && this.penalty)
          //   )
          // }
        },
      }
    ],
    [
    'terminate',
    {}
    ]
  ]);

  this.states = new Map([
    [
      'init',
      {
        name: 'init',
        enter: () => {
          this.emit('signal', {type: 'init', target: this.toJSON()});
          this.emit('change', {type: 'init', target: this.toJSON()});

          this.timeout = setTimeout(() => {
            this.emit('signal', {type: 'remind', target: this.toJSON()});
          }, 1000 * Math.round(this.step * 0.75));
          this.timer = setTimeout(() => {
            this.dispatch('expire');
          }, 1000 * this.step);
        },
        restore: () => {
          this.timeout = setTimeout(() => {
            this.emit('signal', {type: 'remind', target: this.toJSON()});
          }, 1000 * Math.round(this.step * 0.75));
          this.timer = setTimeout(() => {
            this.dispatch('expire');
          }, 1000 * this.step);
        },
        exit: () => {
          clearTimeout(this.timer);
          clearTimeout(this.timeout);
        },
      }
    ],
    [
      'pending',
      {
        name: 'pending',
        enter: () => {
          this.emit('signal', {type: 'pending', target: this.toJSON()});
        },
        activity: () => {
          if (!this.freud) {
            this.emit('signal', {type: 'fraud', target: this.toJSON()});
            this.freuded = true;
            this.emit('save', {type: 'fraudRequest', target: this.toJSON()});
          }
        },
        restore: () => {
          if (!this.freuded) {
            this.emit('signal', {type: 'fraud', target: this.toJSON()});
          } else if (!this.scored && this.freud) {
            this.emit('signal', {type: 'score', target: this.toJSON()});
          } else if (!this.calculated && this.score) {
            this.emit('signal', {type: 'calc', target: this.toJSON()});
          }
        }
      }
    ],
    [
      'ready',
      {
        name: 'ready',
        enter: () => {
          // this.paid = false;
          this.emit('signal', {type: 'payout', target: this.toJSON()});
          this.paid = true;
          this.emit('save', {type: 'payout', target: this.toJSON()});
        },
        restore: () => {
          if (!this.paid) {
            this.paid = true;
            this.emit('signal', {type: 'payout', target: this.toJSON()});
          }
        },
        exit: () => {}
      }
    ],
    [
      'run',
      {
        name: 'run',
        enter: () => {
          this.debt = false;
          this.percent = false;
          this.emit('signal', {type: 'approved', target: this.toJSON()});

          this.accrue = setInterval(() => {
            this.dispatch('accrue');
          }, 1000 * this.step);

          this.timeout = setTimeout(() => {
            this.dispatch('delay');
          }, 1000 * this.term);

          this.remind = setTimeout(() => {
            this.emit('signal', {type: 'delay_sms', target: this.toJSON()});
          }, 1000 * Math.round(this.term * 0.75));
        },
        restore: () => {
          this.accrue = setInterval(() => {
            this.dispatch('accrue');
          }, 1000 * this.step);

          this.timeout = setTimeout(() => {
            this.dispatch('delay');
          }, 1000 * this.term);

          this.remind = setTimeout(() => {
            this.emit('signal', {type: 'delay_sms', target: this.toJSON()});
          }, 1000 * Math.round(this.term * 0.75));

          if (!this.debt) {
            this.accrueDebt()
            .then(() => {
              if (!this.percent) {
                return this.accruePercent();
              } else {
                return Promise.resolve();
              }
            });
          }
        },
        activity: () => {
          this.debt = false;
          this.percent = false;
          this.accrueDebt()
          .then(() => {
            return this.accruePercent();
          });
        },
        exit: () => {
          clearInterval(this.accrue);
          clearTimeout(this.timeout);
          clearTimeout(this.remind);
        },
      }
    ],
    [
      'overdue',
      {
        name: 'overdue',
        enter: () => {
          this.debt = false;
          this.percent = false;
          this.fine = false;
          this.penalty = false;

          this.emit('signal', {type: 'overdue', target: this.toJSON()});
          this.emit('signal', {type: 'overdue_sms', target: this.toJSON()});

          this.timer = setInterval(() => {
            this.dispatch('accrue');
          }, 1000 * this.step);
        },
        restore: () => {
          this.timer = setInterval(() => {
            this.dispatch('accrue');
          }, 1000 * this.step);
          if (!this.debt) {
            this.accrueDebt()
            .then(() => {
              if (!this.percent) {
                return this.accruePercent();
              } else {
                return Promise.resolve();
              }
            })
            .then(() => {
              if (!this.fine) {
                return this.accrueFine();
              } else {
                return Promise.resolve();
              }
            })
            .then(() => {
              if (!this.penalty) {
                return this.accruePenalty();
              } else {
                return Promise.resolve();
              }
            });
          }
        },
        activity: () => {
          this.debt = false;
          this.percent = false;
          this.fine = false;
          this.penalty = false;

          this.accrueDebt()
            .then(() => {
                return this.accruePercent();
              }
            )
            .then(() => {
                return this.accrueFine();
              }
            )
            .then(() => {
                return this.accruePenalty();
              }
            );

        },
        exit: () => {
          clearInterval(this.timer);
        }
      }
    ],
    [
      'terminate',
      {
        name: 'terminate',
        enter: () => {
          try {
            this.emit('change', {type: 'terminated', target: this.toJSON()});
            this.emit('signal', {type: 'terminated', target: this.toJSON()});
            this.emit('signal', {type: 'offer', target: this.toJSON()});
            this
              .removeAllListeners('signal')
              .removeAllListeners('event')
              .removeAllListeners('change')
              .removeAllListeners('error');
          } catch (e) {
            this.emit('error', {type: 'not_terminated', target: this.toJSON()});
          }
        }
      }
    ]
  ]);

  try {
    this.asgn();
  } catch (e) {
      throw e;
  }

};

util.inherits(Mock, EventEmitter);

module.exports = Mock;

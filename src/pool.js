'use strict';

const bus = require('./bus');
const config = require('./conf');
const Machina = require('./machina');

// const EE = require('events');
// Pool.prototype = new EE();

function Pool() {

  this.anchor = 'POOL';

  // this.storage = new Set();
  // this.storage = [];
  this.storage = {};

  this.create = function(step, term, person) {
    return new Promise((resolve, reject) => {
      let credit = null;
      try {
        credit = new Machina(undefined, undefined, step, term, person);
        // this.storage.push(credit); // точно здесь или ниже сделать?
        credit
          .on('event', (event) => {
            bus.publish(`machina.event.${event.type}`, event);
          })
          .on('error', (event) => {
            bus.publish(`machina.error.${event.type}`, event);
          })
          .on('change', (event) => {
            if (event.type == 'terminated') {
              this.delete(event.target.uuid)
              .then((res) => {
                bus.publish(`machina.change.${event.type}`, event);
              })
              .catch((err) => {
                bus.publish(`machina.error.${event.type}`, event);
              });
            } else {
              bus.publish(`machina.change.${event.type}`, event);
            }
          })
          .on('save', (event) => {
            bus.publish(`machina.save.${event.type}`, event);
          })
          .on('signal', (event) => {
            bus.publish(`machina.signal.${event.type}`, event);
          });
        credit.init();
        this.storage[credit.uuid] = credit;
        resolve(credit.uuid);

      } catch (e) {
        bus.publish(`pool.error.${e.name}`, e);
        reject(e);
      }

    });
  };

  this.update = (uuid, event) => {
    return new Promise((resolve, reject) => {
        this.find(uuid)
        .then((credit) => {
          credit.dispatch(event);
          resolve('success');
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  this.read = function(collection) {
    return new Promise(() => {
      try {
        for (let index in collection.credits) {
          let credit = collection.credits[index];
          credit = new Machina(credit.uuid, credit.state, credit.step, credit.term, credit.person, credit);
          // this.storage.push(credit); // точно здесь или ниже сделать?
          credit
            .on('event', (event) => {
              bus.publish(`machina.event.${event.type}`, event);
            })
            .on('error', (event) => {
              bus.publish(`machina.error.${event.type}`, event);
            })
            .on('change', (event) => {
              if (event.type == 'terminated') {
                this.delete(event.target.uuid)
                .then((res) => {
                  bus.publish(`machina.change.${event.type}`, event);
                })
                .catch((err) => {
                  bus.publish(`machina.error.${event.type}`, event);
                });
              } else {
                bus.publish(`machina.change.${event.type}`, event);
              }
            })
            .on('save', (event) => {
              bus.publish(`machina.save.${event.type}`, event);
            })
            .on('signal', (event) => {
              bus.publish(`machina.signal.${event.type}`, event);
            });
            credit.init();
            this.storage[credit.uuid] = credit;
          }
        } catch (e) {
          bus.publish(`pool.error.${e.name}`, e);
        }
    });
  };

  this.find = (uuid) => {
    return new Promise((resolve, reject) => {
      if (this.storage.length == 0) {
        reject('pool is empty');
      }
      // let credit = this.storage.find((el, ind) => {if (el.uuid == uuid) return {credit: el, index: ind};}) || undefined;
      let credit = this.storage[uuid] || undefined;
      if (credit != undefined) {
        resolve(credit);
      } else {
        reject('credit not found');
      }
    });
  };

  this.list = () => {
    return new Promise((resolve, reject) => {
      if (this.storage.length == 0) {
        reject('pool is empty');
      }
      let credits = [];
      for (let credit in this.storage) {
        credits.push(this.storage[credit]);
      }
      resolve(credits);
    });
  };

  this.history = () => {
    return Promise.resolve(`not implemened yet`);
  };

  this.name = 'pool';
  this.delete = (uuid) => {
    return new Promise((resolve, reject) => {
        this.find(uuid)
        .then(credit => {
          credit
            .removeAllListeners('signal')
            .removeAllListeners('event')
            .removeAllListeners('change')
            .removeAllListeners('error');
            delete this.storage[uuid];
            resolve('deleted AGAIN');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  this.tick = () => {
    this.storage.forEach((el, ind) => {
      el.update();
    });
  }
};

const pool = new Pool();

bus.subscribe('db.read.success', (msg, data) => {
  pool.read(data)
  .then(res => {
    bus.publish(`pool.import.success`, {message: res});
  })
  .catch(err => {
    bus.publish(`pool.import.error`, {err: err});
  });
});

module.exports = pool;

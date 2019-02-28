'use strict';

require('babel-register');

const bus = require('./bus');

const config = require('./conf');

const EE = require('events');

var redis = require('redis');

var mongodb = require('mongodb');

DB.prototype = new EE();

// сделай таблицу соответствий
bus.subscribe('machina.change', (msg, data) => {
  // let credit = data.target;

  if (data.type == 'terminated') {
    db.redis.delete(data.target.uuid);
    db.mongodb.update(data.target, data.type);
  } else {
      db.redis.update(data.target.uuid, data.target.state);
      if (data.type == 'init') {
        db.mongodb.create(data.target, data.type);
      } else {
        db.mongodb.update(data.target, data.type);
      }
  }
});

bus.subscribe('machina.save', (msg, data) => {
  db.mongodb.update(data.target, data.type);
});

function DB() {
  this.anchor = 'DB';

  this.redis = redis.createClient(config.db.redis);

  this.redis.select(config.db.redis.db, (err, res) => {
    if (!err) {
      bus.publish(
        `db.redis.connection.success`,
        {
          host: config.db.redis.host,
          port: config.db.redis.port
        });
    } else {
      bus.publish(`db.redis.connection.error`, error);
    }
  });

  // TODO promisify ad least, async is better way
  // NOTE CANNOT because node-redis lacks support of native ES6 promises for now
  this.redis.read = () => {
    return new Promise((resolve, reject) => {
      let credits = [];
      this.redis.dbsize((error, result) => {
        if (!error) {
          if (result != 0) {
            this.redis.keys('*', (e, keys) => {
              if (e) reject(e);
              for (let key of keys) {
                let uuid = key.replace(/^credit:/, '');
                this.redis.hgetall(key, (e, value) => {
                  if (e) reject(e);
                  credits.push({uuid: uuid, state: value.state});
                });
              }
            });
          }
          resolve(credits);
        } else {
          reject(error);
        }
      });
    });
  }

  this.redis.update = (uuid, state) => {
    // return new Promise((resolve, reject) => {
      this.redis.hmset(
        uuid,
        {state: state},
        (error, res) => {
          if (!error) {
            bus.publish(`db.redis.save`);
            // resolve();
          } else {
            bus.publish(`db.redis.error`, error);
            // reject(error);
          }
        }
      );
    // });
  };

  this.redis.delete = (uuid) => {
    // return new Promise((resolve, reject) => {
      this.redis.del(uuid,
        (err, res) => {
          if (!err) {
            bus.publish(`db.redis.delete`);
            // resolve();
          } else {
            bus.publish(`db.redis.error`, err);
            // reject(err);
          }
        }
      );
    // });
  };

  this.mongodb = {};
  this.mongodb.client = new mongodb.MongoClient();
  // this.mongodb.db = null;

  this.mongodb.client.connect(config.db.mongodb.dsn)
  // mongodb.connect(config.db.mongodb.dsn)
    .then((db) => {
      this.mongodb.db = db;
    })
    .then(() => {
      return this.mongodb.db.collection('actual');
    })
    .then((collection) => {
      this.mongodb.collection = collection;
      bus.publish(`db.mongodb.connection.success`, {
        dsn: config.db.mongodb.dsn,
        collection: this.mongodb.collection.collectionName,
      });
    })
    .catch((error) => {
      bus.publish(`db.mongodb.connection.error`, {error: error});
    })
    .then(() => {
      return this.mongodb.read();
    })
    .then(result => {
      bus.publish(`db.read.success`, {credits: result});
    })
    .catch(error => {
      bus.publish(`db.read.error`, {error: error});
    });

    this.mongodb.read = () => {
      return new Promise((resolve, reject) => {
        resolve(this.mongodb.collection.find({state: {$ne: 'terminate'}}).toArray());
      });
    };

    this.mongodb.create = (credit, event) => {
      // return new Promise((resolve, reject) => {

      return new Promise((resolve, reject) => {
        let log = {
          date: new Date(),
          event: event,
          state: credit.state
        };
        this.mongodb.collection.updateOne({uuid: credit.uuid}, {$set: credit}, {upsert: true})
        .then((res) => {
          return this.mongodb.collection.updateOne({uuid: credit.uuid}, {$push: {'log': log}})
        })
        .then((res) => {
            resolve('updated');
        })
        .catch((error) => {
          reject(error);
        });
      });
        // return this.mongodb.collection.updateOne({uuid: credit.uuid}, {credit, $push: {'log': log}}, {upsert: true});
      // });
    }

    this.mongodb.update = (credit, event) => {
      // return new Promise((resolve, reject) => {
      let log = {
        date: new Date(),
        event: event,
        state: credit.state
      };
      return new Promise((resolve, reject) => {
        this.mongodb.collection.updateOne({uuid: credit.uuid}, {$set: credit}, {upsert: true})
        .then((res) => {
          return this.mongodb.collection.updateOne({uuid: credit.uuid}, {$push: {'log': log}})
        })
        .then((res) => {
            resolve('updated');
        })
        .catch((error) => {
          reject(`error: ${error}`);
        });
      });
      // return this.mongodb.collection.updateOne({uuid: credit.uuid}, {credit, $push: {'log': {log}}}, {upsert: true});
      // });
    };

    this.mongodb.delete = (credit) => {
      return this.mongodb.collection.deleteOne({uuid: credit.uuid});
    };

    //
    // Credit.find({}, {__v: false, _id: false, step: false, term: false}, (err, docs) => {
    // Credit.find({uuid: creditId}, {log: 1}, (err, docs) => {
    // Credit.find({person: pid}, {__v: false, _id: false, step: false, term: false}, (err, docs) => {
}

const db = new DB();
// setTimeout(() => {
//   db.mongodb.read()
//     .then(result => {
//       bus.publish(`db.read.success`, {credits: result});
//     })
//     .catch(error => {
//       bus.publish(`db.read.error`, {error: error});
//     });
// }, 5000);

bus.publish(`db.import.success`, {message: 'start'});
module.exports = db;

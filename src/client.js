'use strict';

require('babel-register');

const EventEmitter = require('events');

const bus = require('./bus');
const config = require('./conf');

var superagent = require('superagent');

function Client() {
  this.send = (message, data) => {
    var template = messages.get(data.type);
    var msg = {
      ...config.msg.all,
      ...config.msg[template.to],
      data: {
        ...template.body,
        credit_uuid: data.target.uuid,
        person_token: data.target.person
      }
    };


    superagent(config.gate.method, config.gate.url)
    .set(config.gate.headers)
    .send(msg)
    .then((res) => {
      // logger.info('success': {response: res.body});
      bus.publish('client.success', res.body);
    })
    .catch((err) => {
      bus.publish('client.error', err.body);
      // logger.error('superagent: error', err);
    });
  }

};

const messages = new Map([
  [
    'init',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'createCreditByUUID',
        message: `You want a piece of me boy?`,
      }
    },
  ],
  [
    'pending',
    {
      to: "connect",
      body: {
        action: "insert",
        service_action: "fsmSMSMessage",
        template_name: "application_pending",
        message: "i'm going to cum....",
      }
    }
  ],
  [
    'fraud',
    {
      to:'fraud',
      body: {
        action: 'insert',
        service_action: 'doFraud',
        message: `Identifizierung mit dem Angreifer!`,
      }
    },
  ],
  [
    'score',
    {
      to: 'scoring',
      body: {
        action: 'insert',
        service_action: 'doScoring',
        message: `check me out baby`,
      }
    }
  ],
  [
    'calc',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'paymentPlanCreate',
        message: `Let's kick some ICE!`,
      }
    }
  ],
  [
    'approve',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'application_pending_not_fully_approved',
        message: `Gold needed`,
      }
    }
  ],
  [
    'refuse',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'application_result_decline',
        message: `BUSTED`,
      }
    },
  ],
  [
    'payout',
    {
      to:'gate',
      body: {
        action: 'insert',
        service_action: 'payout',
        message: `Let's kick some ICE`,
      }
    },
  ],
  [
    'remind',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'stimulation',
        message: `To be, or not to be: that is the question.`,
      }
    },
  ],
  [
    'debt',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'accrueDebt',
        message: `Build more farms`,
      }
    }
  ],
  [
    'percent',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'accruePercent',
        message: `incefition vespene gas`,
      }
    },
  ],
  [
    'fine',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'accrueFine',
        message: `Not enough minerals`,
      }
    },
  ],
  [
    'penalty',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'accruePenalty',
        message: `We are under attack!`,
      }
    }
  ],
  [
    'approved',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'creditApprove',
        message: `let's burn!`,
      }
    },
  ],
  [
    'delay_sms',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'credit_past_due',
        message: `delay is coming, baby`,
      }
    },
  ],
  [
    'overdue',
    {
      to:'api',
      body: {
        action: 'insert',
        service_action: 'creditOverdue',
        message: `FINISH HIM`,
      }
    },
  ],
  [
    'overdue_sms',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'return_past_due_loan',
        message: `Hasta la vista, baby`,
      }
    },
  ],
  [
    'terminated',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'creditTerminate',
        message: `credit has been terminated`,
      }
    },
  ],
  [
    'offer',
    {
      to: 'connect',
      body: {
        action: 'insert',
        service_action: 'fsmSMSMessage',
        template_name: 'take_again',
        message: `Again you disturb me!`,
      }
    },
  ],
  [
    'not_terminated',
    {
      to: 'api',
      body: {
        action: 'insert',
        service_action: 'creditTerminateFuckedUp',
        message: `credit has not been terminated`,
      }
    }
  ]
]);
// console.log(`client imported`);
const client = new Client();
bus.subscribe('machina.signal', client.send);
bus.publish('client.import.success');
module.exports = client;

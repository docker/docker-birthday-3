'use strict';
var debug = require('debug')('wit:voting')
var Voter = require('../lib/Voter');

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('../').Wit;

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
            Array.isArray(entities[entity]) &&
            entities[entity].length > 0 &&
            entities[entity][0].value
        ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};

const token = (() => {
    if (process.argv.length !== 3) {
        console.log('usage: node examples/template.js <wit-token>');
        process.exit(1);
    }
    return process.argv[2];
})();

const actions = {
    say: (sessionId, context, message, cb) => {
        console.log(message);
        cb();
    },

    merge: (sessionId, context, entities, message, cb) => {
        // Retrieve the voting_cast-a-vote/voting_show-result entity and store it into a context field
        const action = firstEntityValue(entities, 'voting_cast_a_vote') ||
            firstEntityValue(entities, 'voting_show_result');
        if (action) {
            context.action = action;
        }

        // Retrieve the voting_vote-option entity and store it into a context field
        const option = firstEntityValue(entities, 'voting_vote_option');
        if (option) {
            context.option = option;
        }

        // Retrieve the contact entity and store it into a context field
        const contact = firstEntityValue(entities, 'contact');
        if (contact) {
            context.contact = contact;
        }

        debug('merge', 'entities', entities);
        debug('merge', 'context', context);

        cb(context);
    },

    error: (sessionId, context, err) => {
        console.log(err.message);
    },

    'cast-a-vote': (sessionId, context, cb) => {
        context.result = 'You ....';

        debug('cast-a-vote', 'context', context);

        var voter = new Voter();
        var option;

        voter.name = context.contact;

        if (context.option == 'option 1') {
            option = 'a';
        }
        else {
            option = 'b';
        }

        debug('cast-a-vote', 'option', option);

        voter.vote(option, function (err, res) {
            cb(context);
        });
    },

    'show-result': (sessionId, context, cb) => {
        (new Voter()).result(function (err, res) {
            var data = JSON.parse(res);
            var a = parseInt(data.a || 0);
            var b = parseInt(data.b || 0);

            var aPercent = 50;
            var bPercent = 50;
            var total = a + b;

            if (a + b > 0) {
                aPercent = a / (a + b) * 100;
                bPercent = b / (a + b) * 100;
            }

            debug('show-result', res);
            debug('show-result', {
                total: total,
                a: a,
                b: b,
                a_percent: aPercent,
                b_percent: bPercent
            });

            context.result_option_a = aPercent.toFixed(2);
            context.result_option_b = (100 - aPercent).toFixed(2);

            debug('show-result', context);

            cb(context);
        });
    }
};

const client = new Wit(token, actions);

client.interactive();

var faker = require('faker');
var FNV = require('fnv').FNV;
var request = require('request');
var URL = require('url');

function Voter() {
    return {
        name: undefined,
        hash: function (name) {
            var h = new FNV();
            h.update(Buffer(name));
            return h.digest('hex');
        },
        vote: function (option, callback) {
            // Calculate the vote id based on the name.

            if (this.name == undefined) {
                this.name = faker.name.firstName();
            }

            var id = this.hash(this.name);

            console.log(id, this.name, 'votes for option "' + option + '"');

            // Formulate the form data.
            var formData = {
                vote_id: id,
                vote: option
            };
            
            // Cast the vote
            var hostname = process.env.VOTING_HOSTNAME || "voting-app";
            var port = process.env.VOTING_PORT || 80;
            var url = URL.format({
                protocol: 'http',
                hostname: hostname,
                port: port
            });

            request.post(
                {
                    url: url,
                    formData: formData
                },
                function (err, res, body) {
                    if (err) {
                        console.log('post failed:', err);
                        return callback(err, null);
                    }
                    // console.log('post succeeded: ', res, body);
                    return callback(null, true);
                }
            );

            // return true;
        },
        result: function (callback) {
            // Get the vote result
            var hostname = process.env.RESULT_HOSTNAME || "result-app";
            var port = process.env.RESULT_PORT || 80;
            var pathname = "/result";
            var url = URL.format({
                protocol: 'http',
                hostname: hostname,
                port: port,
                pathname: pathname
            });
            request.get(
                {
                    url: url
                },
                function (err, res, body) {
                    if (err) {
                        console.log('get result failed:', err);
                        return callback(err, null);
                    }
                    // console.log('get result succeeded: ', res, body);
                    console.log('get result succeeded: ', body);

                    return callback(null, body);
                }
            );
        }
    };
}

Voter.RandomizeOption = function() {
    return Math.floor(Math.random() * 2);
}


Voter.Options = [
    'a',
    'b'
];

module.exports = Voter;
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
        vote: function (option) {
            // Calculate the vote id based on the name.
            var id = this.hash(this.name);

            console.log(id, this.name, 'votes for option "' + option + '"');

            // Formulate the form data.
            var formData = {
                vote_id: id,
                vote: option
            };

            // Cast the vote
            var hostname = "voting-app";
            var port = process.env.PORT || 80;
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
                        return console.log('post failed:', err);
                    }
                    // console.log('post succeeded: ', res, body);
                }
            );

            return true;
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
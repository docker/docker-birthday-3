var faker = require('faker');
var Voter = require('./lib/Voter');

setInterval(
    function () {
        var voter = new Voter();
        voter.name = faker.name.firstName();

        var option = Voter.Options[Voter.RandomizeOption()];
        voter.vote(option);
    }, 1000
);

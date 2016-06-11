var request = require('request');
var async = require('async');

var totalCalls = 0;

var testStart;
var testEnd;

var totalResponseTimes = 0;
var totalResponses = 0;
var totalRequests = 0;
var maxConcurent;
var url;
var maxCalls;
var voteOption;

function main () {
  maxConcurent = process.env.MAX_CONCURRENT || 10;
  url = process.env.VOTING_URL;
  maxCalls = process.env.MAX_CALLS || 10;
  voteOption = process.env.VOTE || "Python";

  if(voteOption == "Python") {
    voteOption = "b";
  } else {
    voteOption = "a";
  }

  if(!url) {
    console.log("Give VOTING_URL. MAX_CALLS and MAX_CONCURRENT are optional.")
  }

  testStart = new Date().getTime();
  var q = async.queue(function(task, cb) {
    post_vote(cb);
  }, maxConcurent);
  q.drain = function () {
    tally();
  }
  for(var i =0;i< maxCalls;i++) {
    q.push({id: i});
  }
}

function tally() {
  testEnd = new Date().getTime();

  console.log("\nTallying data");
  console.log("Average response time: "  + (totalResponseTimes /  totalResponses).toFixed(2) + "ms");
  console.log("Total requests/responses: " + totalRequests+ " / " + totalResponses);
  console.log("Total run time of tests: " +((testEnd-testStart) / 1000).toFixed(2) + "ms");
  process.exit();
}

function post_vote(cb) {
  var ticksStart = new Date().getTime();
  totalRequests=totalRequests+1;
  request.post(url, {form: {"vote": voteOption}},
    function(err, res, body) {
      if(err) {
        console.error(err);
        return cb();
      }
      var ticksEnd = new Date().getTime();

      var total = ticksEnd - ticksStart;
      totalResponses += 1;
      totalResponseTimes += total;

      process.stdout.write(".")
      totalCalls = totalCalls +1;

      cb();
    });
}

process.on('SIGINT', function() {
  tally();
})


main();

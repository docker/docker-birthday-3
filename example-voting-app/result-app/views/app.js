/* var app = angular.module('javavspython', ['chartjs-directive']); */
var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

// var bg1 = document.getElementById('background-stats-1');
// var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope,$http) {
  /* var animateStats = function(a,b){
    if(a+b>0){
      var percentA = a/(a+b)*100;
      var percentB = 100-percentA;
      bg1.style.width= percentA+"%";
      bg2.style.width = percentB+"%";
    }
  };

  $scope.aPercent = 50;
  $scope.bPercent = 50;
  $scope.buttonPush = function() {
    $http({
  method: 'GET',
      url: '/postconfig'
    }).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      console.log(response);
    });
  } */
  var updateScores = function(){
    
    socket.on('scores', function (json) {
      // console.log("json: " + json);
      // showOldChart(json);
      buildChartData(json);
    });
  };

  /* var showOldChart = function(json) {
    data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);

       animateStats(a, b);

       $scope.$apply(function() {
         if(a + b > 0){
           $scope.aPercent = a/(a+b) * 100;
           $scope.bPercent = b/(a+b) * 100;
           $scope.total = a + b
         }
      });
  } */

  var buildChartData = function(json) {
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("voteChart").getContext("2d");

    var data = [];

    var voteData = eval("(" + json + ")");
    // console.log(voteData);
    for (var programming_language in voteData) {
      if (voteData.hasOwnProperty(programming_language)) {
        // console.log(programming_language + " -> " + voteData[programming_language]);
        data.push({
            value: voteData[programming_language],
            label: programming_language
          });
      }
    }
    // console.log(data);
    /* var data = [
                  {
                      value: 300,
                      label: "Red"
                  },
                  {
                      value: 50,
                      label: "Green"
                  },
                  {
                      value: 100,
                      label: "Yellow"
                  }
              ]; */

    var options = Chart.defaults.Pie;

    var votePieChart = new Chart(ctx).Pie(data, options);
    var voteChartLegend = votePieChart.generateLegend();
    document.getElementById("voteChartLegend").innerHTML = voteChartLegend;
    // console.log(myNewChart);

    // $scope.voteChart = {"data": data, "options": {} };
  }

  var init = function(){
    // document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message', function(data) {
    init();
  });
});

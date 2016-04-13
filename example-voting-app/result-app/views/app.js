var app = angular.module('javavspython', ['chartjs-directive']);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope,$http){
  var animateStats = function(a,b){
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
  }
  var updateScores = function(){
    socket.on('scores', function (json) {
       // showOldChart(json);
       buildChartData(json);
    });
  };

  var showOldChart = function(json) {
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
  }

  var buildChartData = function(json) {
    var data = {
      labels : ["January","February","March","April","May","June","July"],
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : [65,59,90,81,56,55,40]
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : [28,48,40,19,96,27,100]
        }
      ]
    }

    $scope.voteChart = data;
  }

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

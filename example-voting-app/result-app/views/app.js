var app = angular.module('javavspython', []);
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

  $scope.optionA = "Option A";
  $scope.optionB = "Option B";
  $scope.aTotal = 0;
  $scope.bTotal = 0;
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
  };

  var updateOptions = function(){
    socket.on('options', function (json) {
      data = JSON.parse(json);
      $scope.optionA = data.option_a;
      $scope.optionB = data.option_b;
    });
  };
  
  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);
       $scope.aTotal = a;
       $scope.bTotal = b;

       animateStats(a, b);

       $scope.$apply(function() {
         if(a + b > 0){
           $scope.aPercent = a/(a+b) * 100;
           $scope.bPercent = b/(a+b) * 100;
           $scope.total = a + b
         }
      });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateOptions();
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

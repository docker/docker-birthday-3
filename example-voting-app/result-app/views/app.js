var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var bg3 = document.getElementById('background-stats-3');
var bg4 = document.getElementById('background-stats-4');
var bg5 = document.getElementById('background-stats-5');
var bg6 = document.getElementById('background-stats-6');
var bg7 = document.getElementById('background-stats-7');
var bg8 = document.getElementById('background-stats-8');
var bg9 = document.getElementById('background-stats-9');
var bg10 = document.getElementById('background-stats-10');

app.controller('statsCtrl', function($scope,$http){
  var animateStats = function(a,b,c,d,e,f,g,h,i,j){
    if(a+b+c+d+e+f+g+h+i+j>0){
      var percentA = a/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentB = b/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentC = c/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentD = d/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentE = e/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentF = f/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentG = g/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentH = h/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentI = i/(a+b+c+d+e+f+g+h+i+j)*100;
      var percentJ = j/(a+b+c+d+e+f+g+h+i+j)*100;

      bg1.style.width= percentA+"%";
      bg2.style.width = percentB+"%";
      bg3.style.width= percentC+"%";
      bg4.style.width = percentD+"%";
      bg5.style.width= percentE+"%";
      bg6.style.width = percentF+"%";
      bg7.style.width= percentG+"%";
      bg8.style.width = percentH+"%";
      bg9.style.width= percentI+"%";
      bg10.style.width = percentJ+"%";
    }
  };

  $scope.aPercent = 10;
  $scope.bPercent = 10;
  $scope.cPercent = 10;
  $scope.dPercent = 10;
  $scope.ePercent = 10;
  $scope.fPercent = 10;
  $scope.gPercent = 10;
  $scope.hPercent = 10;
  $scope.iPercent = 10;
  $scope.jPercent = 10;

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
       data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);
       var c = parseInt(data.c || 0);
       var d = parseInt(data.d || 0);
       var e = parseInt(data.e || 0);
       var f = parseInt(data.f || 0);
       var g = parseInt(data.g || 0);
       var h = parseInt(data.h || 0);
       var i = parseInt(data.i || 0);
       var j = parseInt(data.j || 0);

       animateStats(a, b, c, d, e, f, g, h, i, j);

       $scope.$apply(function() {
         if(a + b + c + d + e + f + g + h + i + j > 0){
           $scope.aPercent = a/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.bPercent = b/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.cPercent = c/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.dPercent = d/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.ePercent = e/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.fPercent = f/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.gPercent = g/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.hPercent = h/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.iPercent = i/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.jPercent = j/(a+b+c+d+e+f+g+h+i+j) * 100;
           $scope.total = a + b + c + d + e + f + g + h + i + j
         }
      });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

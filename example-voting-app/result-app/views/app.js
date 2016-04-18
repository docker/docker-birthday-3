var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

var markers = [];
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.780, lng: -122.394}
  });
}

function createMarker(width, height, option) {

  var canvas, context;

  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");

  context.clearRect(0,0,width,height);

  // background color
  if ( option == 'a' )
    context.fillStyle = "#2196f3";
  else
    context.fillStyle = "#00cbca";

  // border is black
  context.strokeStyle = "rgba(0,0,0,1)";

  radius = 4;

  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(width - radius, 0);
  context.quadraticCurveTo(width, 0, width, radius);
  context.lineTo(width, height - radius);
  context.quadraticCurveTo(width, height, width - radius, height);
  context.lineTo(radius, height);
  context.quadraticCurveTo(0, height, 0, height - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();

  context.fill();
  context.stroke();

  return canvas.toDataURL();
}

function addMarkerWithTimeout(vote, timeout) {
  window.setTimeout(function() {
    var position = {lat:vote.loc.x, lng:vote.loc.y};
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: createMarker(2*map.getZoom(), 2*map.getZoom(), vote.vote)
    }));
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

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

  $scope.votes = [];
  function getVoteLocations(offset) {
    $http({
    method: 'GET',
        url: '/vote_locs?from='+offset||0
      }).then(function successCallback(response) {
        var votes = response.data;
        for (var i=0; i < votes.length; i++) {
          addMarkerWithTimeout(votes[i], i);
          $scope.votes.push(votes[i]);
        }
        if ( votes.length > 0) {
          var center = new google.maps.LatLng(votes[votes.length-1].loc.x, votes[votes.length-1].loc.y);
          map.setCenter(center, 4);
        }
      }, function errorCallback(response) {
        console.log(response);
      });
  }

  $scope.total_votes = 0;
  var updateScores = function(){
    socket.on('scores', function (json) {
      data = JSON.parse(json);
      var a = parseInt(data.a || 0);
      var b = parseInt(data.b || 0);
      
      if ( $scope.total_votes != a+b) {
        var count = $scope.votes.length;
        getVoteLocations(count);
        $scope.total_votes = a+b;
      }

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
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

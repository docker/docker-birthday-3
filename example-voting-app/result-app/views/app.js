var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

var markers = [];
var map;
var markerCluster;

window.onload = function() {
  initMap();
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {lat: 37.780, lng: -122.394},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var clusterStyles = [
    {
      textColor: 'black',
      url: 'stylesheets/a.png',
      height: 50,
      width: 50
    },
   {
      textColor: 'black',
      url: 'stylesheets/b.png',
      height: 50,
      width: 50
    },
   {
      textColor: 'black',
      url: 'stylesheets/ab.png',
      height: 50,
      width: 50,
      textSize: 10
    }
  ];

  var mcOptions = {
    gridSize: 50,
    styles: clusterStyles,
    maxZoom: 10
  };

  markerCluster = new MarkerClusterer(map, markers, mcOptions);
  markerCluster.setCalculator(computeCluster);
}

function computeCluster(markers) {
  var a = 0;
  var b = 0;
  for (var i = 0;i < markers.length; i++) {
    if ( markers[i].vote === "a" )
      a++;
    else
      b++;
  }

  var percentA = a/(a+b)*100;
  var percentB = 100-percentA;

  percentA = percentA.toFixed(0);
  percentB = percentB.toFixed(0);

  // different index for different icons showed on cluster maker.
  var text = '50/50';
  var index = 3;
  if ( percentA > percentB ) {
    index = 1;
    text = percentA+"%";
  }
  if ( percentB > percentA ) {
    index = 2;
    text = percentB+"%";
  }
  return {
    text: text,
    title: "One:"+percentA+"%\n"+"Two:"+percentB+"%",
    index: index
  };
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
    var marker = new google.maps.Marker({
      position: position,
      animation: google.maps.Animation.DROP,
      icon: createMarker(10, 10, vote.vote)
    });
    marker.vote = vote.vote;
    markers.push(marker);
    markerCluster.addMarker(marker);
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

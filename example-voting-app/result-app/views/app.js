var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

app.controller('statsCtrl', function($scope,$http) {
  // update scores in Chart
  var updateScores = function() {
    // upon etting updated scores, take some action on that data
    socket.on('scores', function (json) {
      buildChartData(json);
    });
  };

  var buildChartData = function(json) {
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("voteChart").getContext("2d");

    var data = [];

    var voteData = eval("(" + json + ")");
    // console.log(voteData);
    for (var programming_language in voteData) {
      if (voteData.hasOwnProperty(programming_language)) {
        data.push({
            value: voteData[programming_language],
            label: programming_language
          });
      }
    }
    
    // set chart options including legend template and animation
    var options = Chart.defaults.Doughnut;
    
    // A legend template
    options.legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\">\
                              <% for (var i=0; i<segments.length; i++){%>\
                                <li style=\"color:<%=segments[i].fillColor%>\">\
                                  <span style=\"background-color:<%=segments[i].fillColor%>\"></span>\
                                  <%if(segments[i].label){%><%=segments[i].label%>: <%=segments[i].value%><%}%>\
                                </li>\
                              <%}%></ul>";

    // options.animateScale = true;
    
    var voteDoughnutChart = new Chart(ctx).Doughnut(data, options);
    var voteChartLegend = voteDoughnutChart.generateLegend();
    document.getElementById("voteChartLegend").innerHTML = voteChartLegend;
  }

  var init = function(){
    updateScores();
  };
  socket.on('message', function(data) {
    init();
  });
});

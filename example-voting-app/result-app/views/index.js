var myPieChart;
$(document).ready(function () {
    var socket = io({transports:['polling']});
    var ctx = $("#myChart").get(0).getContext("2d");
    myPieChart= new Chart(ctx).Pie([]
        ,{animation: true,
            animationSteps: 5,
            animationEasing: "linear"});

    var updateScores = function(){
        socket.on('scores', function (jsonData) {
            var json = JSON.parse(jsonData);
            for(var element in json){
                var found = false;
                for(var segment in myPieChart.segments){
                    if(myPieChart.segments[segment].label == json[element].label){
                        found = true;
                        if(myPieChart.segments[segment].value != json[element].value){
                            myPieChart.segments[segment].value = json[element].value;
                        }
                    }
                }
                if(found==false){
                    myPieChart.addData(json[element]);
                }
            }
            myPieChart.update();
        });
    };
    var init = function(){
        updateScores();
    };
    socket.on('message',function(data){
        init();
    });

});
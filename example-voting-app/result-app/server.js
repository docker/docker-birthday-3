var express = require('express'),
    async = require('async'),
    pg = require("pg"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    request = require('request-json');

io.set('transports', ['polling']);

var port = process.env.PORT || 4000;

io.sockets.on('connection', function (socket) {

  socket.emit('message', { text : 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

var query = require('./views/config.json');

async.retry(
  {times: 1000, interval: 1000},
  function(callback) {
    pg.connect('postgres://postgres@db/postgres', function(err, client, done) {
      if (err) {
        console.error("Failed to connect to db");
      }
      callback(err, client);
    });
  },
  function(err, client) {
    if (err) {
      return console.err("Giving up");
    }
    console.log("Connected to db");
    getVotes(client);
  }
);

function postBirthday() {
  if(query && query.vote != "Cat"){
    var client = request.createClient('http://dockerize.it/');
    client.post('competition',
    query,function(err, res, body){
      if(err) console.log("error:"+err);
      if(res.statusCode == 200) {
        var body = res.body.response;
        console.log(body);
      }
    });
  } else {
    console.log('Please update example-voting-app/result-app/views/config.json before submitting your entry.');
    console.log('You will need to change the name, location, repository names, and vote.');
    console.log('You will need to stop this container and remove it, then run docker-compose up -d again.');
  }
}
function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i){
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "#00000".substring(1, 6 - c.length) + c;
}
function color(h,s,v) {
  var	h_i	= Math.floor(h*6),
      f 	= h*6 - h_i,
      p	= v * (1-s),
      q	= v * (1-f*s),
      t	= v * (1-(1-f)*s),
      r	= 255,
      g	= 255,
      b	= 255;
  switch(h_i) {
    case 0:	r = v, g = t, b = p;	break;
    case 1:	r = q, g = v, b = p;	break;
    case 2:	r = p, g = v, b = t;	break;
    case 3:	r = p, g = q, b = v;	break;
    case 4: r = t, g = p, b = v;	break;
    case 5: r = v, g = p, b = q;	break;
  }
  return [Math.floor(r*256),Math.floor(g*256),Math.floor(b*256)];
};
function getVotes(client) {
  client.query('SELECT language as vote, SUM(counter) AS count FROM votes GROUP BY language', [], function(err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      var total = 0;
      for (var key in result.rows) {
        total += (+result.rows[key].count);
      };
      var data = [];
      for (var key in result.rows) {
        var name = result.rows[key].vote
        data.push({'label':name,'color':intToRGB(hashCode(name+name+name)), 'value':parseFloat((result.rows[key].count*100)/total).toFixed(2)});
      };
      io.sockets.emit("scores", JSON.stringify(data));
    }

    setTimeout(function() {getVotes(client) }, 1500);
  });
}

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

app.get('/postconfig', function(req,res) {

  postBirthday();
  res.sendStatus(200);
}
);

app.get('/getconfig', function(req,res){
  res.type('application/json');
  res.status(200);
  res.send(JSON.stringify(query));

});

server.listen(port, function () {

  var port = server.address().port;
  console.log('App running on port ' + port);
});

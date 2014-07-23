var auth = require('http-auth');
var basic = auth.basic({
        realm: "Snapshot"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "snap" && password === "naphot");
    }
);

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    uid = require('rand-token').uid;

var port = Number(process.env.PORT || 4444);

app.use(auth.connect(basic));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


io.on('connection', function (socket){

  socket.emit('token', socket.id);

  socket.on('newSnapshot', function (pkg){
    console.log(socket.id);
    var data = {
      uri: pkg.uri,
      token: pkg.token
    };
    socket.broadcast.emit('updateSnapshot', data);
  });

  socket.on('disconnect', function () {
    io.emit('removeSnapshot', {token: socket.id});
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

// set variables
var port = Number(process.env.PORT || 4444);
var interval = (1000 * 10);
var authCreds = {
  username: 'snap',
  password: 'naphot'
};

// requires
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    uid = require('rand-token').uid;

// setup basic auth
var auth = require('http-auth');
var basic = auth.basic({
        realm: "Snapshot"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === authCreds.username && password === authCreds.password);
    }
);
app.use(auth.connect(basic));

// serve public files
app.use(express.static(__dirname + '/public'));

// serve index file
app.get('/', function(req, res){
  res.sendfile('index.html');
});

// socket
io.on('connection', function (socket){
  socket.broadcast.emit('getSnapshot');

  // send token to app
  socket.emit('token', socket.id);

  // trigger new snapshot on interval
  setInterval(function () {
    socket.emit('getSnapshot');
  }, interval);

  // on newSnapshot broadcast to sockets
  socket.on('newSnapshot', function (pkg){
    socket.broadcast.emit('updateSnapshot', pkg);
  });

  // on disconnect remove snapshots from connected sockets
  socket.on('disconnect', function () {
    io.emit('removeSnapshot', {token: socket.id});
  });
});

// listen
http.listen(port, function(){
  console.log('listening on *:' + port);
});

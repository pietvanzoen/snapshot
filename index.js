var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    uid = require('rand-token').uid;


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

http.listen(3000, function(){
  console.log('listening on *:3000');
});

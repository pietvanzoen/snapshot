// set variables
var port = Number(process.env.PORT || 4444);
var interval = (1000 * 3);
var authCreds;
// var authCreds = {
//   username: 'snap',
//   password: 'naphot'
// };

// requires
var express = require('express'),
    params = require('express-params'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// setup basic auth
if (authCreds) {
  var auth = require('http-auth');
  var basic = auth.basic({
          realm: "Snapshot"
      }, function (username, password, callback) { // Custom authentication method.
          callback(username === authCreds.username && password === authCreds.password);
      }
  );
  app.use(auth.connect(basic));
}

// apply params express plugin
params.extend(app);

// serve public files
app.use(express.static(__dirname + '/public'));

// serve index file
app.get('/', function(req, res){
  res.sendfile('views/main.html');
});

// app.param('chatid', /^\d+$/);
app.get('/chat/:chatid', function(req, res){
  // console.log(req.params.chatid);
  res.sendfile('views/chat.html');
  // console.log('test');
});


// console.log('ready');
// socket
io.on('connection', function (socket){
  // console.log('new connection', socket.id);
  // send token to app
  socket.emit('welcome', socket.id);

  // on newSnapshot broadcast to sockets and setup interval
  socket.on('newSnapshot', function (pkg){
    // console.log('new snapshot', socket.id);

    // broadcast snapshot update to other sockets
    socket.broadcast.emit('updateSnapshot', pkg);

    // reset interval when snapshot is manually triggered
    clearTimeout(socket.timeoutId);

    // setup new timeout
    socket.timeoutId = setTimeout(function () {
      socket.emit('getSnapshot');
    }, interval);

  });

  // on disconnect remove snapshots from connected sockets
  socket.on('disconnect', function () {
    io.emit('removeSnapshot', socket.id);
  });
});

// listen
http.listen(port, function(){
  console.log('listening on *:' + port);
});

var snapShot = {};
(function() {
  var self = this;

  // prepare local image object
  var package = {
    token: '',
    name: localStorage.name || prompt('Please enter your name'),
    uri: ''
  };

  // save name
  localStorage.name = package.name;

  // prep video elements
  var video = document.createElement('video');
  video.autoplay = true;

  // prepare canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = (canvas.width/1.333333333333);



  // check for getUserMedia support
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  // initiate video stream
  if (navigator.getUserMedia) {
    // get webcam feed if available
    navigator.getUserMedia({video: true}, function (stream) {
      // if found attach feed to video element
      video.src = window.URL.createObjectURL(stream);
    }, function (error) {
      console.error('video failed to load:', error);
    });
  }

  // draw image from canvas
  this.drawImage = function () {
    // if no video, exit here
    if(video.paused || video.ended) return false;

    // draw video feed to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert canvas to data URI
    return canvas.toDataURL("image/jpeg");
  };

  // remove snapshot
  this.remove = function (pkg) {
    $('#' + pkg.token).remove();
  };

  // update snapshot
  this.update = function (pkg) {
    var id = '#' + pkg.token;
    if (!$(id).length) {
      var img = $('<img/>');

      // make name changeable if rendering local snapshot
      var name;
      if (pkg.token === package.token) {
        name = $('<a>').addClass('name').attr({'href': '#', 'title': 'Change name.'}).text(pkg.name);
        name.on('click', self.updateName);
      } else {
        name = $('<p>').addClass('name').html(pkg.name);
      }

      var div = $('<div>').attr('id', pkg.token).addClass('snapshot');
      $(div).append(img, name);

      if (pkg.token === package.token) {
        $(div).addClass('self').attr('title', 'Update snapshot now.');
        $(div).on('click', self.send);
        $('#shots').prepend(div);
      } else {
        $('#shots').append(div);
      }
    }
    $(id).find('img').attr('src', pkg.uri);
    $(id).find('.name').text(pkg.name);
    // $(id).find('.time').html((new Date()).toTimeString().split(' ')[0]);
  };

  // update name click binding
  this.updateName = function (event) {
    event.preventDefault();
    var name = localStorage.name;
    var newName = prompt('Please enter a name', name);
    if (newName && newName !== name) {
      package.name = newName;
      localStorage.name = newName;
      self.send();
    }
  };

  // send snapshot
  this.send = function () {
    var datauri = self.drawImage();
    if (datauri) {
      package.uri = datauri;
      socket.emit('newSnapshot', package);
      self.update(package);
    }
  };

  // set local snapshot token
  this.setToken = function (token) {
    package.token = token;

    // on video load send first snapshot
    video.onplay = function () {
      setTimeout(self.send, 1000);
    };

  };

}).apply(snapShot);

var socket = io();

socket.on('token', snapShot.setToken);

socket.on('getSnapshot', snapShot.send);

socket.on('updateSnapshot', snapShot.update);

socket.on('removeSnapshot', snapShot.remove);

// keyboard shortcuts
$(document).on('keyup', function (event) {
  var key = {
    'space': 32,
    'n': 78
  };
  if (event.keyCode == key.space) { snapShot.send(); }
  if (event.keyCode == key.n) { snapShot.updateName(event); }
});
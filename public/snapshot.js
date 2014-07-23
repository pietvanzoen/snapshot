var socket = io();
socket.on('updateSnapshot', updateSnapshot);

socket.on('removeSnapshot', function(pkg){
  $('#' + pkg.token).remove();
  console.log(pkg.token, 'removed');
});

var token;
socket.on('token', function (tkn) {
  token = tkn;
});


function updateSnapshot(pkg) {
  var el = '#' + pkg.token;
  if (!$(el).length) {
    var img = $('<img/>');
    var p = $('<p>').html(pkg.token);
    var div = $('<div>').attr('id', pkg.token);
    $(div).append(img, p);
    $('#shots').append(div);
  }
  $(el).find('img').attr('src', pkg.uri);
}

var video = document.querySelector("#videoElement");

// check for getUserMedia support
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

if (navigator.getUserMedia) {
    // get webcam feed if available
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
    // if found attach feed to video element
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // no webcam found - do something
}
var v,canvas,context,w,h;
var imgtag = document.getElementById('imgtag'); // get reference to img tag
var sel = document.getElementById('fileselect'); // get reference to file select input element

document.addEventListener('DOMContentLoaded', function(){
    // when DOM loaded, get canvas 2D context and store width and height of element
    v = document.getElementById('videoElement');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;

},false);

function draw(v,c,w,h) {

    if(v.paused || v.ended) return false; // if no video, exit here

    context.drawImage(v,0,0,w,h); // draw video feed to canvas

   var uri = canvas.toDataURL("image/png"); // convert canvas to data URI

   // console.log(uri); // uncomment line to log URI for testing
   var pkg = { uri: uri, token: token};
   socket.emit('newSnapshot', pkg);
   updateSnapshot(pkg);

}

setInterval(function () {
  draw(v,context,w,h);
}, (5000));
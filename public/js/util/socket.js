
/**
 * @module  socket
 * @description  The socket module.
 * @author  Piet
 */
define(['io'], function (io) {

  return {
    load: function (name, req, onLoad, config) {
      var socket = io.connect(location.origin);
      socket.on('welcome', function (id) {
        socket.id = id;
        onLoad(socket);
      });
    }
  };

});
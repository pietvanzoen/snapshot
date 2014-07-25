
/**
 * @module  socket
 * @description  The socket module.
 * @author  Piet
 */
define(['io'], function (io) {

  console.log('socket connected');
  return io.connect(location.origin);

});
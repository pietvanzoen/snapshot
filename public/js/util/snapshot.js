

/**
 * @module  snapshot
 * @description  The snapshot module.
 * @author  Piet
 */
define(['lodash', 'ko'], function (_, ko) {

  /**
  * Module variables
  */
  var Snapshot = function (options) {
    console.log('snapshot');

    this.imageFormat = 'image/jpeg';

    this.width = 300;
    this.height = (this.width/1.333333333333);

    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    this.ready = ko.observable(false);

    this.initialize();
  };

  /**
  * Module methods
  */
  _.extend(Snapshot.prototype, {

    initialize: function () {

      this.initVideo();

    },

    initVideo: function () {
      var self = this;

      // check for getUserMedia support
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

      // initiate video stream
      if (navigator.getUserMedia) {
        // get webcam feed if available
        navigator.getUserMedia({video: true}, function (stream) {
          // if found attach feed to video element
          self.video.src = window.URL.createObjectURL(stream);
          self.video.onplay = function (event) {
            self.ready(true);
          };
        }, function (error) {
          console.error('video failed to load:', error);
        });
      }

    },

    drawImage: function () {
      // if no video, exit here
      if(this.video.paused || this.video.ended) return false;

      // draw video feed to canvas
      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      // convert canvas to data URI
      return this.canvas.toDataURL(this.imageFormat);
    }

  });

  return new Snapshot();

});


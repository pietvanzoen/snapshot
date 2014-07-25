

/**
 * @module  snapshot
 * @description  The snapshot module.
 * @author  Piet
 */
define(['lodash', 'ko', 'util/webrtc!'], function (_, ko, webrtc) {

  /**
  * Module variables
  */
  var Snapshot = function (options) {

    this.imageFormat = 'image/jpeg';

    this.width = 300;
    this.height = (this.width/1.333333333333);

    this.video = webrtc.video;
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


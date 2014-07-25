
/**
 * @module  webrtc
 * @description  The webrtc module.
 * @author  Piet
 */
define(['lodash', 'simplewebrtc'], function (_, SimpleWebRTC) {

  /**
  * Module variables
  */
  var Webrtc = function (options) {

    this.video = document.createElement('video');
    this.remotesVideos = document.createElement('div');

    this.initialize();
  };

  /**
  * Module methods
  */
  _.extend(Webrtc.prototype, {

    initialize: function () {

      var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: this.video,
        // the id/element dom element that will hold remote videos
        remoteVideosEl: this.remotesVideos,
        // immediately ask for camera access
        autoRequestMedia: true
      });

    }

  });

  var wrtc = new Webrtc();

  return {
    load: function (name, req, onLoad, config) {
      wrtc.video.onplay = function () {
        onLoad(wrtc);
      };
    }
  };

});